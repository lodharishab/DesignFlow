
"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import Link from "next/link";
import { Mail, KeyRound } from "lucide-react";
import { useRouter } from "next/navigation";
import { useToast } from "@/hooks/use-toast";

interface LoginFormErrors {
  email?: string;
  password?: string;
  general?: string;
}

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState(''); // State for password
  const [errors, setErrors] = useState<LoginFormErrors>({});
  const { toast } = useToast();

  const validateEmail = (email: string) => {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  };

  const validateForm = (): boolean => {
    const newErrors: LoginFormErrors = {};
    if (!email.trim()) newErrors.email = "Email is required.";
    else if (!validateEmail(email)) newErrors.email = "Please enter a valid email address.";

    if (!password) newErrors.password = "Password is required.";
    // No length check for login, but you could add one if desired
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleLogin = () => {
    if (!validateForm()) {
      toast({
            title: "Validation Error",
            description: "Please correct the errors before logging in.",
            variant: "destructive"
        })
      return;
    }

    const lowerEmail = email.toLowerCase();

    if (lowerEmail.includes('admin')) {
      router.push('/admin/dashboard');
    } else if (lowerEmail.includes('client')) {
      router.push('/client/dashboard');
    } else if (lowerEmail.includes('designer')) {
      router.push('/designer/pending-approval');
    } else {
      router.push('/client/dashboard'); 
    }
  };

  return (
    <Card className="shadow-xl">
      <CardHeader>
        <CardTitle className="font-headline text-2xl">Welcome Back!</CardTitle>
        <CardDescription>Log in to your DesignFlow account.</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-1">
          <Label htmlFor="email">Email</Label>
          <div className="relative">
            <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input 
              id="email" 
              type="email" 
              placeholder="you@example.com (try admin@example.com)" 
              className="pl-10" 
              value={email} 
              onChange={(e) => { setEmail(e.target.value); if (errors.email) setErrors(prev => ({...prev, email: undefined})) }}
              aria-invalid={!!errors.email}
              aria-describedby="email-error"
            />
          </div>
          {errors.email && <p id="email-error" className="text-sm text-destructive pt-1">{errors.email}</p>}
        </div>
        <div className="space-y-1">
          <div className="flex items-center justify-between">
            <Label htmlFor="password">Password</Label>
            <Link href="#" className="text-sm text-primary hover:underline">
              Forgot password?
            </Link>
          </div>
          <div className="relative">
            <KeyRound className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input 
              id="password" 
              type="password" 
              placeholder="••••••••" 
              className="pl-10" 
              value={password}
              onChange={(e) => { setPassword(e.target.value); if (errors.password) setErrors(prev => ({...prev, password: undefined})) }}
              aria-invalid={!!errors.password}
              aria-describedby="password-error"
            />
          </div>
          {errors.password && <p id="password-error" className="text-sm text-destructive pt-1">{errors.password}</p>}
        </div>
        {errors.general && <p className="text-sm text-destructive pt-1">{errors.general}</p>}
      </CardContent>
      <CardFooter className="flex flex-col space-y-4">
        <Button className="w-full" onClick={handleLogin}>Log In</Button>
        <p className="text-sm text-muted-foreground">
          Don&apos;t have an account?{" "}
          <Link href="/signup" className="font-medium text-primary hover:underline">
            Sign Up
          </Link>
        </p>
      </CardFooter>
    </Card>
  );
}

    