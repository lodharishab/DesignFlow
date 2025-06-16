
"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import Link from "next/link";
import { Mail, KeyRound, User } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useRouter } from "next/navigation";

interface FormData {
  fullName: string;
  email: string;
  password: string;
  confirmPassword: string;
}

interface FormErrors {
  fullName?: string;
  email?: string;
  password?: string;
  confirmPassword?: string;
  general?: string;
}

export default function ClientSignupPage() {
  const router = useRouter();
  const [formData, setFormData] = useState<FormData>({
    fullName: "",
    email: "",
    password: "",
    confirmPassword: "",
  });
  const [errors, setErrors] = useState<FormErrors>({});
  const { toast } = useToast();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { id, value } = e.target;
    setFormData((prev) => ({ ...prev, [id]: value }));
    if (errors[id as keyof FormErrors]) {
      setErrors(prev => ({ ...prev, [id]: undefined }));
    }
  };

  const validateEmail = (email: string) => {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  };

  const validateForm = (): boolean => {
    const newErrors: FormErrors = {};
    if (!formData.fullName.trim()) newErrors.fullName = "Full name is required.";
    else if (formData.fullName.trim().length < 3) newErrors.fullName = "Full name must be at least 3 characters.";
    
    if (!formData.email.trim()) newErrors.email = "Email is required.";
    else if (!validateEmail(formData.email)) newErrors.email = "Please enter a valid email address.";
    
    if (!formData.password) newErrors.password = "Password is required.";
    else if (formData.password.length < 6) newErrors.password = "Password must be at least 6 characters.";
    
    if (!formData.confirmPassword) newErrors.confirmPassword = "Please confirm your password.";
    else if (formData.password !== formData.confirmPassword) newErrors.confirmPassword = "Passwords do not match.";
    
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
    console.log("Client Signup Data:", formData);
    toast({
        title: "Signup Submitted (Simulated)",
        description: "Your account has been created. You can complete your profile details in your dashboard."
    });
    // Potentially redirect or show success message
    // router.push('/client/dashboard'); // Example redirect
  };

  return (
    <Card className="shadow-xl w-full max-w-md">
      <CardHeader>
        <CardTitle className="font-headline text-2xl">Create Your Client Account</CardTitle>
        <CardDescription>
          Join DesignFlow to connect with expert designers.
        </CardDescription>
      </CardHeader>

      <CardContent className="space-y-4">
        <div className="space-y-1">
          <Label htmlFor="fullName">Full Name</Label>
          <div className="relative">
            <User className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input id="fullName" type="text" placeholder="Your Name" className="pl-10" value={formData.fullName} onChange={handleChange} aria-invalid={!!errors.fullName} aria-describedby="fullName-error"/>
          </div>
          {errors.fullName && <p id="fullName-error" className="text-sm text-destructive pt-1">{errors.fullName}</p>}
        </div>
        <div className="space-y-1">
          <Label htmlFor="email">Email</Label>
          <div className="relative">
            <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input id="email" type="email" placeholder="you@example.com" className="pl-10" value={formData.email} onChange={handleChange} aria-invalid={!!errors.email} aria-describedby="email-error"/>
          </div>
          {errors.email && <p id="email-error" className="text-sm text-destructive pt-1">{errors.email}</p>}
        </div>
        <div className="space-y-1">
          <Label htmlFor="password">Password</Label>
          <div className="relative">
            <KeyRound className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input id="password" type="password" placeholder="•••••••• (min. 6 characters)" className="pl-10" value={formData.password} onChange={handleChange} aria-invalid={!!errors.password} aria-describedby="password-error"/>
          </div>
          {errors.password && <p id="password-error" className="text-sm text-destructive pt-1">{errors.password}</p>}
        </div>
        <div className="space-y-1">
          <Label htmlFor="confirmPassword">Confirm Password</Label>
          <div className="relative">
            <KeyRound className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input id="confirmPassword" type="password" placeholder="••••••••" className="pl-10" value={formData.confirmPassword} onChange={handleChange} aria-invalid={!!errors.confirmPassword} aria-describedby="confirmPassword-error"/>
          </div>
          {errors.confirmPassword && <p id="confirmPassword-error" className="text-sm text-destructive pt-1">{errors.confirmPassword}</p>}
        </div>
        {errors.general && <p className="text-sm text-destructive pt-1">{errors.general}</p>}
      </CardContent>

      <CardFooter className="flex flex-col space-y-4">
        <Button onClick={handleSubmit} className="w-full">
          Sign Up
        </Button>
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
