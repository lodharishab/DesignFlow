
"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import Link from "next/link";
import { Phone, KeyRound, User } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface DesignerFormData {
  name: string;
  phoneNumber: string;
  password: string;
}

interface DesignerFormErrors {
  name?: string;
  phoneNumber?: string;
  password?: string;
  general?: string;
}

export default function DesignerSignupPage() {
  const [formData, setFormData] = useState<DesignerFormData>({
    name: "",
    phoneNumber: "",
    password: "",
  });
  const [errors, setErrors] = useState<DesignerFormErrors>({});
  const { toast } = useToast();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { id, value } = e.target;
    setFormData((prev) => ({ ...prev, [id]: value }));
    if (errors[id as keyof DesignerFormErrors]) {
      setErrors(prev => ({ ...prev, [id]: undefined }));
    }
  };

  const validatePhoneNumber = (phone: string) => {
    return /^[6-9]\d{9}$/.test(phone);
  };

  const validateForm = (): boolean => {
    const newErrors: DesignerFormErrors = {};
    if (!formData.name.trim()) newErrors.name = "Full name is required.";
    else if (formData.name.trim().length < 3) newErrors.name = "Full name must be at least 3 characters.";

    if (!formData.phoneNumber.trim()) newErrors.phoneNumber = "Phone number is required.";
    else if (!validatePhoneNumber(formData.phoneNumber)) newErrors.phoneNumber = "Please enter a valid 10-digit Indian mobile number.";

    if (!formData.password) newErrors.password = "Password is required.";
    else if (formData.password.length < 6) newErrors.password = "Password must be at least 6 characters.";
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = () => {
    if (!validateForm()) {
        toast({
            title: "Validation Error",
            description: "Please correct the errors before submitting.",
            variant: "destructive"
        })
      return;
    }
    // Handle final form submission
    console.log("Designer Signup Data:", formData);
    toast({
        title: "Signup Submitted (Simulated)",
        description: "Your designer application has been received. You'll be redirected to the pending approval page."
    });
    // router.push('/designer/pending-approval'); // This would be the typical next step
  };


  return (
    <Card className="shadow-xl">
      <CardHeader>
        <CardTitle className="font-headline text-2xl">Join as a Designer</CardTitle>
        <CardDescription>Offer your design services and skills on the DesignFlow platform.</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-1">
          <Label htmlFor="name">Full Name</Label>
           <div className="relative">
            <User className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input id="name" type="text" placeholder="Your Name" className="pl-10" value={formData.name} onChange={handleChange} aria-invalid={!!errors.name} aria-describedby="name-error"/>
          </div>
           {errors.name && <p id="name-error" className="text-sm text-destructive pt-1">{errors.name}</p>}
        </div>
        <div className="space-y-1">
          <Label htmlFor="phoneNumber">Phone Number</Label>
          <div className="relative">
            <Phone className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input id="phoneNumber" type="tel" placeholder="e.g., 9876543210" className="pl-10" value={formData.phoneNumber} onChange={handleChange} aria-invalid={!!errors.phoneNumber} aria-describedby="phoneNumber-error"/>
          </div>
          {errors.phoneNumber && <p id="phoneNumber-error" className="text-sm text-destructive pt-1">{errors.phoneNumber}</p>}
        </div>
        <div className="space-y-1">
          <Label htmlFor="password">Password</Label>
          <div className="relative">
            <KeyRound className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input id="password" type="password" placeholder="••••••••" className="pl-10" value={formData.password} onChange={handleChange} aria-invalid={!!errors.password} aria-describedby="password-error"/>
          </div>
           {errors.password && <p id="password-error" className="text-sm text-destructive pt-1">{errors.password}</p>}
        </div>
        {/* 
        <div className="space-y-1">
          <Label htmlFor="portfolioLink">Portfolio Link (e.g., Behance, Dribbble)</Label>
           <div className="relative">
            <LinkIcon className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input id="portfolioLink" type="url" placeholder="https://yourportfolio.com" className="pl-10" value={formData.portfolioLink} onChange={handleChange} aria-invalid={!!errors.portfolioLink} aria-describedby="portfolioLink-error"/>
          </div>
           {errors.portfolioLink && <p id="portfolioLink-error" className="text-sm text-destructive pt-1">{errors.portfolioLink}</p>}
        </div>
        */}
         {errors.general && <p className="text-sm text-destructive pt-1">{errors.general}</p>}
      </CardContent>
      <CardFooter className="flex flex-col space-y-4">
        <Button className="w-full" onClick={handleSubmit}>Sign Up as Designer</Button>
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
