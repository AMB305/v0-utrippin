import { useEffect, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useAuth } from '@/hooks/useAuth';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import UtrippinLogo from '@/components/UtrippinLogo';
import { CheckCircle, XCircle, Loader2, Mail } from 'lucide-react';

const EmailVerification = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [verificationStatus, setVerificationStatus] = useState<'pending' | 'success' | 'error'>('pending');

  useEffect(() => {
    const handleEmailVerification = async () => {
      // If user is already authenticated and verified, redirect
      if (user && user.email_confirmed_at) {
        // Clear any pending verification email from localStorage
        localStorage.removeItem('pending_verification_email');
        navigate('/profile-setup');
        return;
      }

      // Check for verification parameters in URL
      const token = searchParams.get('token');
      const type = searchParams.get('type');
      const error_description = searchParams.get('error_description');
      
      if (error_description) {
        setVerificationStatus('error');
        toast({
          title: "Verification failed",
          description: error_description,
          variant: "destructive",
        });
        return;
      }
      
      if (token && type === 'signup') {
        try {
          // The verification is handled automatically by Supabase
          setVerificationStatus('success');
          
          // Clear any pending verification email
          localStorage.removeItem('pending_verification_email');
          
          toast({
            title: "Email verified!",
            description: "Your email has been successfully verified. You can now complete your profile.",
          });

          // Redirect to profile setup after a short delay
          setTimeout(() => {
            navigate('/profile-setup');
          }, 2000);
        } catch (error) {
          console.error('Verification error:', error);
          setVerificationStatus('error');
          
          toast({
            title: "Verification failed",
            description: "There was an error verifying your email. Please try again.",
            variant: "destructive",
          });
        }
      }
    };

    handleEmailVerification();
  }, [user, searchParams, navigate, toast]);

  const handleResendEmail = async () => {
    const email = user?.email || localStorage.getItem('pending_verification_email');
    
    if (!email) {
      toast({
        title: "Error",
        description: "No email address found. Please sign up again.",
        variant: "destructive",
      });
      navigate('/auth');
      return;
    }

    try {
      const { error } = await supabase.functions.invoke('send-verification-email', {
        body: {
          email,
          confirmationUrl: `${window.location.origin}/email-verification?redirect_to=${encodeURIComponent('/profile-setup')}`,
          isSignup: true
        }
      });
      
      if (error) {
        throw error;
      }
      
      toast({
        title: "Email sent",
        description: "A new verification email has been sent to your inbox.",
      });
    } catch (error) {
      console.error('Resend email error:', error);
      toast({
        title: "Error", 
        description: "Failed to resend verification email. Please try again.",
        variant: "destructive",
      });
    }
  };

  const getContent = () => {
    switch (verificationStatus) {
      case 'success':
        return {
          icon: <CheckCircle className="w-16 h-16 text-green-500 mx-auto mb-4" />,
          title: "Email Verified!",
          description: "Your email has been successfully verified. Redirecting you to complete your profile...",
          showButton: false
        };
      
      case 'error':
        return {
          icon: <XCircle className="w-16 h-16 text-red-500 mx-auto mb-4" />,
          title: "Verification Failed",
          description: "There was an error verifying your email. Please try clicking the link again or request a new verification email.",
          showButton: true,
          buttonText: "Resend Email",
          buttonAction: handleResendEmail
        };
      
      default:
        return {
          icon: <Mail className="w-16 h-16 text-primary mx-auto mb-4" />,
          title: "Check Your Email",
          description: "We've sent a verification link to your email address. Please click the link to verify your account and continue to complete your travel profile.",
          showButton: true,
          buttonText: "Resend Email",
          buttonAction: handleResendEmail
        };
    }
  };

  const content = getContent();

  return (
    <div className="min-h-screen bg-gradient-hero flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <UtrippinLogo />
          <h1 className="text-2xl font-bold text-primary-foreground mt-4">
            Email Verification
          </h1>
        </div>

        <Card className="bg-background/95 backdrop-blur-md border-border/50 shadow-large">
          <CardHeader className="text-center">
            {content.icon}
            <CardTitle className="text-2xl">{content.title}</CardTitle>
            <CardDescription className="text-center">
              {content.description}
            </CardDescription>
            {verificationStatus === 'pending' && (
              <div className="mt-4 p-3 bg-primary/10 rounded-lg">
                <p className="text-sm text-primary font-medium">
                  📧 Step 1 of 2: Email Verification
                </p>
                <p className="text-xs text-muted-foreground mt-1">
                  Next: Complete your travel profile to find buddies
                </p>
              </div>
            )}
          </CardHeader>
          
          {content.showButton && (
            <CardContent className="space-y-4">
              <Button 
                onClick={content.buttonAction}
                className="w-full"
                variant="default"
              >
                {verificationStatus === 'pending' ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Sending...
                  </>
                ) : (
                  content.buttonText
                )}
              </Button>
              
              <div className="text-center">
                <Button 
                  variant="ghost" 
                  onClick={() => navigate('/auth')}
                  className="text-muted-foreground hover:text-foreground"
                >
                  Back to Sign In
                </Button>
              </div>
            </CardContent>
          )}
        </Card>
      </div>
    </div>
  );
};

export default EmailVerification;