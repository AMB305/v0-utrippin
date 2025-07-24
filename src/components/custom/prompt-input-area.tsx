import {
  ArrowUp,
  BabyIcon,
  BikeIcon,
  LightbulbIcon,
  Loader,
  Plus,
  SparklesIcon,
  TicketIcon,
  WineIcon,
  X,
} from 'lucide-react';
import { Button } from '../ui/button';
import { Textarea } from '../ui/textarea';
import { useRef, useState, useEffect } from 'react';
import { Tooltip, TooltipContent, TooltipTrigger } from '../ui/tooltip';
import { cn } from '@/lib/utils';

interface PromptInputAreaProps {
  showSuggestions?: boolean;
  onSubmit: (message: string, files: File[]) => Promise<void>;
  className?: string;
}

export const PromptInputArea = ({
  showSuggestions = true,
  className,
  onSubmit,
}: PromptInputAreaProps) => {
  const [isLoading, setIsLoading] = useState(false);
  const [input, setInput] = useState("");
  const [files, setFiles] = useState<File[]>([]);
  const uploadInputRef = useRef<HTMLInputElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  // Auto-resize textarea based on content
  useEffect(() => {
    const textarea = textareaRef.current;
    if (textarea) {
      // Reset height to auto to get the correct scrollHeight
      textarea.style.height = 'auto';
      // Set height to scrollHeight with a reasonable max height
      const newHeight = Math.min(textarea.scrollHeight, 300); // Max height of 300px
      textarea.style.height = `${newHeight}px`;
    }
  }, [input]);

  const suggestionPrompts = [
    {
      icon: <TicketIcon className="text-green-600 size-4" />,
      value: 'Create a new trip',
    },
    {
      icon: <LightbulbIcon className="text-cyan-600 size-4" />,
      value: 'Get inspired',
    },
    {
      icon: <SparklesIcon className="text-indigo-600 size-4" />,
      value: 'Inspire me where to go',
    },
    {
      icon: <BikeIcon className="text-yellow-600 size-4" />,
      value: 'Solo trip',
    },
    {
      icon: <WineIcon className="text-pink-600 size-4" />,
      value: 'Partner',
    },
    {
      icon: <BabyIcon className="text-pink-500 size-4" />,
      value: 'Family',
    },
  ];

  const handleSubmit = async () => {
    if (input.trim() || files.length > 0) {
      const messageToSend = input.trim();
      const filesToSend = [...files];
      
      // Clear input immediately for better UX
      setInput('');
      setFiles([]);
      setIsLoading(true);
      
      try {
        await onSubmit(messageToSend, filesToSend);
      } catch (error) {
        console.error('Error submitting message:', error);
      } finally {
        setTimeout(() => {
          setIsLoading(false);
        }, 1000);
      }
    }
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files) {
      const newFiles = Array.from(event.target.files);
      setFiles((prev) => [...prev, ...newFiles]);
    }
  };

  const handleRemoveFile = (index: number) => {
    setFiles((prev) => prev.filter((_, i) => i !== index));
    if (uploadInputRef?.current) {
      uploadInputRef.current.value = '';
    }
  };

  const handleSuggestionClick = async (promptValue: string) => {
    setIsLoading(true);
    
    try {
      await onSubmit(promptValue, []);
    } catch (error) {
      console.error('Error submitting suggestion:', error);
    } finally {
      setTimeout(() => {
        setIsLoading(false);
      }, 1000);
    }
  };

  return (
    <div className={cn("flex flex-col gap-4 w-full", className)}>
      <div className="w-full rounded-xl bg-card relative overflow-hidden border-2 border-primary/20">
        <div 
          className="pointer-events-none absolute inset-0 size-full rounded-[inherit] will-change-[background-position] motion-safe:animate-shine" 
          style={{
            '--border-width': '1px',
            '--duration': '4s',
            backgroundImage: 'radial-gradient(transparent, transparent, rgb(160, 124, 254), rgb(254, 143, 181), rgb(255, 190, 123), transparent, transparent)',
            backgroundSize: '300%',
            mask: 'linear-gradient(rgb(255, 255, 255) 0px, rgb(255, 255, 255) 0px) content-box exclude, linear-gradient(rgb(255, 255, 255) 0px, rgb(255, 255, 255) 0px)',
            padding: 'var(--border-width)',
            opacity: 0.8
          } as React.CSSProperties}
        ></div>
        
        <Textarea
          ref={textareaRef}
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === 'Enter' && !e.shiftKey) {
              e.preventDefault();
              handleSubmit();
            }
          }}
          className="flex w-full rounded-xl px-4 py-3 leading-relaxed text-foreground placeholder:text-muted-foreground/70 focus-visible:outline-none [resize:none] shadow-none border-none focus-visible:ring-0 bg-transparent min-h-[60px] overflow-hidden"
          placeholder="Ask me anything about your trip.."
          aria-label="Enter your prompt"
          style={{ height: 'auto' }}
        />
        
        <div className="flex items-center justify-between gap-2 py-2 px-3 bg-transparent transition-colors">
          <div className="flex items-center gap-2">
            <Tooltip>
              <TooltipTrigger asChild>
                <label
                  htmlFor="file-upload"
                  className="hover:bg-card-foreground/10 border border-input flex h-8 w-8 cursor-pointer items-center justify-center rounded-2xl"
                >
                  <input
                    type="file"
                    multiple
                    onChange={handleFileChange}
                    className="hidden"
                    id="file-upload"
                    ref={uploadInputRef}
                  />
                  <Plus className="size-3" />
                </label>
              </TooltipTrigger>
              <TooltipContent>
                <p className="text-xs">Attach files</p>
              </TooltipContent>
            </Tooltip>

            {files.length > 0 && (
              <div className="flex flex-wrap gap-2">
                {files.map((file, index) => (
                  <Tooltip key={index}>
                    <TooltipTrigger asChild>
                      <div className="bg-secondary flex items-center gap-2 rounded-lg px-3 py-2 text-sm">
                        <span className="max-w-[120px] truncate">
                          {file.name}
                        </span>
                        <button
                          onClick={() => handleRemoveFile(index)}
                          className="hover:bg-secondary/50 rounded-full p-1"
                        >
                          <X className="size-4" />
                        </button>
                      </div>
                    </TooltipTrigger>
                    <TooltipContent>
                      <p className="text-xs">{file.name}</p>
                    </TooltipContent>
                  </Tooltip>
                ))}
              </div>
            )}
          </div>
          
          <Button
            size="icon"
            className="rounded-full size-8 cursor-pointer bg-primary hover:bg-primary/90"
            onClick={handleSubmit}
            type="submit"
          >
            {isLoading ? (
              <Loader className="w-[7px] h-[7px] animate-spin" />
            ) : (
              <ArrowUp className="w-[7px] h-[7px]" />
            )}
          </Button>
        </div>
      </div>
      
      {showSuggestions && (
        <div className="flex flex-wrap gap-2 items-center justify-center">
          {suggestionPrompts.map((prompt) => (
            <Button
              variant="outline"
              className="border-2 border-input gap-2 px-5 font-normal cursor-pointer text-neutral-500 hover:bg-primary/10"
              key={prompt.value}
              onClick={() => handleSuggestionClick(prompt.value)}
              disabled={isLoading}
            >
              <div className="hidden md:block">{prompt.icon}</div>
              {prompt.value}
            </Button>
          ))}
        </div>
      )}
    </div>
  );
}; 