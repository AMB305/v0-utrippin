import React, { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Loader2, MapPin, Calendar, Download, Mail, Plane, Hotel } from 'lucide-react';
import { toast } from 'sonner';
import { ExpediaButton } from '@/components/ExpediaButton';
import { buildFlightUrl, buildHotelUrl } from '@/utils/buildAffiliateUrl';
import html2pdf from 'html2pdf.js';

const ItineraryDisplay: React.FC = () => {
  const [city, setCity] = useState('');
  const [date, setDate] = useState('');
  const [markdown, setMarkdown] = useState('');
  const [loading, setLoading] = useState(false);
  const [email, setEmail] = useState('');
  const [emailSending, setEmailSending] = useState(false);

  const fetchItinerary = async () => {
    if (!city || !date) {
      toast.error('Please enter both city and date');
      return;
    }

    setLoading(true);
    try {
      const { data, error } = await supabase.functions.invoke('call-gemini-formatted-itinerary', {
        body: { city, date, budget: 500 }
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

  const downloadPDF = () => {
    const element = document.getElementById('markdown-preview');
    if (element) {
      const opt = {
        margin: 1,
        filename: `${city}_itinerary_${date}.pdf`,
        image: { type: 'jpeg', quality: 0.98 },
        html2canvas: { scale: 2 },
        jsPDF: { unit: 'in', format: 'letter', orientation: 'portrait' }
      };
      html2pdf().set(opt).from(element).save();
      toast.success('PDF download started!');
    }
  };

  const sendEmail = async () => {
    if (!email) {
      toast.error('Please enter your email address');
      return;
    }

    setEmailSending(true);
    try {
      // For now, we'll copy to clipboard since email function needs to be implemented
      await navigator.clipboard.writeText(markdown);
      toast.success('Itinerary copied to clipboard! Email feature coming soon.');
    } catch (error) {
      toast.error('Failed to copy itinerary');
    } finally {
      setEmailSending(false);
    }
  };

  const getFlightUrl = () => {
    return buildFlightUrl({
      origin: 'YOUR_CITY', // This would ideally come from user input or geolocation
      destination: city,
      departDate: date,
      adults: 1
    });
  };

  const getHotelUrl = () => {
    return buildHotelUrl({
      destination: city,
      startDate: date,
      endDate: date, // This could be calculated based on trip duration
      adults: 1
    });
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
        <>
          {/* Action Buttons */}
          <Card className="mb-6">
            <CardContent className="p-6">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-4">
                <ExpediaButton
                  destinationUrl={getFlightUrl()}
                  label="Book Flight"
                  variant="default"
                  className="w-full"
                />
                <ExpediaButton
                  destinationUrl={getHotelUrl()}
                  label="Book Hotel"
                  variant="secondary"
                  className="w-full"
                />
                <Button 
                  onClick={downloadPDF}
                  variant="outline"
                  className="w-full"
                >
                  <Download className="mr-2 h-4 w-4" />
                  Download PDF
                </Button>
                <Button 
                  onClick={sendEmail}
                  disabled={emailSending}
                  variant="outline"
                  className="w-full"
                >
                  {emailSending ? (
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  ) : (
                    <Mail className="mr-2 h-4 w-4" />
                  )}
                  Email Copy
                </Button>
              </div>
              
              {/* Email Input */}
              <div className="flex flex-col sm:flex-row gap-2">
                <Input
                  type="email"
                  placeholder="Enter your email for itinerary copy"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="flex-1"
                />
                <Button 
                  onClick={sendEmail}
                  disabled={emailSending || !email}
                  variant="default"
                  size="sm"
                >
                  {emailSending ? (
                    <Loader2 className="h-4 w-4 animate-spin" />
                  ) : (
                    'Send'
                  )}
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Itinerary Display */}
          <Card>
            <CardContent className="p-6">
              <div id="markdown-preview" className="prose prose-lg max-w-none dark:prose-invert">
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
        </>
      )}
    </div>
  );
};

export default ItineraryDisplay;
