import BatchImageGenerator from '@/components/BatchImageGenerator';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ImageIcon, Zap, Download, CheckCircle } from 'lucide-react';

const ImageGeneration = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-background to-muted p-6">
      <div className="max-w-7xl mx-auto space-y-8">
        
        {/* Header */}
        <div className="text-center space-y-4">
          <h1 className="text-4xl font-bold flex items-center justify-center gap-3">
            <ImageIcon className="w-10 h-10 text-primary" />
            AI Image Generation Suite
          </h1>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            Generate 180 high-quality travel images using DALL-E 3 to replace all existing images across the Utrippin platform
          </p>
        </div>

        {/* Features Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card>
            <CardHeader className="text-center">
              <Zap className="w-12 h-12 text-primary mx-auto mb-2" />
              <CardTitle>DALL-E 3 Powered</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground text-center">
                High-quality 8K photorealistic travel magazine style images generated with OpenAI's latest model
              </p>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="text-center">
              <Download className="w-12 h-12 text-primary mx-auto mb-2" />
              <CardTitle>Batch Processing</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground text-center">
                Generate all 180 images systematically with progress tracking and automatic downloads
              </p>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="text-center">
              <CheckCircle className="w-12 h-12 text-primary mx-auto mb-2" />
              <CardTitle>Site-wide Updates</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground text-center">
                All components and data files updated to reference new AI-generated images automatically
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Batch Generator */}
        <BatchImageGenerator />
        
      </div>
    </div>
  );
};

export default ImageGeneration;
