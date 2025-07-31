import React, { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Loader2, MapPin, Calendar } from 'lucide-react';
import { toast } from 'sonner';

const ItineraryDisplay: React.FC = () => {
  const [city, setCity] = useState('');
  const [date, setDate] = useState('');
  const [markdown, setMarkdown] = useState('');
  const [loading, setLoading] = useState(false);

  const fetchItinerary = async () => {
    if (!city || !date) {
      toast.error('Please enter both city and date');
      return;
    }

    setLoading(true);
    try {
      const { data, error } = await supabase.functions.invoke('call-gemini-formatted-itinerary', {
        body: { city, date }
      });
      
      if (error) {
        console.error('Error:', error);
        toast.error('Failed to generate itinerary');
        return;
      }

      if (data?.markdown) {
        setMarkdown(data.markdown);
        toast.success('Itinerary generated successfully!');
      } else {
        toast.error('No itinerary data received');
      }
    } catch (error) {
      console.error('Error fetching itinerary:', error);
      toast.error('Failed to generate itinerary');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      <Card className="mb-8">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-2xl">
            📆 AI Travel Itinerary Generator
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col sm:flex-row gap-4 mb-4">
            <div className="flex-1">
              <div className="relative">
                <MapPin className="absolute left-3 top-1/2 transform -y-1/2 text-muted-foreground h-4 w-4" />
                <Input
                  type="text"
                  placeholder="Enter city (e.g., Barcelona)"
                  className="pl-10"
                  value={city}
                  onChange={(e) => setCity(e.target.value)}
                />
              </div>
            </div>
            <div className="flex-1">
              <div className="relative">
                <Calendar className="absolute left-3 top-1/2 transform -y-1/2 text-muted-foreground h-4 w-4" />
                <Input
                  type="date"
                  className="pl-10"
                  value={date}
                  onChange={(e) => setDate(e.target.value)}
                />
              </div>
            </div>
            <Button 
              onClick={fetchItinerary} 
              disabled={loading}
              className="px-8"
            >
              {loading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Generating...
                </>
              ) : (
                'Generate Itinerary'
              )}
            </Button>
          </div>
        </CardContent>
      </Card>

      {markdown && (
        <Card>
          <CardContent className="p-6">
            <div className="prose prose-lg max-w-none dark:prose-invert">
              <ReactMarkdown 
                remarkPlugins={[remarkGfm]}
                components={{
                  table: ({ children }) => (
                    <div className="overflow-x-auto">
                      <table className="min-w-full border-collapse border border-border">
                        {children}
                      </table>
                    </div>
                  ),
                  th: ({ children }) => (
                    <th className="border border-border px-4 py-2 bg-muted font-semibold text-left">
                      {children}
                    </th>
                  ),
                  td: ({ children }) => (
                    <td className="border border-border px-4 py-2">
                      {children}
                    </td>
                  ),
                  h2: ({ children }) => (
                    <h2 className="text-2xl font-bold text-primary mb-4 mt-8 first:mt-0">
                      {children}
                    </h2>
                  ),
                  h3: ({ children }) => (
                    <h3 className="text-xl font-semibold text-foreground mb-3 mt-6">
                      {children}
                    </h3>
                  ),
                  ul: ({ children }) => (
                    <ul className="list-disc list-inside space-y-2 mb-4">
                      {children}
                    </ul>
                  ),
                  li: ({ children }) => (
                    <li className="text-foreground">
                      {children}
                    </li>
                  ),
                  p: ({ children }) => (
                    <p className="text-foreground mb-4 leading-relaxed">
                      {children}
                    </p>
                  ),
                  strong: ({ children }) => (
                    <strong className="font-semibold text-primary">
                      {children}
                    </strong>
                  )
                }}
              >
                {markdown}
              </ReactMarkdown>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default ItineraryDisplay;