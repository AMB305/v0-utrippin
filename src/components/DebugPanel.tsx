import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { duffelClient } from '@/lib/duffel';
import { supabase } from '@/integrations/supabase/client';

export const DebugPanel = () => {
  const [testQuery, setTestQuery] = useState('DCA');
  const [results, setResults] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const testDirectEdgeFunction = async () => {
    setLoading(true);
    setError(null);
    setResults(null);
    
    try {
      console.log('🧪 Testing direct edge function call...');
      
      const { data, error } = await supabase.functions.invoke('duffel-search-airports', {
        body: JSON.stringify({ query: testQuery })
      });

      if (error) {
        setError(`Edge function error: ${JSON.stringify(error)}`);
        return;
      }

      setResults({
        type: 'edge_function',
        data,
        timestamp: new Date().toISOString()
      });
      
      console.log('🧪 Direct edge function result:', data);
    } catch (err: any) {
      setError(`Exception: ${err.message}`);
      console.error('🧪 Direct edge function error:', err);
    } finally {
      setLoading(false);
    }
  };

  const testDuffelClient = async () => {
    setLoading(true);
    setError(null);
    setResults(null);
    
    try {
      console.log('🧪 Testing Duffel client...');
      
      const result = await duffelClient.searchAirports(testQuery);
      
      setResults({
        type: 'duffel_client',
        data: result,
        timestamp: new Date().toISOString()
      });
      
      console.log('🧪 Duffel client result:', result);
    } catch (err: any) {
      setError(`Exception: ${err.message}`);
      console.error('🧪 Duffel client error:', err);
    } finally {
      setLoading(false);
    }
  };

  const testDirectHTTP = async () => {
    setLoading(true);
    setError(null);
    setResults(null);
    
    try {
      console.log('🧪 Testing direct HTTP call...');
      
      const response = await fetch(`https://ytraidksgwxttjeevjuc.supabase.co/functions/v1/duffel-search-airports`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inl0cmFpZGtzZ3d4dHRqZWV2anVjIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTE1NzYwOTYsImV4cCI6MjA2NzE1MjA5Nn0.JrVIUPfYYzwBf3zfbdYQx0Up0X_jax23XpcLsSdBmmw`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ query: testQuery }),
      });

      const responseText = await response.text();
      let data;
      
      try {
        data = JSON.parse(responseText);
      } catch {
        data = responseText;
      }

      setResults({
        type: 'direct_http_post',
        status: response.status,
        statusText: response.statusText,
        data,
        timestamp: new Date().toISOString()
      });
      
      console.log('🧪 Direct HTTP result:', { status: response.status, data });
    } catch (err: any) {
      setError(`Exception: ${err.message}`);
      console.error('🧪 Direct HTTP error:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card className="w-full max-w-4xl mx-auto mt-8">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          🔬 Airport Search Debug Panel
          <Badge variant="secondary">Development Only</Badge>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex gap-2">
          <Input 
            value={testQuery}
            onChange={(e) => setTestQuery(e.target.value)}
            placeholder="Enter airport code or city (e.g., DCA, London)"
            className="flex-1"
          />
        </div>
        
        <div className="flex gap-2 flex-wrap">
          <Button 
            onClick={testDirectEdgeFunction}
            disabled={loading}
            variant="outline"
          >
            Test Edge Function
          </Button>
          <Button 
            onClick={testDuffelClient}
            disabled={loading}
            variant="outline"
          >
            Test Duffel Client
          </Button>
          <Button 
            onClick={testDirectHTTP}
            disabled={loading}
            variant="outline"
          >
            Test Direct HTTP
          </Button>
        </div>

        {loading && (
          <div className="p-4 bg-blue-50 rounded-lg">
            <p className="text-blue-700">🔄 Testing... Check console for detailed logs</p>
          </div>
        )}

        {error && (
          <div className="p-4 bg-red-50 rounded-lg">
            <p className="text-red-700 font-medium">❌ Error:</p>
            <pre className="text-red-600 text-sm mt-2 overflow-auto">{error}</pre>
          </div>
        )}

        {results && (
          <div className="p-4 bg-green-50 rounded-lg">
            <div className="flex items-center gap-2 mb-2">
              <p className="text-green-700 font-medium">✅ Results ({results.type}):</p>
              <Badge variant="outline">{results.timestamp}</Badge>
            </div>
            {results.status && (
              <p className="text-sm text-gray-600 mb-2">
                Status: {results.status} {results.statusText}
              </p>
            )}
            <pre className="text-green-600 text-sm overflow-auto max-h-96 bg-white p-2 rounded border">
              {JSON.stringify(results.data, null, 2)}
            </pre>
            {results.data?.data && (
              <p className="text-green-700 mt-2">
                Found {results.data.data.length} airports
              </p>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
};
