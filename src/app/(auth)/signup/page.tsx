"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import Link from "next/link";
import { Mail, KeyRound, User, Briefcase, Palette } from "lucide-react";

export default function SignupPage() {
  return (
    <Card className="shadow-xl">
      <CardHeader>
        <CardTitle className="font-headline text-2xl">Create Your Account</CardTitle>
        <CardDescription>Join DesignFlow as a client or designer.</CardDescription>
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
        <div className="space-y-2">
          <Label>I want to sign up as a:</Label>
          <RadioGroup defaultValue="client" className="flex space-x-4 pt-1">
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="client" id="client" />
              <Label htmlFor="client" className="font-normal flex items-center"><Briefcase className="mr-2 h-4 w-4 text-muted-foreground"/> Client</Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="designer" id="designer" />
              <Label htmlFor="designer" className="font-normal flex items-center"><Palette className="mr-2 h-4 w-4 text-muted-foreground"/> Designer</Label>
            </div>
          </RadioGroup>
        </div>
      </CardContent>
      <CardFooter className="flex flex-col space-y-4">
        <Button className="w-full">Sign Up</Button>
        <p className="text-sm text-muted-foreground">
          Already have an account?{" "}
          <Link href="/auth/login" className="font-medium text-primary hover:underline">
            Log In
          </Link>
        </p>
      </CardFooter>
    </Card>
  );
}
