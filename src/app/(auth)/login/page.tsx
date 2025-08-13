
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
  general?: string;
}

export default function LoginPage() {
  const router = useRouter();
  const [phoneNumber, setPhoneNumber] = useState('');
  const [errors, setErrors] = useState<LoginFormErrors>({});
  const { toast } = useToast();

  const validatePhoneNumber = (phone: string) => {
    // Simple validation for 10-digit Indian mobile numbers
    return /^[6-9]\d{9}$/.test(phone);
  };

  const validateForm = (): boolean => {
    const newErrors: LoginFormErrors = {};
    if (!phoneNumber.trim()) newErrors.phoneNumber = "Phone number is required.";
    else if (!validatePhoneNumber(phoneNumber)) newErrors.phoneNumber = "Please enter a valid 10-digit Indian mobile number.";
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleLogin = () => {
    if (!validateForm()) {
      toast({
            title: "Validation Error",
            description: "Please enter a valid phone number.",
            variant: "destructive"
        })
      return;
    }
    
    // For prototype, we'll use specific numbers for roles
    if (phoneNumber.includes('111')) {
      router.push('/admin/dashboard');
    } else if (phoneNumber.includes('222')) {
      router.push('/designer/pending-approval');
    } else {
      router.push('/client/dashboard'); 
    }
  };

  return (
    <Card className="shadow-xl">
      <CardHeader>
        <CardTitle className="font-headline text-2xl">Welcome Back!</CardTitle>
        <CardDescription>Enter your phone number to log in or sign up.</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
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
        {errors.general && <p className="text-sm text-destructive pt-1">{errors.general}</p>}
      </CardContent>
      <CardFooter className="flex flex-col space-y-4">
        <Button className="w-full" onClick={handleLogin}>Continue</Button>
        <p className="text-xs text-muted-foreground text-center">
          By continuing, you agree to our Terms of Service and Privacy Policy. An SMS may be sent to verify your number.
        </p>
      </CardFooter>
    </Card>
  );
}
