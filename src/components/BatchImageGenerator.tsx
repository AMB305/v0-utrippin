import React, { useState, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { supabase } from '@/integrations/supabase/client';
import { Download, ImageIcon, CheckCircle, XCircle, AlertCircle } from 'lucide-react';

interface ImageRequest {
  prompt: string;
  file_path: string;
}

interface GenerationResult {
  file_path: string;
  status: 'pending' | 'generating' | 'success' | 'error';
  imageUrl?: string;
  error?: string;
}

// Import the full 180 image generation list
import imagesToGenerateData from '@/data/imagesToGenerate.json';

const imagesToGenerate: ImageRequest[] = imagesToGenerateData;

const BatchImageGenerator: React.FC = () => {
  const [isGenerating, setIsGenerating] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [results, setResults] = useState<GenerationResult[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [progress, setProgress] = useState(0);
  const [estimatedTimeRemaining, setEstimatedTimeRemaining] = useState<string>('');
  const [rateLimitInfo, setRateLimitInfo] = useState<string>('');
  const downloadLinksRef = useRef<{ [key: string]: string }>({});
  const abortControllerRef = useRef<AbortController | null>(null);

  const generateSingleImage = async (request: ImageRequest, retryCount = 0): Promise<GenerationResult> => {
    const maxRetries = 3;
    
    try {
      console.log(`Generating image for: ${request.file_path} (attempt ${retryCount + 1})`);
      
      const { data, error } = await supabase.functions.invoke('openai-image-generation', {
        body: {
          prompt: request.prompt,
          size: "1792x1024", // High quality landscape format
          quality: "hd",
          style: "vivid"
        }
      });

      if (error) throw error;

      if (data.success && data.imageUrl) {
        // Store the base64 image URL for download
        downloadLinksRef.current[request.file_path] = data.imageUrl;
        
        return {
          file_path: request.file_path,
          status: 'success',
          imageUrl: data.imageUrl
        };
      } else {
        throw new Error(data.error || 'Failed to generate image');
      }
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error';
      console.error(`Error generating image for ${request.file_path}:`, errorMessage);
      
      // Check if it's a rate limit error and retry if possible
      if (errorMessage.includes('rate_limit_exceeded') && retryCount < maxRetries) {
        console.log(`Rate limit hit, retrying in 15 seconds... (${retryCount + 1}/${maxRetries})`);
        setRateLimitInfo(`Rate limit exceeded. Retrying in 15 seconds... (${retryCount + 1}/${maxRetries})`);
        
        // Wait 15 seconds before retry for rate limit errors
        await new Promise(resolve => setTimeout(resolve, 15000));
        setRateLimitInfo('');
        
        return generateSingleImage(request, retryCount + 1);
      }
      
      return {
        file_path: request.file_path,
        status: 'error',
        error: errorMessage
      };
    }
  };

  const downloadImage = (result: GenerationResult) => {
    if (!result.imageUrl) return;
    
    const link = document.createElement('a');
    link.href = result.imageUrl;
    link.download = result.file_path.split('/').pop() || 'generated-image.png';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const downloadAllImages = () => {
    const successfulResults = results.filter(r => r.status === 'success');
    successfulResults.forEach(result => {
      setTimeout(() => downloadImage(result), 100); // Small delay between downloads
    });
  };

  const pauseGeneration = () => {
    setIsPaused(true);
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
    }
  };

  const resumeGeneration = () => {
    setIsPaused(false);
    // Find the next pending image and continue from there
    const nextIndex = results.findIndex(r => r.status === 'pending');
    if (nextIndex !== -1) {
      continueGeneration(nextIndex);
    }
  };

  const continueGeneration = async (startFromIndex: number) => {
    setIsGenerating(true);
    setIsPaused(false);
    abortControllerRef.current = new AbortController();

    const totalImages = imagesToGenerate.length;
    const startTime = Date.now();

    for (let i = startFromIndex; i < totalImages; i++) {
      // Check if generation was paused or aborted
      if (isPaused || abortControllerRef.current?.signal.aborted) {
        setIsGenerating(false);
        return;
      }

      const request = imagesToGenerate[i];
      
      // Update status to generating for current image
      setResults(prev => prev.map((result, index) => 
        index === i ? { ...result, status: 'generating' } : result
      ));
      
      setCurrentIndex(i + 1);
      
      // Calculate estimated time remaining
      const elapsed = Date.now() - startTime;
      const avgTimePerImage = elapsed / (i - startFromIndex + 1);
      const remaining = totalImages - (i + 1);
      const estimatedMs = remaining * avgTimePerImage + (remaining * 12000); // Include 12s delay
      const estimatedMinutes = Math.ceil(estimatedMs / 60000);
      setEstimatedTimeRemaining(`~${estimatedMinutes} minutes remaining`);

      // Generate single image
      const result = await generateSingleImage(request);
      
      // Update results
      setResults(prev => prev.map((r, index) => 
        index === i ? result : r
      ));
      
      setProgress(((i + 1) / totalImages) * 100);
      
      // Rate limiting: Wait 12 seconds between each image (5 images per minute limit)
      if (i < totalImages - 1) {
        setRateLimitInfo('Waiting 12 seconds for rate limit compliance...');
        await new Promise(resolve => setTimeout(resolve, 12000));
        setRateLimitInfo('');
      }
    }

    setIsGenerating(false);
    setEstimatedTimeRemaining('');
    setRateLimitInfo('Generation complete!');
  };

  const startBatchGeneration = async () => {
    setResults([]);
    setCurrentIndex(0);
    setProgress(0);
    setEstimatedTimeRemaining('');
    setRateLimitInfo('');
    downloadLinksRef.current = {};

    // Initialize results with pending status
    const initialResults: GenerationResult[] = imagesToGenerate.map(req => ({
      file_path: req.file_path,
      status: 'pending'
    }));
    setResults(initialResults);

    // Calculate initial time estimate (12 seconds per image)
    const totalMinutes = Math.ceil((imagesToGenerate.length * 12) / 60);
    setEstimatedTimeRemaining(`~${totalMinutes} minutes total estimated`);

    // Start generation from index 0
    await continueGeneration(0);
  };

  const getStatusIcon = (status: GenerationResult['status']) => {
    switch (status) {
      case 'success':
        return <CheckCircle className="w-4 h-4 text-green-500" />;
      case 'error':
        return <XCircle className="w-4 h-4 text-red-500" />;
      case 'generating':
        return <AlertCircle className="w-4 h-4 text-blue-500 animate-pulse" />;
      default:
        return <ImageIcon className="w-4 h-4 text-gray-400" />;
    }
  };

  const getStatusBadge = (status: GenerationResult['status']) => {
    const variants = {
      pending: 'secondary',
      generating: 'default',
      success: 'success' as any,
      error: 'destructive'
    };
    return variants[status] || 'secondary';
  };

  const successCount = results.filter(r => r.status === 'success').length;
  const errorCount = results.filter(r => r.status === 'error').length;

  return (
    <div className="p-6 max-w-6xl mx-auto space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <ImageIcon className="w-6 h-6" />
            AI Image Batch Generator
          </CardTitle>
          <p className="text-muted-foreground">
            Generate {imagesToGenerate.length} high-quality travel images using DALL-E 3
          </p>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center gap-4 flex-wrap">
            <Button 
              onClick={startBatchGeneration} 
              disabled={isGenerating && !isPaused}
              size="lg"
            >
              {isGenerating && !isPaused ? 'Generating...' : 'Start Batch Generation'}
            </Button>
            
            {isGenerating && !isPaused && (
              <Button 
                onClick={pauseGeneration}
                variant="outline"
                size="lg"
              >
                Pause Generation
              </Button>
            )}
            
            {isPaused && (
              <Button 
                onClick={resumeGeneration}
                variant="outline"
                size="lg"
              >
                Resume Generation
              </Button>
            )}
            
            {results.length > 0 && successCount > 0 && (
              <Button 
                onClick={downloadAllImages}
                variant="outline"
                className="gap-2"
              >
                <Download className="w-4 h-4" />
                Download All ({successCount})
              </Button>
            )}
          </div>

          {(isGenerating || results.length > 0) && (
            <div className="space-y-3">
              <div className="flex justify-between text-sm">
                <span>Progress: {currentIndex} / {imagesToGenerate.length}</span>
                <span>{Math.round(progress)}%</span>
              </div>
              <Progress value={progress} className="w-full" />
              
              {estimatedTimeRemaining && (
                <p className="text-sm text-muted-foreground">{estimatedTimeRemaining}</p>
              )}
              
              {rateLimitInfo && (
                <div className="flex items-center gap-2 text-sm text-amber-600">
                  <AlertCircle className="w-4 h-4" />
                  {rateLimitInfo}
                </div>
              )}
              
              <div className="text-xs text-muted-foreground">
                ⚠️ Rate limited to 1 image every 12 seconds (OpenAI limit: 5 images/minute)
              </div>
            </div>
          )}

          {results.length > 0 && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mt-6">
              <div className="lg:col-span-3 flex gap-4 mb-4">
                <Badge variant="outline" className="gap-1">
                  <CheckCircle className="w-3 h-3 text-green-500" />
                  Success: {successCount}
                </Badge>
                <Badge variant="outline" className="gap-1">
                  <XCircle className="w-3 h-3 text-red-500" />
                  Errors: {errorCount}
                </Badge>
                <Badge variant="outline" className="gap-1">
                  <AlertCircle className="w-3 h-3 text-blue-500" />
                  Pending: {results.filter(r => ['pending', 'generating'].includes(r.status)).length}
                </Badge>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {results.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Generation Results</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2 max-h-96 overflow-y-auto">
              {results.map((result, index) => (
                <div 
                  key={result.file_path} 
                  className="flex items-center justify-between p-3 border rounded-lg"
                >
                  <div className="flex items-center gap-3 flex-1">
                    {getStatusIcon(result.status)}
                    <div className="flex-1">
                      <p className="text-sm font-medium truncate">
                        {result.file_path}
                      </p>
                      {result.error && (
                        <p className="text-xs text-red-500 mt-1">{result.error}</p>
                      )}
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-2">
                    <Badge variant={getStatusBadge(result.status)}>
                      {result.status}
                    </Badge>
                    
                    {result.status === 'success' && result.imageUrl && (
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => downloadImage(result)}
                        className="gap-1"
                      >
                        <Download className="w-3 h-3" />
                        Download
                      </Button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default BatchImageGenerator;