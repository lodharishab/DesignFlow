
"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import Link from "next/link";
import { Phone, KeyRound } from "lucide-react";
import { useRouter } from "next/navigation";
import { useToast } from "@/hooks/use-toast";

interface LoginFormErrors {
  phoneNumber?: string;
  otp?: string;
  general?: string;
}

export default function LoginPage() {
  const router = useRouter();
  const [phoneNumber, setPhoneNumber] = useState('');
  const [otp, setOtp] = useState('');
  const [step, setStep] = useState<'enter-phone' | 'enter-otp'>('enter-phone');
  const [errors, setErrors] = useState<LoginFormErrors>({});
  const { toast } = useToast();

  const validatePhoneNumber = (phone: string) => {
    // Simple validation for 10-digit Indian mobile numbers
    return /^[6-9]\d{9}$/.test(phone);
  };
  
  const validateOtp = (otp: string) => {
    return /^\d{6}$/.test(otp);
  }

  const handleContinue = () => {
    const newErrors: LoginFormErrors = {};
    if (!phoneNumber.trim()) {
      newErrors.phoneNumber = "Phone number is required.";
    } else if (!validatePhoneNumber(phoneNumber)) {
      newErrors.phoneNumber = "Please enter a valid 10-digit Indian mobile number.";
    }
    
    setErrors(newErrors);

    if (Object.keys(newErrors).length === 0) {
      // Simulate sending OTP
      toast({
        title: "OTP Sent (Simulated)",
        description: "An OTP has been sent to your mobile number. (Hint: Use any 6 digits)",
      });
      setStep('enter-otp');
    } else {
        toast({
            title: "Validation Error",
            description: newErrors.phoneNumber,
            variant: "destructive"
        });
    }
  };

  const handleVerifyOtp = () => {
    const newErrors: LoginFormErrors = {};
    if(!otp) {
      newErrors.otp = "Please enter the OTP."
    } else if (!validateOtp(otp)) {
      newErrors.otp = "Please enter a valid 6-digit OTP.";
    }

    setErrors(newErrors);
    
    if (Object.keys(newErrors).length > 0) {
      toast({
            title: "Validation Error",
            description: newErrors.otp,
            variant: "destructive"
        })
      return;
    }
    
    // For prototype, we'll use specific numbers for roles, OTP can be anything for now
    toast({
        title: "Login Successful!",
        description: "You have been successfully logged in."
    });

    if (phoneNumber.includes('111')) {
      router.push('/admin/dashboard');
    } else if (phoneNumber.includes('222')) {
      router.push('/designer/pending-approval');
    } else {
      router.push('/client/dashboard'); 
    }
  };
  
  const resetToPhoneStep = () => {
    setStep('enter-phone');
    setOtp('');
    setErrors({});
  }

  return (
    <Card className="shadow-xl">
      <CardHeader>
        <CardTitle className="font-headline text-2xl">
          {step === 'enter-phone' ? 'Welcome Back!' : 'Verify Your Number'}
        </CardTitle>
        <CardDescription>
          {step === 'enter-phone' 
            ? 'Enter your phone number to log in or sign up.' 
            : `Enter the 6-digit OTP sent to ${phoneNumber}.`}
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {step === 'enter-phone' ? (
          <div className="space-y-1">
            <Label htmlFor="phoneNumber">Phone Number</Label>
            <div className="relative">
              <Phone className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input 
                id="phoneNumber" 
                type="tel" 
                placeholder="e.g., 9876543210 (try ending in 111 for admin)" 
                className="pl-10" 
                value={phoneNumber} 
                onChange={(e) => { setPhoneNumber(e.target.value); if (errors.phoneNumber) setErrors(prev => ({...prev, phoneNumber: undefined})) }}
                aria-invalid={!!errors.phoneNumber}
                aria-describedby="phoneNumber-error"
                maxLength={10}
              />
            </div>
            {errors.phoneNumber && <p id="phoneNumber-error" className="text-sm text-destructive pt-1">{errors.phoneNumber}</p>}
          </div>
        ) : (
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
                onChange={(e) => { setOtp(e.target.value); if (errors.otp) setErrors(prev => ({...prev, otp: undefined})) }}
                aria-invalid={!!errors.otp}
                aria-describedby="otp-error"
                maxLength={6}
              />
            </div>
            {errors.otp && <p id="otp-error" className="text-sm text-destructive pt-1">{errors.otp}</p>}
            <div className="text-right pt-1">
                <Button variant="link" size="sm" className="h-auto p-0 text-xs" onClick={resetToPhoneStep}>
                    Change Number
                </Button>
            </div>
          </div>
        )}
        {errors.general && <p className="text-sm text-destructive pt-1">{errors.general}</p>}
      </CardContent>
      <CardFooter className="flex flex-col space-y-4">
        {step === 'enter-phone' ? (
          <Button className="w-full" onClick={handleContinue}>Continue</Button>
        ) : (
          <Button className="w-full" onClick={handleVerifyOtp}>Verify OTP</Button>
        )}
        
        <p className="text-xs text-muted-foreground text-center">
          By continuing, you agree to our Terms of Service and Privacy Policy. An SMS may be sent to verify your number.
        </p>
      </CardFooter>
    </Card>
  );
}
