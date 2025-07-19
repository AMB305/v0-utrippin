import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { useAuth } from '@/hooks/useAuth';
import { useToast } from '@/hooks/use-toast';
import { userService } from '@/services/UserService';
import { supabase } from '@/integrations/supabase/client';
import { User, Camera, MapPin, Heart, Languages, Save, Upload } from 'lucide-react';

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

const LANGUAGES = [
  'English', 'Spanish', 'French', 'German', 'Italian', 'Portuguese',
  'Mandarin', 'Japanese', 'Korean', 'Arabic', 'Russian', 'Dutch'
];

const Profile = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [userProfile, setUserProfile] = useState<any>(null);
  const [photoFile, setPhotoFile] = useState<File | null>(null);
  const [photoPreview, setPhotoPreview] = useState<string>('');

  const [formData, setFormData] = useState({
    username: '',
    bio: '',
    age: '',
    location: '',
    travel_style: '',
    interests: [] as string[],
    preferred_destinations: [] as string[],
    languages_spoken: [] as string[],
    profile_photo_url: ''
  });

  useEffect(() => {
    if (user) {
      loadUserProfile();
    }
  }, [user]);

  const loadUserProfile = async () => {
    if (!user) return;
    
    const profile = await userService.getCurrentUser();
    if (profile) {
      setUserProfile(profile);
      setFormData({
        username: profile.profile?.username || '',
        bio: profile.bio || '',
        age: profile.age?.toString() || '',
        location: profile.location || '',
        travel_style: profile.travel_style || '',
        interests: profile.interests || [],
        preferred_destinations: profile.preferred_destinations || [],
        languages_spoken: profile.languages_spoken || [],
        profile_photo_url: profile.profile_photo_url || ''
      });
      setPhotoPreview(profile.profile_photo_url || '');
    }
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

    const { error: uploadError } = await supabase.storage
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

  const toggleArray = (array: string[], item: string) => {
    return array.includes(item)
      ? array.filter(i => i !== item)
      : [...array, item];
  };

  const handleSave = async () => {
    if (!user) return;
    
    setLoading(true);
    try {
      let photoUrl = formData.profile_photo_url;
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
          age: formData.age ? parseInt(formData.age) : null,
          location: formData.location,
          bio: formData.bio,
          travel_style: formData.travel_style,
          interests: formData.interests,
          preferred_destinations: formData.preferred_destinations,
          languages_spoken: formData.languages_spoken,
          profile_photo_url: photoUrl,
        })
        .eq('id', user.id);

      // Update profile table
      const { error: profileError } = await supabase
        .from('profiles')
        .upsert({
          id: user.id,
          username: formData.username,
        });

      if (userError) throw userError;
      if (profileError) throw profileError;

      toast({
        title: "Profile updated!",
        description: "Your profile has been successfully updated.",
      });

      await loadUserProfile();
    } catch (error: any) {
      toast({
        title: "Error updating profile",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const getInitials = (name: string | null | undefined) => {
    if (!name) return 'U';
    return name.split(' ').map(n => n[0]).join('').toUpperCase();
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <User className="w-5 h-5" />
                My Profile
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-8">
              {/* Profile Photo and Basic Info */}
              <div className="flex flex-col md:flex-row gap-6">
                <div className="flex flex-col items-center space-y-4">
                  <Avatar className="w-32 h-32">
                    <AvatarImage src={photoPreview} />
                    <AvatarFallback className="text-2xl">
                      {getInitials(formData.username)}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handlePhotoUpload}
                      className="hidden"
                      id="photo-upload"
                    />
                    <Label 
                      htmlFor="photo-upload" 
                      className="cursor-pointer inline-flex items-center gap-2 px-4 py-2 border border-border rounded-md shadow-sm text-sm font-medium hover:bg-muted"
                    >
                      <Upload className="w-4 h-4" />
                      Change Photo
                    </Label>
                  </div>
                </div>

                <div className="flex-1 space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="username">Display Name</Label>
                      <Input
                        id="username"
                        value={formData.username}
                        onChange={(e) => setFormData(prev => ({ ...prev, username: e.target.value }))}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="age">Age</Label>
                      <Input
                        id="age"
                        type="number"
                        value={formData.age}
                        onChange={(e) => setFormData(prev => ({ ...prev, age: e.target.value }))}
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="location" className="flex items-center gap-1">
                      <MapPin className="w-4 h-4" />
                      Location
                    </Label>
                    <Input
                      id="location"
                      value={formData.location}
                      onChange={(e) => setFormData(prev => ({ ...prev, location: e.target.value }))}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="bio">Bio</Label>
                    <Textarea
                      id="bio"
                      value={formData.bio}
                      onChange={(e) => setFormData(prev => ({ ...prev, bio: e.target.value }))}
                      rows={4}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label>Travel Style</Label>
                    <Select 
                      value={formData.travel_style} 
                      onValueChange={(value) => setFormData(prev => ({ ...prev, travel_style: value }))}
                    >
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
              </div>

              {/* Interests */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold flex items-center gap-2">
                  <Heart className="w-5 h-5" />
                  Interests
                </h3>
                <div className="flex flex-wrap gap-2">
                  {INTERESTS.map((interest) => (
                    <Badge
                      key={interest}
                      variant={formData.interests.includes(interest) ? "default" : "outline"}
                      className="cursor-pointer"
                      onClick={() => setFormData(prev => ({ 
                        ...prev, 
                        interests: toggleArray(prev.interests, interest) 
                      }))}
                    >
                      {interest}
                    </Badge>
                  ))}
                </div>
              </div>

              {/* Preferred Destinations */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold">Dream Destinations</h3>
                <div className="flex flex-wrap gap-2">
                  {DESTINATIONS.map((destination) => (
                    <Badge
                      key={destination}
                      variant={formData.preferred_destinations.includes(destination) ? "default" : "outline"}
                      className="cursor-pointer"
                      onClick={() => setFormData(prev => ({ 
                        ...prev, 
                        preferred_destinations: toggleArray(prev.preferred_destinations, destination) 
                      }))}
                    >
                      {destination}
                    </Badge>
                  ))}
                </div>
              </div>

              {/* Languages */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold flex items-center gap-2">
                  <Languages className="w-5 h-5" />
                  Languages
                </h3>
                <div className="flex flex-wrap gap-2">
                  {LANGUAGES.map((language) => (
                    <Badge
                      key={language}
                      variant={formData.languages_spoken.includes(language) ? "default" : "outline"}
                      className="cursor-pointer"
                      onClick={() => setFormData(prev => ({ 
                        ...prev, 
                        languages_spoken: toggleArray(prev.languages_spoken, language) 
                      }))}
                    >
                      {language}
                    </Badge>
                  ))}
                </div>
              </div>

              {/* Save Button */}
              <div className="flex justify-end">
                <Button onClick={handleSave} disabled={loading}>
                  <Save className="w-4 h-4 mr-2" />
                  {loading ? 'Saving...' : 'Save Changes'}
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Profile;