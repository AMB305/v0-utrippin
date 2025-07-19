import { useState } from 'react';
import { Navigate, useNavigate, Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { SEOHead } from '@/components/SEOHead';
import { useAuth } from '@/hooks/useAuth';
import { useToast } from '@/hooks/use-toast';
import { ArrowLeft } from 'lucide-react';
import UtrippinLogo from '@/components/UtrippinLogo';
import { emailSchema, passwordSchema, sanitizeString } from '@/lib/validation';

const Auth = () => {
  const { user, signIn, signUp, signInWithGoogle } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    confirmPassword: '',
  });

  // Redirect if already authenticated
  if (user) {
    return <Navigate to="/" replace />;
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    const sanitizedValue = sanitizeString(value);
    
    setFormData(prev => ({
      ...prev,
      [name]: sanitizedValue
    }));
  };

  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      // Validate input data
      const validatedEmail = emailSchema.parse(formData.email);
      const validatedPassword = passwordSchema.parse(formData.password);

      const { error, needsVerification } = await signIn(validatedEmail, validatedPassword);
      
      if (needsVerification) {
        toast({
          title: "Email verification required",
          description: "Please check your email and click the verification link before signing in.",
          variant: "destructive",
        });
        // Store email for verification page
        localStorage.setItem('pending_verification_email', validatedEmail);
        // Redirect to email verification page
        navigate('/email-verification');
        return;
      }
      
      if (error) {
        toast({
          title: "Sign in failed",
          description: error.message,
          variant: "destructive",
        });
      } else {
        toast({
          title: "Welcome back!",
          description: "You've been signed in successfully.",
        });
      }
    } catch (error: any) {
      toast({
        title: "An error occurred",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      // Validate input data
      const validatedEmail = emailSchema.parse(formData.email);
      const validatedPassword = passwordSchema.parse(formData.password);
      
      if (formData.password !== formData.confirmPassword) {
        toast({
          title: "Passwords don't match",
          description: "Please make sure your passwords match.",
          variant: "destructive",
        });
        return;
      }

      setLoading(true);

      const { error } = await signUp(validatedEmail, validatedPassword);
      
      if (error) {
        if (error.message.includes('already registered')) {
          toast({
            title: "Account already exists",
            description: "An account with this email already exists. Please sign in instead.",
            variant: "destructive",
          });
        } else {
          toast({
            title: "Sign up failed",
            description: error.message,
            variant: "destructive",
          });
        }
      } else {
        // Store email for verification page
        localStorage.setItem('pending_verification_email', validatedEmail);
        
        toast({
          title: "Check your email",
          description: "We've sent you a verification link to complete your registration.",
        });
        // Redirect to email verification page
        setTimeout(() => {
          navigate('/email-verification');
        }, 1000);
      }
    } catch (error: any) {
      toast({
        title: "An error occurred",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleSignIn = async () => {
    setLoading(true);
    try {
      const { error } = await signInWithGoogle();
      if (error) {
        toast({
          title: "Google sign in failed",
          description: error.message,
          variant: "destructive",
        });
      }
    } catch (error: any) {
      toast({
        title: "An error occurred",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <SEOHead 
        title="Sign In or Sign Up - Join Utrippin.ai"
        description="Join Utrippin.ai to find travel buddies, plan amazing trips with AI, and discover the world together. Sign up for free or sign in to your account."
        canonical="https://utrippin.ai/auth"
        keywords="travel signup, travel login, travel community, travel buddies, AI travel"
        structuredData={{
          "@context": "https://schema.org",
          "@graph": [
            {
              "@type": "WebPage",
              "@id": "https://utrippin.ai/auth#webpage",
              "url": "https://utrippin.ai/auth",
              "name": "Sign In or Sign Up - Join Utrippin.ai",
              "description": "Join Utrippin.ai to find travel buddies, plan amazing trips with AI, and discover the world together. Sign up for free or sign in to your account.",
              "inLanguage": "en-US"
            }
          ]
        }}
      />
    <div className="min-h-screen bg-gradient-hero flex items-center justify-center p-4">
      {/* Back to Home Button */}
      <Link 
        to="/" 
        className="fixed top-6 left-6 z-10 flex items-center gap-2 text-white/80 hover:text-white transition-colors duration-300 bg-black/20 hover:bg-black/30 backdrop-blur-sm rounded-lg px-3 py-2"
      >
        <ArrowLeft className="w-4 h-4" />
        <span className="text-sm font-medium">Back to Home</span>
      </Link>
      
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <UtrippinLogo />
          <h1 className="text-2xl font-bold text-primary-foreground mt-4">
            Join the Travel Community
          </h1>
          <p className="text-primary-foreground/80 mt-2">
            Find your perfect travel buddies and create unforgettable adventures
          </p>
        </div>

        <Card className="bg-background/95 backdrop-blur-md border-border/50 shadow-large">
          <CardHeader className="space-y-1">
            <CardTitle className="text-2xl text-center">Welcome</CardTitle>
            <CardDescription className="text-center">
              Sign in to your account or create a new one
            </CardDescription>
          </CardHeader>
          <CardContent>
            {/* Social Login Section */}
            <div className="space-y-4 mb-6">
              <Button 
                type="button"
                variant="outline" 
                className="w-full"
                onClick={handleGoogleSignIn}
                disabled={loading}
              >
                <svg className="w-4 h-4 mr-2" viewBox="0 0 24 24">
                  <path fill="currentColor" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                  <path fill="currentColor" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                  <path fill="currentColor" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                  <path fill="currentColor" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                </svg>
                {loading ? "Signing in..." : "Continue with Google"}
              </Button>
              
              <div className="relative">
                <div className="absolute inset-0 flex items-center">
                  <span className="w-full border-t" />
                </div>
                <div className="relative flex justify-center text-xs uppercase">
                  <span className="bg-background px-2 text-muted-foreground">
                    Or continue with email
                  </span>
                </div>
              </div>
            </div>

            <Tabs defaultValue="signin" className="w-full">
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="signin">Sign In</TabsTrigger>
                <TabsTrigger value="signup">Sign Up</TabsTrigger>
              </TabsList>
              
              <TabsContent value="signin">
                <form onSubmit={handleSignIn} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="signin-email">Email</Label>
                    <Input
                      id="signin-email"
                      name="email"
                      type="email"
                      placeholder="Enter your email"
                      value={formData.email}
                      onChange={handleInputChange}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="signin-password">Password</Label>
                    <Input
                      id="signin-password"
                      name="password"
                      type="password"
                      placeholder="Enter your password"
                      value={formData.password}
                      onChange={handleInputChange}
                      required
                    />
                  </div>
                  <Button 
                    type="submit" 
                    className="w-full" 
                    disabled={loading}
                  >
                    {loading ? "Signing in..." : "Sign In"}
                  </Button>
                </form>
              </TabsContent>
              
              <TabsContent value="signup">
                <form onSubmit={handleSignUp} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="signup-email">Email</Label>
                    <Input
                      id="signup-email"
                      name="email"
                      type="email"
                      placeholder="Enter your email"
                      value={formData.email}
                      onChange={handleInputChange}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="signup-password">Password</Label>
                    <Input
                      id="signup-password"
                      name="password"
                      type="password"
                      placeholder="Create a password"
                      value={formData.password}
                      onChange={handleInputChange}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="confirm-password">Confirm Password</Label>
                    <Input
                      id="confirm-password"
                      name="confirmPassword"
                      type="password"
                      placeholder="Confirm your password"
                      value={formData.confirmPassword}
                      onChange={handleInputChange}
                      required
                    />
                  </div>
                  <Button 
                    type="submit" 
                    className="w-full" 
                    disabled={loading}
                  >
                    {loading ? "Creating account..." : "Create Account"}
                  </Button>
                </form>
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
      </div>
      </div>
    </>
  );
};

export default Auth;