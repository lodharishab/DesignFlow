
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

type Step = "details" | "otp";

interface DesignerFormData {
  name: string;
  phoneNumber: string;
  password: string;
}

interface DesignerFormErrors {
  name?: string;
  phoneNumber?: string;
  password?: string;
  otp?: string;
}

export default function DesignerSignupPage() {
  const router = useRouter();
  const [step, setStep] = useState<Step>("details");
  const [formData, setFormData] = useState<DesignerFormData>({
    name: "",
    phoneNumber: "",
    password: "",
  });
  const [otp, setOtp] = useState("");
  const [errors, setErrors] = useState<DesignerFormErrors>({});
  const { toast } = useToast();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { id, value } = e.target;
    setFormData((prev) => ({ ...prev, [id]: value }));
    if (errors[id as keyof DesignerFormErrors]) {
      setErrors(prev => ({ ...prev, [id]: undefined }));
    }
  };

  const validatePhoneNumber = (phone: string) => /^[6-9]\d{9}$/.test(phone);
  const validateOtp = (otpValue: string) => /^\d{6}$/.test(otpValue);

  const handleDetailsSubmit = () => {
    const newErrors: DesignerFormErrors = {};
    if (!formData.name.trim() || formData.name.trim().length < 3) newErrors.name = "Full name must be at least 3 characters.";
    if (!formData.phoneNumber.trim() || !validatePhoneNumber(formData.phoneNumber)) newErrors.phoneNumber = "Please enter a valid 10-digit Indian mobile number.";
    if (!formData.password || formData.password.length < 6) newErrors.password = "Password must be at least 6 characters.";
    
    setErrors(newErrors);

    if (Object.keys(newErrors).length === 0) {
      toast({
        title: "OTP Sent (Simulated)",
        description: `An OTP has been sent to ${formData.phoneNumber}. (Hint: Use any 6 digits)`,
      });
      setStep("otp");
    } else {
      toast({ title: "Validation Error", description: "Please correct the errors before submitting.", variant: "destructive" });
    }
  };

  const handleOtpSubmit = () => {
    if (!validateOtp(otp)) {
      setErrors({ otp: "Please enter a valid 6-digit OTP." });
      toast({ title: "Validation Error", description: "Please enter a valid 6-digit OTP.", variant: "destructive" });
      return;
    }
    
    setErrors({});
    console.log("Simulated OTP verification successful for:", formData.phoneNumber);
    toast({
        title: "Signup Submitted (Simulated)",
        description: "Your designer application has been received. You'll be redirected to the pending approval page."
    });
    router.push('/designer/pending-approval');
  };

  return (
    <Card className="shadow-xl">
      <CardHeader>
        <CardTitle className="font-headline text-2xl">
          {step === "details" ? "Join as a Designer" : `Verify ${formData.phoneNumber}`}
        </CardTitle>
        <CardDescription>
          {step === "details"
            ? "Offer your design services and skills on the DesignFlow platform."
            : "Enter the 6-digit OTP sent to your phone to complete signup."}
        </CardDescription>
      </CardHeader>
      
      {step === "details" ? (
        <CardContent className="space-y-4">
          <div className="space-y-1">
            <Label htmlFor="name">Full Name</Label>
            <div className="relative">
              <User className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input id="name" type="text" placeholder="Your Name" className="pl-10" value={formData.name} onChange={handleChange} aria-invalid={!!errors.name} />
            </div>
            {errors.name && <p className="text-sm text-destructive pt-1">{errors.name}</p>}
          </div>
          <div className="space-y-1">
            <Label htmlFor="phoneNumber">Phone Number</Label>
            <div className="relative">
              <Phone className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input id="phoneNumber" type="tel" placeholder="e.g., 9876543210" className="pl-10" value={formData.phoneNumber} onChange={handleChange} aria-invalid={!!errors.phoneNumber} />
            </div>
            {errors.phoneNumber && <p className="text-sm text-destructive pt-1">{errors.phoneNumber}</p>}
          </div>
          <div className="space-y-1">
            <Label htmlFor="password">Password</Label>
            <div className="relative">
              <KeyRound className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input id="password" type="password" placeholder="••••••••" className="pl-10" value={formData.password} onChange={handleChange} aria-invalid={!!errors.password} />
            </div>
            {errors.password && <p className="text-sm text-destructive pt-1">{errors.password}</p>}
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
        {step === "details" ? (
          <Button className="w-full" onClick={handleDetailsSubmit}>Continue</Button>
        ) : (
          <Button className="w-full" onClick={handleOtpSubmit}>Verify & Complete Signup</Button>
        )}
        
        <p className="text-sm text-muted-foreground">
          Already have an account?{" "}
          <Link href="/login" className="font-medium text-primary hover:underline">
            Log In
          </Link>
        </p>
         <p className="text-sm text-muted-foreground">
          Looking to hire?{" "}
          <Link href="/signup" className="font-medium text-primary hover:underline">
            Sign Up as a Client
          </Link>
        </p>
      </CardFooter>
    </Card>
  );
}
