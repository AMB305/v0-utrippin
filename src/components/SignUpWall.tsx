import { useState } from 'react';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

import { Separator } from '@/components/ui/separator';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useAuth } from '@/hooks/useAuth';
import { useToast } from '@/hooks/use-toast';
import { Loader2, Mail, Users, Globe, Heart, MapPin } from 'lucide-react';
import UtrippinLogo from '@/components/UtrippinLogo';

interface SignUpWallProps {
  isOpen: boolean;
  onClose: () => void;
  triggerSource?: 'travel-buddies' | 'trip-booking' | 'social-features';
}

const SignUpWall = ({ isOpen, onClose, triggerSource = 'travel-buddies' }: SignUpWallProps) => {
  const { signUp, signInWithGoogle } = useAuth();
  const { toast } = useToast();
  
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    confirmPassword: ''
  });
  
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value.trim()
    }));
  };

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.email || !formData.password) {
      toast({
        title: "Missing information",
        description: "Please fill in all required fields.",
        variant: "destructive",
      });
      return;
    }

    if (formData.password !== formData.confirmPassword) {
      toast({
        title: "Password mismatch",
        description: "Passwords don't match. Please try again.",
        variant: "destructive",
      });
      return;
    }

    if (formData.password.length < 6) {
      toast({
        title: "Password too short",
        description: "Password must be at least 6 characters long.",
        variant: "destructive",
      });
      return;
    }

    setLoading(true);
    
    try {
      const { error } = await signUp(formData.email, formData.password);
      
      if (error) {
        toast({
          title: "Sign up failed",
          description: error.message || "Failed to create account. Please try again.",
          variant: "destructive",
        });
        return;
      }

      // Store minimal signup data for profile setup
      localStorage.setItem('signup_source', triggerSource);
      localStorage.setItem('pending_verification_email', formData.email);

      toast({
        title: "Account created!",
        description: "Please check your email to verify your account before continuing.",
      });
      
      // Redirect to email verification page instead of closing
      window.location.href = '/email-verification';
      onClose();
    } catch (error) {
      console.error('Signup error:', error);
      toast({
        title: "Sign up failed",
        description: "An unexpected error occurred. Please try again.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleSignUp = async () => {
    setLoading(true);
    
    try {
      // Store minimal signup data for Google auth flow
      localStorage.setItem('signup_source', triggerSource);
      
      const { error } = await signInWithGoogle();
      
      if (error) {
        toast({
          title: "Google sign up failed",
          description: error.message || "Failed to sign up with Google. Please try again.",
          variant: "destructive",
        });
        return;
      }

      toast({
        title: "Welcome!",
        description: "Successfully signed up with Google.",
      });
      
      onClose();
    } catch (error) {
      console.error('Google signup error:', error);
      toast({
        title: "Google sign up failed",
        description: "An unexpected error occurred. Please try again.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const getWelcomeContent = () => {
    switch (triggerSource) {
      case 'trip-booking':
        return {
          title: "Join to Book Your Trip",
          description: "Create an account to complete your booking and unlock exclusive travel features.",
          icon: <MapPin className="w-6 h-6 text-primary" />
        };
      case 'social-features':
        return {
          title: "Join the Travel Community",
          description: "Connect with fellow travelers and share your adventures.",
          icon: <Heart className="w-6 h-6 text-primary" />
        };
      default:
        return {
          title: "Find Your Travel Buddies",
          description: "Join thousands of travelers looking for companions to explore the world with.",
          icon: <Users className="w-6 h-6 text-primary" />
        };
    }
  };

  const welcomeContent = getWelcomeContent();

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-md mx-auto max-h-[90vh] overflow-y-auto">
        <DialogHeader className="text-center space-y-4">
          <div className="flex justify-center">
            <UtrippinLogo />
          </div>
          <div className="flex items-center justify-center gap-2">
            {welcomeContent.icon}
            <DialogTitle className="text-2xl font-bold">
              {welcomeContent.title}
            </DialogTitle>
          </div>
          <DialogDescription className="text-center">
            {welcomeContent.description}
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6">
          {/* Google Sign Up */}
          <Button
            onClick={handleGoogleSignUp}
            disabled={loading}
            variant="outline"
            className="w-full"
          >
            {loading ? (
              <Loader2 className="w-4 h-4 mr-2 animate-spin" />
            ) : (
              <Globe className="w-4 h-4 mr-2" />
            )}
            Continue with Google
          </Button>

          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <Separator className="w-full" />
            </div>
            <div className="relative flex justify-center text-xs uppercase">
              <span className="bg-background px-2 text-muted-foreground">
                Or continue with email
              </span>
            </div>
          </div>

          {/* Email Sign Up Form */}
          <form onSubmit={handleSignUp} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email">Email address</Label>
              <Input
                id="email"
                name="email"
                type="email"
                value={formData.email}
                onChange={handleInputChange}
                placeholder="your@email.com"
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <Input
                id="password"
                name="password"
                type="password"
                value={formData.password}
                onChange={handleInputChange}
                placeholder="At least 6 characters"
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="confirmPassword">Confirm Password</Label>
              <Input
                id="confirmPassword"
                name="confirmPassword"
                type="password"
                value={formData.confirmPassword}
                onChange={handleInputChange}
                placeholder="Confirm your password"
                required
              />
            </div>

            {/* Next Steps Info */}
            <Card className="border-border/50 bg-primary/5">
              <CardContent className="pt-6">
                <div className="flex items-center gap-2 mb-2">
                  <Heart className="w-4 h-4 text-primary" />
                  <p className="text-sm font-medium">Next Steps</p>
                </div>
                <p className="text-xs text-muted-foreground">
                  After email verification, you'll complete your travel profile to find the perfect travel buddies and unlock all features.
                </p>
              </CardContent>
            </Card>

            <Button
              type="submit"
              disabled={loading}
              className="w-full"
            >
              {loading ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Creating account...
                </>
              ) : (
                <>
                  <Mail className="w-4 h-4 mr-2" />
                  Create Account
                </>
              )}
            </Button>
          </form>

          <div className="text-center text-sm text-muted-foreground">
            By signing up, you agree to our{' '}
            <a href="/terms" className="underline hover:text-foreground">
              Terms of Service
            </a>{' '}
            and{' '}
            <a href="/privacy" className="underline hover:text-foreground">
              Privacy Policy
            </a>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default SignUpWall;
