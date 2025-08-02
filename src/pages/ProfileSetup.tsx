import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { useAuth } from '@/hooks/useAuth';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { MapPin, Heart, Globe, User, X, Users, Settings, DollarSign, Camera, Upload } from 'lucide-react';

const TRAVEL_STYLES = [
  'Adventure', 'Cultural', 'Relaxation', 'Food & Drink', 'Nightlife', 
  'Nature', 'Photography', 'Business', 'Backpacking', 'Luxury'
];

const INTERESTS = [
  'Photography', 'Food', 'Art', 'Music', 'Sports', 'History', 'Nature',
  'Adventure', 'Culture', 'Technology', 'Fashion', 'Wellness'
];

const DESTINATIONS = [
  'Japan', 'Thailand', 'Italy', 'France', 'Spain', 'Greece', 'Morocco',
  'Peru', 'New Zealand', 'Iceland', 'Croatia', 'Portugal', 'Turkey'
];

const ACCOMMODATION_TYPES = [
  'hotel', 'hostel', 'airbnb', 'resort', 'guesthouse', 'apartment'
];

const ACTIVITIES = [
  'sightseeing', 'food', 'culture', 'adventure', 'nightlife', 'shopping',
  'museums', 'beaches', 'hiking', 'photography', 'festivals', 'wellness'
];

const LANGUAGES = [
  'English', 'Spanish', 'French', 'German', 'Italian', 'Portuguese',
  'Mandarin', 'Japanese', 'Korean', 'Arabic', 'Russian', 'Dutch'
];

