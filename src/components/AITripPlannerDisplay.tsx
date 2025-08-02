import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { X, ChevronDown, ChevronUp } from "lucide-react";

interface AITripPlannerDisplayProps {
  messages: Array<{ role: 'user' | 'assistant'; content: string; timestamp: Date }>;
  onClose: () => void;
}

const AITripPlannerDisplay: React.FC<AITripPlannerDisplayProps> = ({ messages, onClose }) => {
  const [expandedMessages, setExpandedMessages] = useState<Set<number>>(new Set());
  const assistantMessages = messages.filter(msg => msg.role === 'assistant');
  
  if (assistantMessages.length === 0) return null;

  // Function to clean HTML and extract plain text
  const cleanHtmlToText = (html: string): string => {
    const parser = new DOMParser();
    const doc = parser.parseFromString(html, 'text/html');
    return doc.body.textContent || doc.body.innerText || '';
  };

  // Function to truncate text to first 100 words
  const truncateText = (text: string, wordLimit: number = 100): { truncated: string; hasMore: boolean } => {
    const words = text.split(' ');
    if (words.length <= wordLimit) {
      return { truncated: text, hasMore: false };
    }
    return {
      truncated: words.slice(0, wordLimit).join(' ') + '...',
      hasMore: true
    };
  };

  const toggleExpanded = (messageIndex: number) => {
    const newExpanded = new Set(expandedMessages);
    if (newExpanded.has(messageIndex)) {
      newExpanded.delete(messageIndex);
    } else {
      newExpanded.add(messageIndex);
    }
    setExpandedMessages(newExpanded);
  };

  return (
    <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4 overflow-auto">
      <div className="bg-white rounded-2xl max-w-6xl w-full max-h-[90vh] overflow-y-auto relative">
        {/* Close Button */}
        <div className="sticky top-0 bg-white border-b p-4 flex justify-between items-center z-10">
          <h2 className="text-xl font-bold text-gray-800">Your Custom Trip Plan</h2>
          <Button
            onClick={onClose}
            variant="ghost"
            size="sm"
            className="text-gray-500 hover:text-gray-700"
          >
            <X className="w-5 h-5" />
          </Button>
        </div>
        
        {/* Content */}
        <div>
          {assistantMessages.map((message, index) => {
            const isExpanded = expandedMessages.has(index);
            
            // Check if content contains HTML structure
            const hasStructuredContent = message.content.includes('trip-header') || 
                                       message.content.includes('trip-overview') || 
                                       message.content.includes('trip-day-card');
            
            if (hasStructuredContent) {
              // For structured HTML content, show full content with HTML formatting
              return (
                <div key={index} className="mb-8">
                  <div 
                    className="prose prose-lg max-w-none"
                    dangerouslySetInnerHTML={{ __html: message.content }}
                    style={{
                      fontSize: 'inherit',
                      lineHeight: 'inherit'
                    }}
                  />
                </div>
              );
            } else {
              // For plain text content, apply truncation
              const cleanText = cleanHtmlToText(message.content);
              const { truncated, hasMore } = truncateText(cleanText, 100);
              
              return (
                <div key={index} className="mb-8">
                  <div className="prose prose-lg max-w-none text-gray-800 leading-relaxed whitespace-pre-line">
                    {isExpanded ? cleanText : truncated}
                    {hasMore && (
                      <button
                        onClick={() => toggleExpanded(index)}
                        className="ml-2 inline-flex items-center gap-1 text-blue-600 hover:text-blue-800 transition-colors font-medium mt-2"
                      >
                        {isExpanded ? (
                          <>
                            Show Less <ChevronUp className="w-4 h-4" />
                          </>
                        ) : (
                          <>
                            Show More <ChevronDown className="w-4 h-4" />
                          </>
                        )}
                      </button>
                    )}
                  </div>
                </div>
              );
            }
          })}
        </div>
      </div>
    </div>
  );
};

export default AITripPlannerDisplay;
