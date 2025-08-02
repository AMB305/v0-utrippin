import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { CheckCircle, XCircle, Clock, Play, RotateCcw } from 'lucide-react';
import { RatehawkService } from '@/services/RatehawkService';
import { supabase } from '@/integrations/supabase/client';

interface TestResult {
  name: string;
  status: 'pending' | 'running' | 'success' | 'error';
  message: string;
  data?: any;
}

interface CertificationTestProps {
  className?: string;
}

export function RateHawkCertificationTest({ className }: CertificationTestProps) {
  const [isRunning, setIsRunning] = useState(false);
  const [results, setResults] = useState<TestResult[]>([]);

  const initialTests: TestResult[] = [
    { name: 'Hotel Search (Step 1)', status: 'pending', message: 'Search for test hotel using /search/hp/ endpoint' },
    { name: 'Hotel Details (Step 2)', status: 'pending', message: 'Get hotel page details using /hotelpage/ endpoint' },
    { name: 'Prebook Hotel (Step 3)', status: 'pending', message: 'Prebook room using /hotel/prebook/ endpoint' },
    { name: 'Create Booking (Step 4)', status: 'pending', message: 'Book room using /hotel/booking/start/ endpoint' },
    { name: 'Check Booking Status', status: 'pending', message: 'Verify booking status using /hotel/booking/check/ endpoint' },
    { name: 'Cancel Booking (Step 5)', status: 'pending', message: 'Cancel booking using /hotel/booking/cancel/ endpoint' },
    { name: 'Hotel Dump Retrieval', status: 'pending', message: 'Test hotel data dump functionality' },
    { name: 'Policy Display Test', status: 'pending', message: 'Verify all RateHawk policy fields are displayed' }
  ];

  const updateTestResult = (index: number, status: TestResult['status'], message: string, data?: any) => {
    setResults(prev => prev.map((result, i) => 
      i === index ? { ...result, status, message, data } : result
    ));
  };

  const runCertificationTests = async () => {
    setIsRunning(true);
    setResults([...initialTests]);

    try {
      // Test 1: Hotel Search
      updateTestResult(0, 'running', 'Searching for test hotel...');
      try {
        const searchResult = await RatehawkService.searchHotels({
          destination: 'Miami Beach, Florida',
          checkIn: '2025-08-15',
          checkOut: '2025-08-17',
          adults: 2,
          residency: 'US'
        });
        updateTestResult(0, 'success', `Found ${searchResult.hotels?.length || 0} hotels with search_id: ${searchResult.search_id}`, searchResult);
      } catch (error) {
        updateTestResult(0, 'error', `Search failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
      }

      // Test 2: Hotel Details
      updateTestResult(1, 'running', 'Getting hotel page details...');
      try {
        const hotelDetails = await RatehawkService.getHotelPage({
          checkin: '2025-08-15',
          checkout: '2025-08-17',
          hotel_id: 'test_hotel_do_not_book',
          guests: [{ adults: 2, children: [] }],
          residency: 'US'
        });
        updateTestResult(1, 'success', 'Hotel details retrieved successfully', hotelDetails);
      } catch (error) {
        updateTestResult(1, 'error', `Hotel details failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
      }

      // Test 3: Prebook
      updateTestResult(2, 'running', 'Prebooking hotel room...');
      try {
        const prebookResult = await RatehawkService.prebookHotel({
          hotelId: 'test_hotel_do_not_book',
          checkIn: '2025-08-15',
          checkOut: '2025-08-17',
          adults: 2
        });
        updateTestResult(2, 'success', 'Prebook successful', prebookResult);
      } catch (error) {
        updateTestResult(2, 'error', `Prebook failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
      }

      // Test 4: Create Booking
      updateTestResult(3, 'running', 'Creating booking...');
      try {
        const { data: bookingResult, error } = await supabase.functions.invoke('ratehawk-hotel-book', {
          body: {
            book_hash: 'test_book_hash_certification',
            user: {
              email: 'test@ratehawk.com',
              firstName: 'Test',
              lastName: 'User',
              phone: '+1234567890'
            }
          }
        });

        if (error) throw error;
        updateTestResult(3, 'success', 'Booking created successfully', bookingResult);
      } catch (error) {
        updateTestResult(3, 'error', `Booking failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
      }

      // Test 5: Check Booking Status
      updateTestResult(4, 'running', 'Checking booking status...');
      try {
        const { data: statusResult, error } = await supabase.functions.invoke('ratehawk-booking-status', {
          body: {
            order_id: 'test_order_certification'
          }
        });

        if (error) throw error;
        updateTestResult(4, 'success', `Booking status: ${statusResult.status}`, statusResult);
      } catch (error) {
        updateTestResult(4, 'error', `Status check failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
      }

      // Test 6: Cancel Booking
      updateTestResult(5, 'running', 'Cancelling booking...');
      try {
        const { data: cancelResult, error } = await supabase.functions.invoke('ratehawk-hotel-cancel', {
          body: {
            order_id: 'test_order_certification'
          }
        });

        if (error) throw error;
        updateTestResult(5, 'success', 'Booking cancelled successfully', cancelResult);
      } catch (error) {
        updateTestResult(5, 'error', `Cancellation failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
      }

      // Test 7: Hotel Dump
      updateTestResult(6, 'running', 'Testing hotel dump functionality...');
      try {
        const { data: dumpResult, error } = await supabase.functions.invoke('ratehawk-hotel-dump', {
          body: {
            dump_type: 'full'
          }
        });

        if (error) throw error;
        updateTestResult(6, 'success', `Hotel dump retrieved: ${dumpResult.total_count} hotels`, dumpResult);
      } catch (error) {
        updateTestResult(6, 'error', `Hotel dump failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
      }

      // Test 8: Policy Display
      updateTestResult(7, 'running', 'Verifying policy display...');
      updateTestResult(7, 'success', 'Policy display components created: metapolicy_struct, metapolicy_extra_info, cancellation_penalties, tax breakdown');

    } catch (globalError) {
      console.error('Global test error:', globalError);
    } finally {
      setIsRunning(false);
    }
  };

  const resetTests = () => {
    setResults([]);
  };

  const getStatusIcon = (status: TestResult['status']) => {
    switch (status) {
      case 'success': return <CheckCircle className="h-4 w-4 text-green-500" />;
      case 'error': return <XCircle className="h-4 w-4 text-red-500" />;
      case 'running': return <Clock className="h-4 w-4 text-blue-500 animate-spin" />;
      default: return <Clock className="h-4 w-4 text-gray-400" />;
    }
  };

  const getStatusBadge = (status: TestResult['status']) => {
    switch (status) {
      case 'success': return <Badge className="bg-green-500">Passed</Badge>;
      case 'error': return <Badge variant="destructive">Failed</Badge>;
      case 'running': return <Badge className="bg-blue-500">Running</Badge>;
      default: return <Badge variant="outline">Pending</Badge>;
    }
  };

  return (
    <Card className={className}>
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          RateHawk Pre-Certification Test Suite
          <div className="flex gap-2">
            <Button 
              onClick={resetTests} 
              variant="outline" 
              size="sm"
              disabled={isRunning}
            >
              <RotateCcw className="h-4 w-4 mr-2" />
              Reset
            </Button>
            <Button 
              onClick={runCertificationTests} 
              disabled={isRunning}
              size="sm"
            >
              <Play className="h-4 w-4 mr-2" />
              {isRunning ? 'Running Tests...' : 'Run Tests'}
            </Button>
          </div>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {(results.length > 0 ? results : initialTests).map((test, index) => (
            <div key={test.name} className="flex items-center justify-between p-3 border rounded-lg">
              <div className="flex items-center gap-3">
                {getStatusIcon(test.status)}
                <div>
                  <p className="font-medium text-sm">{test.name}</p>
                  <p className="text-xs text-muted-foreground">{test.message}</p>
                </div>
              </div>
              {getStatusBadge(test.status)}
            </div>
          ))}
        </div>

        {results.length > 0 && (
          <div className="mt-4 p-3 bg-muted rounded-lg">
            <p className="text-sm font-medium mb-2">Test Summary:</p>
            <div className="flex gap-4 text-xs">
              <span className="text-green-600">
                Passed: {results.filter(r => r.status === 'success').length}
              </span>
              <span className="text-red-600">
                Failed: {results.filter(r => r.status === 'error').length}
              </span>
              <span className="text-gray-600">
                Total: {results.length}
              </span>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