const ProfileSetup = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [step, setStep] = useState(1);
  
  // Get signup source for customized messaging
  const signupSource = localStorage.getItem('signup_source') as 'travel-buddies' | 'trip-booking' | 'social-features' | null;
  
  const [profile, setProfile] = useState({
    name: '',
    age: '',
    location: '',
    bio: '',
    travel_style: '',
    interests: [] as string[],
    preferred_destinations: [] as string[],
    languages_spoken: [] as string[],
    public_profile: true,
    profile_photo_url: '',
  });

  const [photoFile, setPhotoFile] = useState<File | null>(null);
  const [photoPreview, setPhotoPreview] = useState<string>('');

  const [preferences, setPreferences] = useState({
    budget_range_min: 50,
    budget_range_max: 500,
    accommodation_type: [] as string[],
    preferred_activities: [] as string[],
    group_size_preference: 'small',
    travel_pace: 'moderate',
    dietary_restrictions: [] as string[],
    accessibility_needs: [] as string[],
  });

  const toggleInterest = (interest: string) => {
    setProfile(prev => ({
      ...prev,
      interests: prev.interests.includes(interest)
        ? prev.interests.filter(i => i !== interest)
        : [...prev.interests, interest]
    }));
  };

  const toggleDestination = (destination: string) => {
    setProfile(prev => ({
      ...prev,
      preferred_destinations: prev.preferred_destinations.includes(destination)
        ? prev.preferred_destinations.filter(d => d !== destination)
        : [...prev.preferred_destinations, destination]
    }));
  };

  const toggleLanguage = (language: string) => {
    setProfile(prev => ({
      ...prev,
      languages_spoken: prev.languages_spoken.includes(language)
        ? prev.languages_spoken.filter(l => l !== language)
        : [...prev.languages_spoken, language]
    }));
  };

  const toggleAccommodation = (type: string) => {
    setPreferences(prev => ({
      ...prev,
      accommodation_type: prev.accommodation_type.includes(type)
        ? prev.accommodation_type.filter(t => t !== type)
        : [...prev.accommodation_type, type]
    }));
  };

  const toggleActivity = (activity: string) => {
    setPreferences(prev => ({
      ...prev,
      preferred_activities: prev.preferred_activities.includes(activity)
        ? prev.preferred_activities.filter(a => a !== activity)
        : [...prev.preferred_activities, activity]
    }));
  };

  const handlePhotoUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setPhotoFile(file);
      const reader = new FileReader();
      reader.onload = () => {
        setPhotoPreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const uploadPhoto = async (): Promise<string | null> => {
    if (!photoFile || !user) return null;

    const fileExt = photoFile.name.split('.').pop();
    const fileName = `${user.id}/profile.${fileExt}`;

    const { error: uploadError, data } = await supabase.storage
      .from('profile-photos')
      .upload(fileName, photoFile, {
        upsert: true,
        contentType: photoFile.type,
      });

    if (uploadError) {
      console.error('Upload error:', uploadError);
      return null;
    }

    const { data: { publicUrl } } = supabase.storage
      .from('profile-photos')
      .getPublicUrl(fileName);

    return publicUrl;
  };

  const handleSubmit = async () => {
    if (!user) return;
    
    // Validate required fields
    if (!profile.name.trim()) {
      toast({
        title: "Name required",
        description: "Please enter your name or nickname",
        variant: "destructive",
      });
      return;
    }
    
    setLoading(true);
    try {
      // Upload photo first if provided
      let photoUrl = profile.profile_photo_url;
      if (photoFile) {
        const uploadedUrl = await uploadPhoto();
        if (uploadedUrl) {
          photoUrl = uploadedUrl;
        }
      }

      // Update user profile
      const { error: userError } = await supabase
        .from('users')
        .update({
          age: profile.age ? parseInt(profile.age) : null,
          location: profile.location,
          bio: profile.bio,
          travel_style: profile.travel_style,
          interests: profile.interests,
          preferred_destinations: profile.preferred_destinations,
          languages_spoken: profile.languages_spoken,
          public_profile: profile.public_profile,
          profile_photo_url: photoUrl,
        })
        .eq('id', user.id);

      // Create/update profile with name
      const { error: profileError } = await supabase
        .from('profiles')
        .upsert({
          id: user.id,
          username: profile.name.trim(),
        });

      if (profileError) throw profileError;

      if (userError) throw userError;

      // Create travel preferences
      const { error: preferencesError } = await supabase
        .from('travel_preferences')
        .upsert({
          user_id: user.id,
          ...preferences,
        });

      if (preferencesError) throw preferencesError;

      toast({
        title: "Profile created!",
        description: "Welcome to the travel community. Start finding your travel buddies!",
      });

      // Clear signup data from localStorage
      localStorage.removeItem('signup_source');
      localStorage.removeItem('pending_verification_email');
      
      navigate('/travel-buddies');
    } catch (error: any) {
      toast({
        title: "Error creating profile",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const nextStep = () => {
    if (step < 5) setStep(step + 1);
  };

  const prevStep = () => {
    if (step > 1) setStep(step - 1);
  };

  return (
    <div className="min-h-screen bg-gradient-hero flex items-center justify-center p-4">
      <Card className="w-full max-w-2xl bg-background/95 backdrop-blur-md border-border/50 shadow-large">
        <CardHeader className="text-center">
          <CardTitle className="text-2xl">
            {signupSource === 'travel-buddies' && "Let's Set Up Your Travel Buddy Profile!"}
            {signupSource === 'trip-booking' && "Complete Your Profile to Unlock Booking Features"}
            {signupSource === 'social-features' && "Join the Travel Community"}
            {!signupSource && "Complete Your Travel Profile"}
          </CardTitle>
          <p className="text-muted-foreground">
            {signupSource === 'travel-buddies' && "Help us find the perfect travel companions for your adventures"}
            {signupSource === 'trip-booking' && "Complete your profile to access exclusive booking features and travel deals"}
            {signupSource === 'social-features' && "Set up your profile to connect with fellow travelers and share experiences"}
            {!signupSource && "Help us find the perfect travel buddies for you"}
          </p>
          <div className="flex justify-center mt-4">
            {[1, 2, 3, 4, 5].map((num) => (
              <div
                key={num}
                className={`w-8 h-8 rounded-full flex items-center justify-center mx-1 ${
                  step >= num ? 'bg-primary text-primary-foreground' : 'bg-muted text-muted-foreground'
                }`}
              >
                {num}
              </div>
            ))}
          </div>
        </CardHeader>

        <CardContent className="space-y-6">
          {step === 1 && (
            <div className="space-y-4">
              <h3 className="text-lg font-semibold flex items-center gap-2">
                <User className="w-5 h-5" />
                Basic Information
              </h3>
              
              {/* Profile Photo Upload */}
              <div className="space-y-2">
                <Label className="flex items-center gap-1">
                  <Camera className="w-4 h-4" />
                  Profile Photo
                </Label>
                <div className="flex items-center gap-4">
                  <div className="w-24 h-24 rounded-full border-2 border-dashed border-gray-300 flex items-center justify-center overflow-hidden bg-gray-50">
                    {photoPreview ? (
                      <img
                        src={photoPreview}
                        alt="Profile preview"
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <Camera className="w-8 h-8 text-gray-400" />
                    )}
                  </div>
                  <div className="flex-1">
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handlePhotoUpload}
                      className="hidden"
                      id="photo-upload"
                    />
                    <Label 
                      htmlFor="photo-upload" 
                      className="cursor-pointer inline-flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50"
                    >
                      <Upload className="w-4 h-4" />
                      {photoPreview ? 'Change Photo' : 'Upload Photo'}
                    </Label>
                    <p className="text-xs text-gray-500 mt-1">
                      Upload a clear photo of yourself to help other travelers recognize you
                    </p>
                  </div>
                </div>
              </div>
               <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="name">Name / Nickname *</Label>
                  <Input
                    id="name"
                    placeholder="How should other travelers know you?"
                    value={profile.name}
                    onChange={(e) => setProfile(prev => ({ ...prev, name: e.target.value }))}
                    required
                  />
                  <p className="text-xs text-muted-foreground">
                    This will be your display name that other travelers see
                  </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="age">Age</Label>
                    <Input
                      id="age"
                      type="number"
                      placeholder="25"
                      value={profile.age}
                      onChange={(e) => setProfile(prev => ({ ...prev, age: e.target.value }))}
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="location" className="flex items-center gap-1">
                      <MapPin className="w-4 h-4" />
                      Location
                    </Label>
                    <Input
                      id="location"
                      placeholder="New York, NY"
                      value={profile.location}
                      onChange={(e) => setProfile(prev => ({ ...prev, location: e.target.value }))}
                    />
                  </div>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="bio">Bio</Label>
                <Textarea
                  id="bio"
                  placeholder="Tell us about yourself and what kind of travel experiences you're looking for..."
                  value={profile.bio}
                  onChange={(e) => setProfile(prev => ({ ...prev, bio: e.target.value }))}
                  rows={4}
                />
              </div>

              <div className="space-y-2">
                <Label>Travel Style</Label>
                <Select value={profile.travel_style} onValueChange={(value) => setProfile(prev => ({ ...prev, travel_style: value }))}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select your travel style" />
                  </SelectTrigger>
                  <SelectContent>
                    {TRAVEL_STYLES.map((style) => (
                      <SelectItem key={style} value={style}>{style}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
          )}

          {step === 2 && (
            <div className="space-y-4">
              <h3 className="text-lg font-semibold flex items-center gap-2">
                <Heart className="w-5 h-5" />
                Interests
              </h3>
              <p className="text-muted-foreground">Select all that apply to help us match you with like-minded travelers</p>
              
              <div className="flex flex-wrap gap-2">
                {INTERESTS.map((interest) => (
                  <Badge
                    key={interest}
                    variant={profile.interests.includes(interest) ? "default" : "outline"}
                    className="cursor-pointer hover:bg-primary hover:text-primary-foreground"
                    onClick={() => toggleInterest(interest)}
                  >
                    {interest}
                    {profile.interests.includes(interest) && (
                      <X className="w-3 h-3 ml-1" />
                    )}
                  </Badge>
                ))}
              </div>
            </div>
          )}

          {step === 3 && (
            <div className="space-y-4">
              <h3 className="text-lg font-semibold flex items-center gap-2">
                <Globe className="w-5 h-5" />
                Dream Destinations
              </h3>
              <p className="text-muted-foreground">Where would you love to travel? Select your top destinations</p>
              
              <div className="flex flex-wrap gap-2">
                {DESTINATIONS.map((destination) => (
                  <Badge
                    key={destination}
                    variant={profile.preferred_destinations.includes(destination) ? "default" : "outline"}
                    className="cursor-pointer hover:bg-primary hover:text-primary-foreground"
                    onClick={() => toggleDestination(destination)}
                  >
                    {destination}
                    {profile.preferred_destinations.includes(destination) && (
                      <X className="w-3 h-3 ml-1" />
                    )}
                  </Badge>
                ))}
              </div>

              <div className="space-y-2">
                <Label>Languages You Speak</Label>
                <div className="flex flex-wrap gap-2">
                  {LANGUAGES.map((language) => (
                    <Badge
                      key={language}
                      variant={profile.languages_spoken.includes(language) ? "default" : "outline"}
                      className="cursor-pointer hover:bg-primary hover:text-primary-foreground"
                      onClick={() => toggleLanguage(language)}
                    >
                      {language}
                      {profile.languages_spoken.includes(language) && (
                        <X className="w-3 h-3 ml-1" />
                      )}
                    </Badge>
                  ))}
                </div>
              </div>
            </div>
          )}

          {step === 4 && (
            <div className="space-y-4">
              <h3 className="text-lg font-semibold flex items-center gap-2">
                <DollarSign className="w-5 h-5" />
                Travel Preferences
              </h3>
              <p className="text-muted-foreground">Help us understand your travel style and preferences</p>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Budget Range (per day)</Label>
                  <div className="flex items-center gap-2">
                    <Input
                      type="number"
                      placeholder="Min"
                      value={preferences.budget_range_min}
                      onChange={(e) => setPreferences(prev => ({ ...prev, budget_range_min: parseInt(e.target.value) || 50 }))}
                    />
                    <span>-</span>
                    <Input
                      type="number"
                      placeholder="Max"
                      value={preferences.budget_range_max}
                      onChange={(e) => setPreferences(prev => ({ ...prev, budget_range_max: parseInt(e.target.value) || 500 }))}
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label>Travel Pace</Label>
                  <Select value={preferences.travel_pace} onValueChange={(value) => setPreferences(prev => ({ ...prev, travel_pace: value }))}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select travel pace" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="slow">Slow & Relaxed</SelectItem>
                      <SelectItem value="moderate">Moderate</SelectItem>
                      <SelectItem value="fast">Fast-Paced</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="space-y-2">
                <Label>Group Size Preference</Label>
                <Select value={preferences.group_size_preference} onValueChange={(value) => setPreferences(prev => ({ ...prev, group_size_preference: value }))}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select group size" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="solo">Solo Travel</SelectItem>
                    <SelectItem value="small">Small Groups (2-4 people)</SelectItem>
                    <SelectItem value="medium">Medium Groups (5-8 people)</SelectItem>
                    <SelectItem value="large">Large Groups (9+ people)</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label>Preferred Accommodation</Label>
                <div className="flex flex-wrap gap-2">
                  {ACCOMMODATION_TYPES.map((type) => (
                    <Badge
                      key={type}
                      variant={preferences.accommodation_type.includes(type) ? "default" : "outline"}
                      className="cursor-pointer hover:bg-primary hover:text-primary-foreground capitalize"
                      onClick={() => toggleAccommodation(type)}
                    >
                      {type}
                      {preferences.accommodation_type.includes(type) && (
                        <X className="w-3 h-3 ml-1" />
                      )}
                    </Badge>
                  ))}
                </div>
              </div>

              <div className="space-y-2">
                <Label>Preferred Activities</Label>
                <div className="flex flex-wrap gap-2">
                  {ACTIVITIES.map((activity) => (
                    <Badge
                      key={activity}
                      variant={preferences.preferred_activities.includes(activity) ? "default" : "outline"}
                      className="cursor-pointer hover:bg-primary hover:text-primary-foreground capitalize"
                      onClick={() => toggleActivity(activity)}
                    >
                      {activity}
                      {preferences.preferred_activities.includes(activity) && (
                        <X className="w-3 h-3 ml-1" />
                      )}
                    </Badge>
                  ))}
                </div>
              </div>
            </div>
          )}

          {step === 5 && (
            <div className="space-y-4">
              <h3 className="text-lg font-semibold flex items-center gap-2">
                <Settings className="w-5 h-5" />
                Privacy & Matching
              </h3>
              <p className="text-muted-foreground">Final settings for your travel buddy experience</p>
              
              <div className="space-y-4">
                <div className="flex items-center justify-between p-4 rounded-lg border bg-card">
                  <div className="space-y-1">
                    <Label className="text-base font-medium">Public Profile</Label>
                    <p className="text-sm text-muted-foreground">
                      Allow other travelers to find and connect with you
                    </p>
                  </div>
                  <Switch
                    checked={profile.public_profile}
                    onCheckedChange={(checked) => setProfile(prev => ({ ...prev, public_profile: checked }))}
                  />
                </div>

                <div className="p-4 rounded-lg border bg-card">
                  <h4 className="font-medium mb-2">Your Travel Buddy Profile Summary</h4>
                  <div className="space-y-2 text-sm text-muted-foreground">
                    <p><strong>Age:</strong> {profile.age || 'Not specified'}</p>
                    <p><strong>Location:</strong> {profile.location || 'Not specified'}</p>
                    <p><strong>Travel Style:</strong> {profile.travel_style || 'Not specified'}</p>
                    <p><strong>Budget Range:</strong> ${preferences.budget_range_min} - ${preferences.budget_range_max} per day</p>
                    <p><strong>Group Size:</strong> {preferences.group_size_preference || 'Not specified'}</p>
                    <p><strong>Languages:</strong> {profile.languages_spoken.length > 0 ? profile.languages_spoken.join(', ') : 'None specified'}</p>
                  </div>
                </div>
              </div>
            </div>
          )}

          <div className="flex justify-between pt-6">
            {step > 1 && (
              <Button variant="outline" onClick={prevStep}>
                Previous
              </Button>
            )}
            
            <div className="ml-auto">
              {step < 5 ? (
                <Button onClick={nextStep}>
                  Next
                </Button>
              ) : (
                <Button onClick={handleSubmit} disabled={loading}>
                  {loading ? "Creating Profile..." : "Complete Setup"}
                </Button>
              )}
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default ProfileSetup;
