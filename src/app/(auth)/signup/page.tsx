
"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import Link from "next/link";
import { Phone, KeyRound, User } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useRouter } from "next/navigation";
import { Checkbox } from "@/components/ui/checkbox";

type Step = 'details' | 'otp';

interface FormData {
  fullName: string;
  phoneNumber: string;
  password: string;
  confirmPassword: string;
  agreedToTerms: boolean;
}

interface FormErrors {
  fullName?: string;
  phoneNumber?: string;
  password?: string;
  confirmPassword?: string;
  otp?: string;
  agreedToTerms?: string;
}

export default function ClientSignupPage() {
  const router = useRouter();
  const [step, setStep] = useState<Step>('details');
  const [formData, setFormData] = useState<FormData>({
    fullName: "",
    phoneNumber: "",
    password: "",
    confirmPassword: "",
    agreedToTerms: false,
  });
  const [otp, setOtp] = useState("");
  const [errors, setErrors] = useState<FormErrors>({});
  const { toast } = useToast();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { id, value } = e.target;
    setFormData((prev) => ({ ...prev, [id]: value }));
    if (errors[id as keyof FormErrors]) {
      setErrors(prev => ({ ...prev, [id]: undefined }));
    }
  };

  const validatePhoneNumber = (phone: string) => /^[6-9]\d{9}$/.test(phone);
  const validateOtp = (otpValue: string) => /^\d{6}$/.test(otpValue);

  const handleDetailsSubmit = () => {
    const newErrors: FormErrors = {};
    if (!formData.fullName.trim() || formData.fullName.trim().length < 3) newErrors.fullName = "Full name must be at least 3 characters.";
    if (!formData.phoneNumber.trim() || !validatePhoneNumber(formData.phoneNumber)) newErrors.phoneNumber = "Please enter a valid 10-digit Indian mobile number.";
    if (!formData.password || formData.password.length < 6) newErrors.password = "Password must be at least 6 characters.";
    if (formData.password !== formData.confirmPassword) newErrors.confirmPassword = "Passwords do not match.";
    if (!formData.agreedToTerms) newErrors.agreedToTerms = "You must agree to the terms and conditions.";
    
    setErrors(newErrors);
    
    if (Object.keys(newErrors).length === 0) {
      toast({
        title: "OTP Sent (Simulated)",
        description: `An OTP has been sent to ${formData.phoneNumber}. (Hint: Use any 6 digits)`,
      });
      setStep("otp");
    } else {
        const errorDesc = Object.values(newErrors).join(' ');
        toast({ title: "Validation Error", description: errorDesc, variant: "destructive" });
    }
  };
  
  const handleOtpSubmit = () => {
    if (!validateOtp(otp)) {
      setErrors({ otp: "Please enter a valid 6-digit OTP." });
      toast({ title: "Validation Error", description: "Please enter a valid 6-digit OTP.", variant: "destructive" });
      return;
    }
    
    setErrors({});
    console.log("Simulated OTP verification successful. Creating account for:", formData.phoneNumber);
    toast({
        title: "Account Created! (Simulated)",
        description: "Your account has been created. Redirecting to login..."
    });
    router.push('/login');
  };

  return (
    <Card className="shadow-xl w-full max-w-md">
      <CardHeader>
        <CardTitle className="font-headline text-2xl">
           {step === 'details' ? 'Create Your Client Account' : `Verify ${formData.phoneNumber}`}
        </CardTitle>
        <CardDescription>
           {step === 'details' 
            ? 'Join DesignFlow to connect with expert designers.'
            : 'Enter the 6-digit OTP sent to your phone to complete signup.'}
        </CardDescription>
      </CardHeader>
      
      {step === 'details' ? (
        <CardContent className="space-y-4">
            <div className="space-y-1">
            <Label htmlFor="fullName">Full Name</Label>
            <div className="relative">
                <User className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input id="fullName" type="text" placeholder="Your Name" className="pl-10" value={formData.fullName} onChange={handleChange} aria-invalid={!!errors.fullName} />
            </div>
            {errors.fullName && <p className="text-sm text-destructive pt-1">{errors.fullName}</p>}
            </div>
            <div className="space-y-1">
            <Label htmlFor="phoneNumber">Phone Number</Label>
            <div className="relative">
                <Phone className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input id="phoneNumber" type="tel" placeholder="e.g. 9876543210" className="pl-10" value={formData.phoneNumber} onChange={handleChange} aria-invalid={!!errors.phoneNumber} />
            </div>
            {errors.phoneNumber && <p className="text-sm text-destructive pt-1">{errors.phoneNumber}</p>}
            </div>
            <div className="space-y-1">
            <Label htmlFor="password">Password</Label>
            <div className="relative">
                <KeyRound className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input id="password" type="password" placeholder="•••••••• (min. 6 characters)" className="pl-10" value={formData.password} onChange={handleChange} aria-invalid={!!errors.password} />
            </div>
            {errors.password && <p className="text-sm text-destructive pt-1">{errors.password}</p>}
            </div>
            <div className="space-y-1">
            <Label htmlFor="confirmPassword">Confirm Password</Label>
            <div className="relative">
                <KeyRound className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input id="confirmPassword" type="password" placeholder="••••••••" className="pl-10" value={formData.confirmPassword} onChange={handleChange} aria-invalid={!!errors.confirmPassword} />
            </div>
            {errors.confirmPassword && <p className="text-sm text-destructive pt-1">{errors.confirmPassword}</p>}
            </div>
             <div className="flex items-start space-x-2 pt-2">
                <Checkbox id="terms" checked={formData.agreedToTerms} onCheckedChange={(checked) => setFormData(prev => ({ ...prev, agreedToTerms: !!checked }))} aria-invalid={!!errors.agreedToTerms} />
                <div className="grid gap-1.5 leading-none">
                <label htmlFor="terms" className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                    I agree to the <Link href="/terms-of-service" className="underline hover:text-primary">Terms of Service</Link> and <Link href="/privacy-policy" className="underline hover:text-primary">Privacy Policy</Link>.
                </label>
                 {errors.agreedToTerms && <p className="text-sm text-destructive">{errors.agreedToTerms}</p>}
                </div>
            </div>
        </CardContent>
      ) : (
         <CardContent className="space-y-4">
          <div className="space-y-1">
            <Label htmlFor="otp">One-Time Password (OTP)</Label>
            <div className="relative">
              <KeyRound className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input 
                id="otp" 
                type="tel" 
                placeholder="Enter 6-digit OTP" 
                className="pl-10 tracking-widest text-center" 
                value={otp} 
                onChange={(e) => { setOtp(e.target.value); if(errors.otp) setErrors(prev => ({...prev, otp: undefined})); }}
                aria-invalid={!!errors.otp}
                maxLength={6}
              />
            </div>
            {errors.otp && <p className="text-sm text-destructive pt-1">{errors.otp}</p>}
             <div className="text-right pt-1">
              <Button variant="link" size="sm" className="h-auto p-0 text-xs" onClick={() => setStep("details")}>
                  Change Details
              </Button>
            </div>
          </div>
        </CardContent>
      )}

      <CardFooter className="flex flex-col space-y-4">
        {step === 'details' ? (
            <Button onClick={handleDetailsSubmit} className="w-full">Sign Up</Button>
        ) : (
            <Button onClick={handleOtpSubmit} className="w-full">Verify & Create Account</Button>
        )}
        
        <p className="text-sm text-muted-foreground pt-2">
          Already have an account?{" "}
          <Link href="/login" className="font-medium text-primary hover:underline">
            Log In
          </Link>
        </p>
        <p className="text-sm text-muted-foreground">
          Are you a designer?{" "}
          <Link href="/signup/designer" className="font-medium text-primary hover:underline">
            Sign Up as a Designer
          </Link>
        </p>
      </CardFooter>
    </Card>
  );
}
