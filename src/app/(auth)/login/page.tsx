
"use client";

import { useState } from "react"; // Import useState
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import Link from "next/link";
import { Mail, KeyRound } from "lucide-react";
import { useRouter } from "next/navigation";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState(''); // State for email input

  const handleLogin = () => {
    // Simulate role-based redirection for prototype purposes
    // This is a simplified approach and not secure for a real application.
    const lowerEmail = email.toLowerCase();

    if (lowerEmail.includes('admin')) {
      router.push('/admin/dashboard');
    } else if (lowerEmail.includes('client')) {
      router.push('/client/dashboard');
    } else if (lowerEmail.includes('designer')) {
      // All "designer" logins go to pending approval for now
      router.push('/designer/pending-approval');
    } else {
      // Default or show an error/redirect to a generic page
      // For now, let's redirect to client dashboard as a fallback
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
        <div className="space-y-2">
          <Label htmlFor="email">Email</Label>
          <div className="relative">
            <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input 
              id="email" 
              type="email" 
              placeholder="you@example.com (try admin@example.com)" 
              className="pl-10" 
              value={email} 
              onChange={(e) => setEmail(e.target.value)} // Update email state
            />
          </div>
        </div>
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <Label htmlFor="password">Password</Label>
            <Link href="#" className="text-sm text-primary hover:underline">
              Forgot password?
            </Link>
          </div>
          <div className="relative">
            <KeyRound className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input id="password" type="password" placeholder="••••••••" className="pl-10" />
          </div>
        </div>
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
