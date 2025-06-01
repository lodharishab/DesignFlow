
"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import Link from "next/link";
import { Mail, KeyRound, User } from "lucide-react";

export default function DesignerSignupPage() {
  return (
    <Card className="shadow-xl">
      <CardHeader>
        <CardTitle className="font-headline text-2xl">Join as a Designer</CardTitle>
        <CardDescription>Offer your design services and skills on the DesignFlow platform.</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="name">Full Name</Label>
           <div className="relative">
            <User className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input id="name" type="text" placeholder="Your Name" className="pl-10" />
          </div>
        </div>
        <div className="space-y-2">
          <Label htmlFor="email">Email</Label>
          <div className="relative">
            <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input id="email" type="email" placeholder="you@example.com" className="pl-10" />
          </div>
        </div>
        <div className="space-y-2">
          <Label htmlFor="password">Password</Label>
          <div className="relative">
            <KeyRound className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input id="password" type="password" placeholder="••••••••" className="pl-10" />
          </div>
        </div>
        {/* Add fields specific to designers here, e.g., portfolio link, skills */}
      </CardContent>
      <CardFooter className="flex flex-col space-y-4">
        <Button className="w-full">Sign Up as Designer</Button>
        <p className="text-sm text-muted-foreground">
          Already have an account?{" "}
          <Link href="/auth/login" className="font-medium text-primary hover:underline">
            Log In
          </Link>
        </p>
         <p className="text-sm text-muted-foreground">
          Looking to hire?{" "}
          <Link href="/auth/signup" className="font-medium text-primary hover:underline">
            Sign Up as a Client
          </Link>
        </p>
      </CardFooter>
    </Card>
  );
}
