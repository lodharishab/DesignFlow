
"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import Link from "next/link";
import { Mail, KeyRound, User, ChevronLeft, ChevronRight, Building, Briefcase, Factory } from "lucide-react"; // Added Factory for Industry
import { Progress } from "@/components/ui/progress";

const totalSteps = 3;

// Sample industries - in a real app, this might come from a config or API
const industryOptions = [
  "Technology",
  "Healthcare",
  "Finance",
  "Education",
  "Retail",
  "Manufacturing",
  "Real Estate",
  "Hospitality",
  "Non-Profit",
  "Other",
];

export default function ClientSignupPage() {
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    companyName: "",
    projectType: "",
    industry: "", // Added industry field
    password: "",
    confirmPassword: "",
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { id, value } = e.target;
    setFormData((prev) => ({ ...prev, [id]: value }));
  };

  const handleSelectChange = (fieldName: keyof typeof formData, value: string) => {
    setFormData((prev) => ({ ...prev, [fieldName]: value }));
  };

  const nextStep = () => {
    if (currentStep < totalSteps) {
      setCurrentStep(currentStep + 1);
    }
  };

  const prevStep = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleSubmit = () => {
    // Handle final form submission
    console.log("Client Signup Data:", formData);
    // Potentially redirect or show success message
  };

  const progressValue = (currentStep / totalSteps) * 100;

  return (
    <Card className="shadow-xl w-full max-w-md">
      <CardHeader>
        <CardTitle className="font-headline text-2xl">Client Signup - Step {currentStep} of {totalSteps}</CardTitle>
        <CardDescription>
          {currentStep === 1 && "Let's start with your basic information."}
          {currentStep === 2 && "Tell us a bit about your company and project needs."}
          {currentStep === 3 && "Almost there! Set up your account password."}
        </CardDescription>
        <Progress value={progressValue} className="w-full mt-2" />
      </CardHeader>

      <CardContent className="space-y-4">
        {currentStep === 1 && (
          <>
            <div className="space-y-2">
              <Label htmlFor="fullName">Full Name</Label>
              <div className="relative">
                <User className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input id="fullName" type="text" placeholder="Your Name" className="pl-10" value={formData.fullName} onChange={handleChange} />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input id="email" type="email" placeholder="you@example.com" className="pl-10" value={formData.email} onChange={handleChange} />
              </div>
            </div>
          </>
        )}

        {currentStep === 2 && (
          <>
            <div className="space-y-2">
              <Label htmlFor="companyName">Company Name (Optional)</Label>
              <div className="relative">
                <Building className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input id="companyName" type="text" placeholder="Your Company Inc." className="pl-10" value={formData.companyName} onChange={handleChange} />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="industry">What is your industry?</Label>
              <div className="relative">
                 <Factory className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground z-10" />
                <Select value={formData.industry} onValueChange={(value) => handleSelectChange("industry", value)}>
                  <SelectTrigger id="industry" className="pl-10">
                    <SelectValue placeholder="Select your industry" />
                  </SelectTrigger>
                  <SelectContent>
                    {industryOptions.map((industry) => (
                      <SelectItem key={industry} value={industry.toLowerCase().replace(/\s+/g, '-')}>
                        {industry}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="projectType">What type of project are you looking for?</Label>
              <div className="relative">
                 <Briefcase className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground z-10" />
                <Select value={formData.projectType} onValueChange={(value) => handleSelectChange("projectType", value)}>
                  <SelectTrigger id="projectType" className="pl-10">
                    <SelectValue placeholder="Select project type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="logo-design">Logo Design</SelectItem>
                    <SelectItem value="web-ui-ux">Web UI/UX</SelectItem>
                    <SelectItem value="print-materials">Print Materials</SelectItem>
                    <SelectItem value="custom-illustrations">Custom Illustrations</SelectItem>
                    <SelectItem value="social-media-graphics">Social Media Graphics</SelectItem>
                    <SelectItem value="other">Other</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </>
        )}

        {currentStep === 3 && (
          <>
            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <div className="relative">
                <KeyRound className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input id="password" type="password" placeholder="••••••••" className="pl-10" value={formData.password} onChange={handleChange} />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="confirmPassword">Confirm Password</Label>
              <div className="relative">
                <KeyRound className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input id="confirmPassword" type="password" placeholder="••••••••" className="pl-10" value={formData.confirmPassword} onChange={handleChange} />
              </div>
            </div>
          </>
        )}
      </CardContent>

      <CardFooter className="flex flex-col space-y-4">
        <div className="flex w-full justify-between">
          {currentStep > 1 && (
            <Button variant="outline" onClick={prevStep}>
              <ChevronLeft className="mr-2 h-4 w-4" /> Previous
            </Button>
          )}
          {currentStep < totalSteps && (
            <Button onClick={nextStep} className={currentStep === 1 ? "w-full" : "ml-auto"}>
              Next <ChevronRight className="ml-2 h-4 w-4" />
            </Button>
          )}
          {currentStep === totalSteps && (
            <Button onClick={handleSubmit} className="ml-auto">
              Sign Up
            </Button>
          )}
        </div>
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

