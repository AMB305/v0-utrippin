import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { 
  TestTube, 
  Play, 
  CheckCircle, 
  XCircle, 
  Clock, 
  AlertTriangle,
  RefreshCw,
  FileText,
  Bug
} from "lucide-react";
import { HotelbedsMappingService } from "@/services/HotelbedsMappingService";
import { useToast } from "@/hooks/use-toast";

interface TestResult {
  id: string;
  name: string;
  status: 'pending' | 'running' | 'passed' | 'failed' | 'warning';
  duration?: number;
  details?: string;
  error?: string;
  timestamp: string;
}

interface TestSuite {
  name: string;
  description: string;
  tests: TestResult[];
  status: 'idle' | 'running' | 'completed';
}

const HotelbedsTestingSuite = () => {
  const { toast } = useToast();
  const [testSuites, setTestSuites] = useState<TestSuite[]>([
    {
      name: "Hotel Search Tests",
      description: "Test hotel search functionality with various parameters",
      status: 'idle',
      tests: [
        { id: 'search-basic', name: 'Basic Hotel Search', status: 'pending', timestamp: new Date().toISOString() },
        { id: 'search-validation', name: 'Search Parameter Validation', status: 'pending', timestamp: new Date().toISOString() },
        { id: 'search-destinations', name: 'Multiple Destination Codes', status: 'pending', timestamp: new Date().toISOString() },
        { id: 'search-dates', name: 'Date Range Validation', status: 'pending', timestamp: new Date().toISOString() },
        { id: 'search-occupancy', name: 'Guest Occupancy Scenarios', status: 'pending', timestamp: new Date().toISOString() }
      ]
    },
    {
      name: "Rate Check Tests",
      description: "Test rate checking and validation functionality",
      status: 'idle',
      tests: [
        { id: 'rates-basic', name: 'Basic Rate Check', status: 'pending', timestamp: new Date().toISOString() },
        { id: 'rates-invalid', name: 'Invalid Rate Key Handling', status: 'pending', timestamp: new Date().toISOString() },
        { id: 'rates-multiple', name: 'Multiple Rate Keys', status: 'pending', timestamp: new Date().toISOString() },
        { id: 'rates-expired', name: 'Expired Rate Handling', status: 'pending', timestamp: new Date().toISOString() }
      ]
    },
    {
      name: "Booking Flow Tests",
      description: "Test complete booking workflow with authentication",
      status: 'idle',
      tests: [
        { id: 'booking-auth', name: 'Authentication Requirements', status: 'pending', timestamp: new Date().toISOString() },
        { id: 'booking-validation', name: 'Booking Data Validation', status: 'pending', timestamp: new Date().toISOString() },
        { id: 'booking-creation', name: 'Booking Creation Process', status: 'pending', timestamp: new Date().toISOString() },
        { id: 'booking-storage', name: 'Database Storage', status: 'pending', timestamp: new Date().toISOString() }
      ]
    },
    {
      name: "Error Handling Tests",
      description: "Test error scenarios and edge cases",
      status: 'idle',
      tests: [
        { id: 'error-network', name: 'Network Failure Handling', status: 'pending', timestamp: new Date().toISOString() },
        { id: 'error-api', name: 'API Error Responses', status: 'pending', timestamp: new Date().toISOString() },
        { id: 'error-timeout', name: 'Request Timeout Handling', status: 'pending', timestamp: new Date().toISOString() },
        { id: 'error-malformed', name: 'Malformed Data Handling', status: 'pending', timestamp: new Date().toISOString() }
      ]
    }
  ]);

  const [customTestData, setCustomTestData] = useState({
    destination: 'PAR',
    checkIn: '2024-04-15',
    checkOut: '2024-04-18',
    adults: 2,
    children: 0,
    rooms: 1
  });

  const [runningTests, setRunningTests] = useState<Set<string>>(new Set());
  const [testLogs, setTestLogs] = useState<string[]>([]);

  const addLog = (message: string) => {
    const timestamp = new Date().toLocaleTimeString();
    setTestLogs(prev => [...prev, `[${timestamp}] ${message}`]);
  };

  const updateTestStatus = (suiteIndex: number, testIndex: number, status: TestResult['status'], details?: string, error?: string, duration?: number) => {
    setTestSuites(prev => {
      const newSuites = [...prev];
      newSuites[suiteIndex].tests[testIndex] = {
        ...newSuites[suiteIndex].tests[testIndex],
        status,
        details,
        error,
        duration,
        timestamp: new Date().toISOString()
      };
      return newSuites;
    });
  };

  const runHotelSearchTests = async (suiteIndex: number) => {
    const suite = testSuites[suiteIndex];
    addLog(`Starting ${suite.name}...`);
    
    setTestSuites(prev => {
      const newSuites = [...prev];
      newSuites[suiteIndex].status = 'running';
      return newSuites;
    });

    // Test 1: Basic Hotel Search
    try {
      addLog("Running basic hotel search test...");
      updateTestStatus(suiteIndex, 0, 'running');
      const startTime = Date.now();
      
      const searchRequest = {
        destination: customTestData.destination,
        checkIn: customTestData.checkIn,
        checkOut: customTestData.checkOut,
        adults: customTestData.adults,
        children: customTestData.children,
        rooms: customTestData.rooms
      };

      const result = await HotelbedsMappingService.searchHotels(searchRequest);
      const duration = Date.now() - startTime;

      if (result && result.hotels) {
        updateTestStatus(suiteIndex, 0, 'passed', `Found ${result.hotels.length} hotels`, undefined, duration);
        addLog(`✓ Basic search completed: ${result.hotels.length} hotels found in ${duration}ms`);
      } else {
        updateTestStatus(suiteIndex, 0, 'warning', 'No hotels returned', undefined, duration);
        addLog(`⚠ Basic search completed but no hotels returned in ${duration}ms`);
      }
    } catch (error) {
      updateTestStatus(suiteIndex, 0, 'failed', undefined, error instanceof Error ? error.message : 'Unknown error');
      addLog(`✗ Basic search failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }

    // Test 2: Search Parameter Validation
    try {
      addLog("Testing search parameter validation...");
      updateTestStatus(suiteIndex, 1, 'running');
      const startTime = Date.now();
      
      // Test with invalid parameters
      const invalidRequest = {
        destination: '',
        checkIn: '',
        checkOut: '',
        adults: 0,
        children: 0,
        rooms: 0
      };

      try {
        await HotelbedsMappingService.searchHotels(invalidRequest);
        updateTestStatus(suiteIndex, 1, 'failed', 'Should have failed validation', 'No validation error thrown');
        addLog("✗ Parameter validation test failed: Invalid parameters were accepted");
      } catch (validationError) {
        const duration = Date.now() - startTime;
        updateTestStatus(suiteIndex, 1, 'passed', 'Validation correctly rejected invalid parameters', undefined, duration);
        addLog(`✓ Parameter validation working correctly in ${duration}ms`);
      }
    } catch (error) {
      updateTestStatus(suiteIndex, 1, 'failed', undefined, error instanceof Error ? error.message : 'Unknown error');
      addLog(`✗ Parameter validation test error: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }

    // Additional tests would continue here...
    
    setTestSuites(prev => {
      const newSuites = [...prev];
      newSuites[suiteIndex].status = 'completed';
      return newSuites;
    });
    
    addLog(`Completed ${suite.name}`);
  };

  const runRateCheckTests = async (suiteIndex: number) => {
    const suite = testSuites[suiteIndex];
    addLog(`Starting ${suite.name}...`);
    
    setTestSuites(prev => {
      const newSuites = [...prev];
      newSuites[suiteIndex].status = 'running';
      return newSuites;
    });

    // Test 1: Invalid Rate Key Handling
    try {
      addLog("Testing invalid rate key handling...");
      updateTestStatus(suiteIndex, 1, 'running');
      const startTime = Date.now();
      
      try {
        await HotelbedsMappingService.checkRates(['invalid-rate-key-123']);
        updateTestStatus(suiteIndex, 1, 'warning', 'Invalid rate key was processed', 'Should have failed');
        addLog("⚠ Invalid rate key was processed - may need better validation");
      } catch (error) {
        const duration = Date.now() - startTime;
        updateTestStatus(suiteIndex, 1, 'passed', 'Invalid rate key correctly rejected', undefined, duration);
        addLog(`✓ Invalid rate key correctly rejected in ${duration}ms`);
      }
    } catch (error) {
      updateTestStatus(suiteIndex, 1, 'failed', undefined, error instanceof Error ? error.message : 'Unknown error');
      addLog(`✗ Rate validation test error: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }

    setTestSuites(prev => {
      const newSuites = [...prev];
      newSuites[suiteIndex].status = 'completed';
      return newSuites;
    });
    
    addLog(`Completed ${suite.name}`);
  };

  const runTestSuite = async (suiteIndex: number) => {
    const suiteId = `suite-${suiteIndex}`;
    if (runningTests.has(suiteId)) return;

    setRunningTests(prev => new Set([...prev, suiteId]));

    try {
      switch (suiteIndex) {
        case 0:
          await runHotelSearchTests(suiteIndex);
          break;
        case 1:
          await runRateCheckTests(suiteIndex);
          break;
        case 2:
          addLog("Booking flow tests require authentication - implementing...");
          break;
        case 3:
          addLog("Error handling tests - implementing...");
          break;
      }
    } finally {
      setRunningTests(prev => {
        const newSet = new Set(prev);
        newSet.delete(suiteId);
        return newSet;
      });
    }
  };

  const runAllTests = async () => {
    addLog("🚀 Starting full test suite...");
    for (let i = 0; i < testSuites.length; i++) {
      await runTestSuite(i);
    }
    addLog("🏁 All tests completed!");
    
    toast({
      title: "Testing Complete",
      description: "All test suites have been executed. Check results below.",
    });
  };

  const clearLogs = () => {
    setTestLogs([]);
  };

  const getStatusIcon = (status: TestResult['status']) => {
    switch (status) {
      case 'passed':
        return <CheckCircle className="w-4 h-4 text-green-600" />;
      case 'failed':
        return <XCircle className="w-4 h-4 text-red-600" />;
      case 'warning':
        return <AlertTriangle className="w-4 h-4 text-yellow-600" />;
      case 'running':
        return <RefreshCw className="w-4 h-4 text-blue-600 animate-spin" />;
      default:
        return <Clock className="w-4 h-4 text-gray-400" />;
    }
  };

  const getStatusColor = (status: TestResult['status']) => {
    switch (status) {
      case 'passed':
        return 'bg-green-100 text-green-800 border-green-200';
      case 'failed':
        return 'bg-red-100 text-red-800 border-red-200';
      case 'warning':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'running':
        return 'bg-blue-100 text-blue-800 border-blue-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  return (
    <div className="container mx-auto px-4 py-8 max-w-6xl">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2 flex items-center gap-2">
          <TestTube className="w-8 h-8" />
          Hotelbeds Integration Testing Suite
        </h1>
        <p className="text-muted-foreground">
          Comprehensive testing for Hotelbeds API integration and certification preparation
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Test Configuration */}
        <div className="lg:col-span-1">
          <Card>
            <CardHeader>
              <CardTitle>Test Configuration</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="destination">Destination Code</Label>
                <Input
                  id="destination"
                  value={customTestData.destination}
                  onChange={(e) => setCustomTestData(prev => ({ ...prev, destination: e.target.value }))}
                  placeholder="e.g., PAR, LON, NYC"
                />
              </div>
              
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <Label htmlFor="checkIn">Check-in</Label>
                  <Input
                    id="checkIn"
                    type="date"
                    value={customTestData.checkIn}
                    onChange={(e) => setCustomTestData(prev => ({ ...prev, checkIn: e.target.value }))}
                  />
                </div>
                <div>
                  <Label htmlFor="checkOut">Check-out</Label>
                  <Input
                    id="checkOut"
                    type="date"
                    value={customTestData.checkOut}
                    onChange={(e) => setCustomTestData(prev => ({ ...prev, checkOut: e.target.value }))}
                  />
                </div>
              </div>
              
              <div className="grid grid-cols-3 gap-2">
                <div>
                  <Label htmlFor="adults">Adults</Label>
                  <Input
                    id="adults"
                    type="number"
                    min="1"
                    max="10"
                    value={customTestData.adults}
                    onChange={(e) => setCustomTestData(prev => ({ ...prev, adults: parseInt(e.target.value) || 1 }))}
                  />
                </div>
                <div>
                  <Label htmlFor="children">Children</Label>
                  <Input
                    id="children"
                    type="number"
                    min="0"
                    max="10"
                    value={customTestData.children}
                    onChange={(e) => setCustomTestData(prev => ({ ...prev, children: parseInt(e.target.value) || 0 }))}
                  />
                </div>
                <div>
                  <Label htmlFor="rooms">Rooms</Label>
                  <Input
                    id="rooms"
                    type="number"
                    min="1"
                    max="5"
                    value={customTestData.rooms}
                    onChange={(e) => setCustomTestData(prev => ({ ...prev, rooms: parseInt(e.target.value) || 1 }))}
                  />
                </div>
              </div>
              
              <Separator />
              
              <Button onClick={runAllTests} className="w-full" size="lg">
                <Play className="w-4 h-4 mr-2" />
                Run All Tests
              </Button>
            </CardContent>
          </Card>

          {/* Test Logs */}
          <Card className="mt-6">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-base">Test Logs</CardTitle>
              <Button variant="outline" size="sm" onClick={clearLogs}>
                <RefreshCw className="w-4 h-4" />
              </Button>
            </CardHeader>
            <CardContent>
              <div className="bg-black text-green-400 p-3 rounded font-mono text-xs max-h-60 overflow-y-auto">
                {testLogs.length === 0 ? (
                  <p className="text-gray-500">No logs yet. Run tests to see output.</p>
                ) : (
                  testLogs.map((log, index) => (
                    <div key={index} className="mb-1">{log}</div>
                  ))
                )}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Test Suites */}
        <div className="lg:col-span-2 space-y-6">
          {testSuites.map((suite, suiteIndex) => (
            <Card key={suite.name}>
              <CardHeader className="flex flex-row items-center justify-between space-y-0">
                <div>
                  <CardTitle className="flex items-center gap-2">
                    {suite.status === 'running' && <RefreshCw className="w-5 h-5 animate-spin" />}
                    {suite.name}
                  </CardTitle>
                  <p className="text-sm text-muted-foreground">{suite.description}</p>
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => runTestSuite(suiteIndex)}
                  disabled={runningTests.has(`suite-${suiteIndex}`)}
                >
                  <Play className="w-4 h-4 mr-2" />
                  Run
                </Button>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  {suite.tests.map((test, testIndex) => (
                    <div key={test.id} className={`p-3 rounded border ${getStatusColor(test.status)}`}>
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          {getStatusIcon(test.status)}
                          <span className="font-medium">{test.name}</span>
                        </div>
                        <div className="flex items-center gap-2 text-sm">
                          {test.duration && <span>{test.duration}ms</span>}
                          <Badge variant="outline" className="text-xs">
                            {test.status}
                          </Badge>
                        </div>
                      </div>
                      {(test.details || test.error) && (
                        <div className="mt-2 text-sm">
                          {test.details && <p className="text-green-700">{test.details}</p>}
                          {test.error && <p className="text-red-700 font-mono">{test.error}</p>}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
};

export default HotelbedsTestingSuite;