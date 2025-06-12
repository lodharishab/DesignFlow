
"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import Link from "next/link";
import { Mail, KeyRound, User, ChevronLeft, ChevronRight, Building, Briefcase, Factory } from "lucide-react";
import { Progress } from "@/components/ui/progress";
import { useToast } from "@/hooks/use-toast";

const totalSteps = 3;

const industryOptions = [
  "Technology", "Healthcare", "Finance", "Education", "Retail",
  "Manufacturing", "Real Estate", "Hospitality", "Non-Profit", "Other",
];

interface FormData {
  fullName: string;
  email: string;
  companyName: string;
  projectType: string;
  industry: string;
  password: string;
  confirmPassword: string;
}

interface FormErrors {
  fullName?: string;
  email?: string;
  companyName?: string;
  projectType?: string;
  industry?: string;
  password?: string;
  confirmPassword?: string;
  general?: string;
}

export default function ClientSignupPage() {
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState<FormData>({
    fullName: "",
    email: "",
    companyName: "",
    projectType: "",
    industry: "",
    password: "",
    confirmPassword: "",
  });
  const [errors, setErrors] = useState<FormErrors>({});
  const { toast } = useToast();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { id, value } = e.target;
    setFormData((prev) => ({ ...prev, [id]: value }));
    if (errors[id as keyof FormErrors]) {
      setErrors(prev => ({ ...prev, [id]: undefined }));
    }
  };

  const handleSelectChange = (fieldName: keyof FormData, value: string) => {
    setFormData((prev) => ({ ...prev, [fieldName]: value }));
     if (errors[fieldName as keyof FormErrors]) {
      setErrors(prev => ({ ...prev, [fieldName]: undefined }));
    }
  };

  const validateEmail = (email: string) => {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  };

  const validateStep1 = (): boolean => {
    const newErrors: FormErrors = {};
    if (!formData.fullName.trim()) newErrors.fullName = "Full name is required.";
    else if (formData.fullName.trim().length < 3) newErrors.fullName = "Full name must be at least 3 characters.";
    
    if (!formData.email.trim()) newErrors.email = "Email is required.";
    else if (!validateEmail(formData.email)) newErrors.email = "Please enter a valid email address.";
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const validateStep2 = (): boolean => {
    const newErrors: FormErrors = {};
    // No specific validation for companyName (optional)
    if (!formData.industry) newErrors.industry = "Please select your industry.";
    if (!formData.projectType) newErrors.projectType = "Please select a project type.";
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const validateStep3 = (): boolean => {
    const newErrors: FormErrors = {};
    if (!formData.password) newErrors.password = "Password is required.";
    else if (formData.password.length < 6) newErrors.password = "Password must be at least 6 characters.";
    
    if (!formData.confirmPassword) newErrors.confirmPassword = "Please confirm your password.";
    else if (formData.password !== formData.confirmPassword) newErrors.confirmPassword = "Passwords do not match.";
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const nextStep = () => {
    let isValid = false;
    if (currentStep === 1) isValid = validateStep1();
    else if (currentStep === 2) isValid = validateStep2();
    // Step 3 validation happens on submit

    if (isValid && currentStep < totalSteps) {
      setCurrentStep(currentStep + 1);
      setErrors({}); // Clear errors when moving to next valid step
    } else if (!isValid) {
        toast({
            title: "Validation Error",
            description: "Please correct the errors before proceeding.",
            variant: "destructive"
        })
    }
  };

  const prevStep = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
      setErrors({}); // Clear errors when moving back
    }
  };

  const handleSubmit = () => {
    if (!validateStep3()) {
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
        description: "Your signup information has been received."
    });
    // Potentially redirect or show success message
    // router.push('/some-success-page');
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
          </>
        )}

        {currentStep === 2 && (
          <>
            <div className="space-y-1">
              <Label htmlFor="companyName">Company Name (Optional)</Label>
              <div className="relative">
                <Building className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input id="companyName" type="text" placeholder="Your Company Inc." className="pl-10" value={formData.companyName} onChange={handleChange} />
              </div>
            </div>
            <div className="space-y-1">
              <Label htmlFor="industry">What is your industry?</Label>
              <div className="relative">
                 <Factory className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground z-10" />
                <Select value={formData.industry} onValueChange={(value) => handleSelectChange("industry", value)}>
                  <SelectTrigger id="industry" className="pl-10" aria-invalid={!!errors.industry} aria-describedby="industry-error">
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
              {errors.industry && <p id="industry-error" className="text-sm text-destructive pt-1">{errors.industry}</p>}
            </div>
            <div className="space-y-1">
              <Label htmlFor="projectType">What type of project are you looking for?</Label>
              <div className="relative">
                 <Briefcase className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground z-10" />
                <Select value={formData.projectType} onValueChange={(value) => handleSelectChange("projectType", value)}>
                  <SelectTrigger id="projectType" className="pl-10" aria-invalid={!!errors.projectType} aria-describedby="projectType-error">
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
              {errors.projectType && <p id="projectType-error" className="text-sm text-destructive pt-1">{errors.projectType}</p>}
            </div>
          </>
        )}

        {currentStep === 3 && (
          <>
            <div className="space-y-1">
              <Label htmlFor="password">Password</Label>
              <div className="relative">
                <KeyRound className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input id="password" type="password" placeholder="••••••••" className="pl-10" value={formData.password} onChange={handleChange} aria-invalid={!!errors.password} aria-describedby="password-error"/>
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
          </>
        )}
        {errors.general && <p className="text-sm text-destructive pt-1">{errors.general}</p>}
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

    