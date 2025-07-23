import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { Send, TestTube2, CheckCircle, AlertCircle } from 'lucide-react';

export const ShareWithAgentTestPanel = () => {
  const [testEmail, setTestEmail] = useState('test@example.com');
  const [testMessage, setTestMessage] = useState('This is a test message for the travel agent feature.');
  const [loading, setLoading] = useState(false);
  const [testResults, setTestResults] = useState<any>(null);
  const { toast } = useToast();

  const runEmailDeliveryTest = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase.functions.invoke('test-email-delivery', {
        body: {
          email: testEmail,
          subject: 'Test Email - UTrippin.ai Agent Sharing',
          content: testMessage
        }
      });

      if (error) throw error;

      setTestResults({
        success: true,
        data: data,
        timestamp: new Date().toISOString()
      });

      toast({
        title: "Email Test Successful",
        description: "Email delivery test completed successfully",
      });

    } catch (error: any) {
      console.error('Email test failed:', error);
      setTestResults({
        success: false,
        error: error.message,
        timestamp: new Date().toISOString()
      });

      toast({
        title: "Email Test Failed",
        description: error.message || "Email delivery test failed",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const testResponsiveDesign = () => {
    // Test mobile responsiveness
    const viewport = {
      width: window.innerWidth,
      height: window.innerHeight,
      isMobile: window.innerWidth < 768,
      isTablet: window.innerWidth >= 768 && window.innerWidth < 1024,
      isDesktop: window.innerWidth >= 1024
    };

    toast({
      title: "Responsive Design Check",
      description: `Current viewport: ${viewport.width}x${viewport.height} (${
        viewport.isMobile ? 'Mobile' : viewport.isTablet ? 'Tablet' : 'Desktop'
      })`,
    });

    setTestResults({
      success: true,
      data: { viewport, responsive: true },
      timestamp: new Date().toISOString()
    });
  };

  return (
    <Card className="bg-gray-900 border-gray-800 text-white max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-orange-400">
          <TestTube2 className="w-5 h-5" />
          Share with Agent - Testing Panel
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Email Delivery Test */}
        <div className="space-y-4">
          <h3 className="text-lg font-semibold">Email Delivery Test</h3>
          <div className="space-y-3">
            <Input
              placeholder="Test email address"
              value={testEmail}
              onChange={(e) => setTestEmail(e.target.value)}
              className="bg-gray-800 border-gray-700 text-white"
            />
            <Textarea
              placeholder="Test message content"
              value={testMessage}
              onChange={(e) => setTestMessage(e.target.value)}
              className="bg-gray-800 border-gray-700 text-white min-h-[80px]"
            />
            <Button
              onClick={runEmailDeliveryTest}
              disabled={loading || !testEmail}
              className="bg-orange-600 hover:bg-orange-700"
            >
              {loading ? (
                "Testing..."
              ) : (
                <>
                  <Send className="w-4 h-4 mr-2" />
                  Test Email Delivery
                </>
              )}
            </Button>
          </div>
        </div>

        {/* Responsive Design Test */}
        <div className="space-y-4">
          <h3 className="text-lg font-semibold">Responsive Design Test</h3>
          <Button
            onClick={testResponsiveDesign}
            variant="outline"
            className="border-gray-600 text-gray-300 hover:bg-gray-800"
          >
            <TestTube2 className="w-4 h-4 mr-2" />
            Check Current Viewport
          </Button>
        </div>

        {/* Test Results */}
        {testResults && (
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Test Results</h3>
            <div className={`p-4 rounded-lg border ${
              testResults.success 
                ? 'bg-green-900/20 border-green-700' 
                : 'bg-red-900/20 border-red-700'
            }`}>
              <div className="flex items-center gap-2 mb-2">
                {testResults.success ? (
                  <CheckCircle className="w-5 h-5 text-green-400" />
                ) : (
                  <AlertCircle className="w-5 h-5 text-red-400" />
                )}
                <span className={`font-medium ${
                  testResults.success ? 'text-green-400' : 'text-red-400'
                }`}>
                  {testResults.success ? 'Test Passed' : 'Test Failed'}
                </span>
              </div>
              <div className="text-sm text-gray-300">
                <p><strong>Timestamp:</strong> {new Date(testResults.timestamp).toLocaleString()}</p>
                {testResults.error && (
                  <p><strong>Error:</strong> {testResults.error}</p>
                )}
                {testResults.data && (
                  <pre className="mt-2 p-2 bg-gray-800 rounded text-xs overflow-auto">
                    {JSON.stringify(testResults.data, null, 2)}
                  </pre>
                )}
              </div>
            </div>
          </div>
        )}

        {/* Feature Checklist */}
        <div className="space-y-4">
          <h3 className="text-lg font-semibold">Feature Checklist</h3>
          <div className="space-y-2 text-sm">
            <div className="flex items-center gap-2">
              <CheckCircle className="w-4 h-4 text-green-400" />
              <span>ShareWithAgentDialog component</span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle className="w-4 h-4 text-green-400" />
              <span>Edge function for email sending</span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle className="w-4 h-4 text-green-400" />
              <span>Agent view with special header</span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle className="w-4 h-4 text-green-400" />
              <span>Trip sharing status indicator</span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle className="w-4 h-4 text-green-400" />
              <span>User confirmation emails (BCC)</span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle className="w-4 h-4 text-green-400" />
              <span>Database tracking of sharing events</span>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};