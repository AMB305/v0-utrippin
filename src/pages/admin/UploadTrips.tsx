import React, { useState } from 'react';
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/integrations/supabase/client";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { AlertCircle, CheckCircle, Upload } from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";

export default function UploadTrips() {
  const { user, isAdmin, loading: authLoading } = useAuth();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: "",
    destination: "",
    description: "",
    budget: "",
    approximate_budget: "",
    ai_summary: "",
    event_name: "",
    event_dates: "",
    summary: "",
    camref_links: "",
    start_date: "",
    end_date: ""
  });
  const [loading, setLoading] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  // Loading state
  if (authLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
          <p className="mt-2 text-muted-foreground">Loading...</p>
        </div>
      </div>
    );
  }

  // Not logged in
  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Card className="w-full max-w-md">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <AlertCircle className="h-5 w-5 text-destructive" />
              Access Denied
            </CardTitle>
            <CardDescription>
              Please log in to access this page.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Button onClick={() => navigate('/auth')} className="w-full">
              Go to Login
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  // Not admin
  if (!isAdmin) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Card className="w-full max-w-md">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <AlertCircle className="h-5 w-5 text-destructive" />
              Insufficient Permissions
            </CardTitle>
            <CardDescription>
              You need admin privileges to access this page.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Button onClick={() => navigate('/')} className="w-full">
              Return Home
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setSuccessMessage("");
    setErrorMessage("");

    try {
      const tripData = {
        name: formData.name,
        destination: formData.destination,
        description: formData.description,
        budget: formData.budget ? parseFloat(formData.budget) : null,
        approximate_budget: formData.approximate_budget ? parseFloat(formData.approximate_budget) : null,
        ai_summary: formData.ai_summary,
        summary: formData.summary,
        event_name: formData.event_name,
        event_dates: formData.event_dates,
        event_date: formData.start_date,
        start_date: formData.start_date,
        end_date: formData.end_date,
        camref_links: formData.camref_links,
        enhanced_flights_url: `https://utrippin.com/flights?destination=${encodeURIComponent(formData.destination)}`,
        enhanced_hotels_url: `https://utrippin.com/hotels?destination=${encodeURIComponent(formData.destination)}`,
        flights_url: formData.camref_links || `https://utrippin.com/flights?destination=${encodeURIComponent(formData.destination)}`,
        hotels_url: formData.camref_links || `https://utrippin.com/hotels?destination=${encodeURIComponent(formData.destination)}`
      };

      const { error } = await supabase.from("ai_trips").insert([tripData]);

      if (error) {
        throw error;
      }

      setSuccessMessage("🎉 Trip successfully uploaded!");
      setFormData({
        name: "",
        destination: "",
        description: "",
        budget: "",
        approximate_budget: "",
        ai_summary: "",
        event_name: "",
        event_dates: "",
        summary: "",
        camref_links: "",
        start_date: "",
        end_date: ""
      });
    } catch (error: any) {
      setErrorMessage(`Upload failed: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background p-4">
      <div className="max-w-4xl mx-auto">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Upload className="h-6 w-6" />
              Admin Trip Uploader
            </CardTitle>
            <CardDescription>
              Add new travel experiences to the AI trip database. Fill in all required fields to create compelling trip recommendations.
            </CardDescription>
          </CardHeader>
          <CardContent>
            {successMessage && (
              <Alert className="mb-6 border-green-200 bg-green-50">
                <CheckCircle className="h-4 w-4 text-green-600" />
                <AlertDescription className="text-green-800">
                  {successMessage}
                </AlertDescription>
              </Alert>
            )}

            {errorMessage && (
              <Alert className="mb-6 border-red-200 bg-red-50">
                <AlertCircle className="h-4 w-4 text-red-600" />
                <AlertDescription className="text-red-800">
                  {errorMessage}
                </AlertDescription>
              </Alert>
            )}

            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="name">Trip Name *</Label>
                  <Input
                    id="name"
                    name="name"
                    placeholder="e.g., Magical Paris Adventure"
                    value={formData.name}
                    onChange={handleChange}
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="destination">Destination *</Label>
                  <Input
                    id="destination"
                    name="destination"
                    placeholder="e.g., Paris, France"
                    value={formData.destination}
                    onChange={handleChange}
                    required
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="summary">Trip Summary *</Label>
                <Textarea
                  id="summary"
                  name="summary"
                  placeholder="Brief, engaging summary that appears on trip cards"
                  value={formData.summary}
                  onChange={handleChange}
                  rows={2}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="description">Full Description</Label>
                <Textarea
                  id="description"
                  name="description"
                  placeholder="Detailed trip description"
                  value={formData.description}
                  onChange={handleChange}
                  rows={4}
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="budget">Budget ($)</Label>
                  <Input
                    id="budget"
                    name="budget"
                    type="number"
                    placeholder="e.g., 2500"
                    value={formData.budget}
                    onChange={handleChange}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="approximate_budget">Approximate Budget ($)</Label>
                  <Input
                    id="approximate_budget"
                    name="approximate_budget"
                    type="number"
                    placeholder="e.g., 2500"
                    value={formData.approximate_budget}
                    onChange={handleChange}
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="ai_summary">AI Summary</Label>
                <Textarea
                  id="ai_summary"
                  name="ai_summary"
                  placeholder="AI-generated trip highlights and recommendations"
                  value={formData.ai_summary}
                  onChange={handleChange}
                  rows={3}
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="event_name">Event Name</Label>
                  <Input
                    id="event_name"
                    name="event_name"
                    placeholder="e.g., Summer Festival"
                    value={formData.event_name}
                    onChange={handleChange}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="event_dates">Event Dates</Label>
                  <Input
                    id="event_dates"
                    name="event_dates"
                    placeholder="e.g., July 15-22, 2024"
                    value={formData.event_dates}
                    onChange={handleChange}
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="start_date">Start Date</Label>
                  <Input
                    id="start_date"
                    name="start_date"
                    type="date"
                    value={formData.start_date}
                    onChange={handleChange}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="end_date">End Date</Label>
                  <Input
                    id="end_date"
                    name="end_date"
                    type="date"
                    value={formData.end_date}
                    onChange={handleChange}
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="camref_links">CAMREF Links (Optional)</Label>
                <Textarea
                  id="camref_links"
                  name="camref_links"
                  placeholder="Custom Expedia affiliate links with CAMREF tracking"
                  value={formData.camref_links}
                  onChange={handleChange}
                  rows={2}
                />
              </div>

              <Button 
                type="submit" 
                className="w-full" 
                disabled={loading}
                size="lg"
              >
                {loading ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                    Uploading...
                  </>
                ) : (
                  <>
                    <Upload className="h-4 w-4 mr-2" />
                    Upload Trip
                  </>
                )}
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
