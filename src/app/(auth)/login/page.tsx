
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
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

interface LoginFormErrors {
  phoneNumber?: string;
  otp?: string;
  password?: string;
  general?: string;
}

export default function LoginPage() {
  const router = useRouter();
  const [phoneNumber, setPhoneNumber] = useState('');
  const [otp, setOtp] = useState('');
  const [password, setPassword] = useState('');
  const [step, setStep] = useState<'enter-phone' | 'enter-otp'>('enter-phone');
  const [errors, setErrors] = useState<LoginFormErrors>({});
  const { toast } = useToast();

  const validatePhoneNumber = (phone: string) => {
    return /^[6-9]\d{9}$/.test(phone);
  };
  
  const validateOtp = (otpValue: string) => {
    return /^\d{6}$/.test(otpValue);
  }

  const handleLoginSuccess = () => {
     toast({
        title: "Login Successful!",
        description: "You have been successfully logged in."
    });

    if (phoneNumber.includes('111')) {
      router.push('/admin/dashboard');
    } else if (phoneNumber.includes('222')) {
      router.push('/designer/pending-approval');
    } else {
      router.push('/client/dashboard'); 
    }
  }

  // --- OTP Flow Handlers ---
  const handleContinueWithOtp = () => {
    const newErrors: LoginFormErrors = {};
    if (!phoneNumber.trim() || !validatePhoneNumber(phoneNumber)) {
      newErrors.phoneNumber = "Please enter a valid 10-digit Indian mobile number.";
    }
    
    setErrors(newErrors);

    if (Object.keys(newErrors).length === 0) {
      toast({
        title: "OTP Sent (Simulated)",
        description: "An OTP has been sent to your mobile number. (Hint: Use any 6 digits)",
      });
      setStep('enter-otp');
    } else {
        toast({ title: "Validation Error", description: newErrors.phoneNumber, variant: "destructive" });
    }
  };

  const handleVerifyOtp = () => {
    const newErrors: LoginFormErrors = {};
    if(!otp || !validateOtp(otp)) {
      newErrors.otp = "Please enter a valid 6-digit OTP.";
    }

    setErrors(newErrors);
    
    if (Object.keys(newErrors).length > 0) {
      toast({ title: "Validation Error", description: newErrors.otp, variant: "destructive" });
      return;
    }
    
    handleLoginSuccess();
  };
  
  const resetToPhoneStep = () => {
    setStep('enter-phone');
    setOtp('');
    setErrors({});
  }

  // --- Password Flow Handler ---
  const handleLoginWithPassword = () => {
    const newErrors: LoginFormErrors = {};
    if (!phoneNumber.trim() || !validatePhoneNumber(phoneNumber)) {
      newErrors.phoneNumber = "Please enter a valid 10-digit Indian mobile number.";
    }
    if (!password) {
      newErrors.password = "Password is required.";
    }
    setErrors(newErrors);

    if (Object.keys(newErrors).length > 0) {
        const errorDesc = Object.values(newErrors).join(' ');
        toast({ title: "Validation Error", description: errorDesc, variant: "destructive" });
        return;
    }

    // Simulate login check
    console.log("Simulating login with password for:", phoneNumber);
    handleLoginSuccess();
  };

  return (
    <Card className="shadow-xl">
      <CardHeader>
        <CardTitle className="font-headline text-2xl">
          Welcome Back!
        </CardTitle>
        <CardDescription>
          Choose your preferred method to log in to your account.
        </CardDescription>
      </CardHeader>
      <Tabs defaultValue="otp" className="w-full">
        <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="otp">Login with OTP</TabsTrigger>
            <TabsTrigger value="password">Login with Password</TabsTrigger>
        </TabsList>
        <TabsContent value="otp">
            <CardContent className="space-y-4 pt-6">
                {step === 'enter-phone' ? (
                <div className="space-y-1">
                    <Label htmlFor="phoneNumberOtp">Phone Number</Label>
                    <div className="relative">
                    <Phone className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input 
                        id="phoneNumberOtp" 
                        type="tel" 
                        placeholder="e.g., 9876543210" 
                        className="pl-10" 
                        value={phoneNumber} 
                        onChange={(e) => { setPhoneNumber(e.target.value); if (errors.phoneNumber) setErrors(prev => ({...prev, phoneNumber: undefined})) }}
                        aria-invalid={!!errors.phoneNumber}
                        maxLength={10}
                    />
                    </div>
                    {errors.phoneNumber && <p className="text-sm text-destructive pt-1">{errors.phoneNumber}</p>}
                </div>
                ) : (
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
                        onChange={(e) => { setOtp(e.target.value); if (errors.otp) setErrors(prev => ({...prev, otp: undefined})) }}
                        aria-invalid={!!errors.otp}
                        maxLength={6}
                    />
                    </div>
                    {errors.otp && <p className="text-sm text-destructive pt-1">{errors.otp}</p>}
                    <div className="text-right pt-1">
                        <Button variant="link" size="sm" className="h-auto p-0 text-xs" onClick={resetToPhoneStep}>
                            Change Number
                        </Button>
                    </div>
                </div>
                )}
            </CardContent>
            <CardFooter>
                 {step === 'enter-phone' ? (
                    <Button className="w-full" onClick={handleContinueWithOtp}>Continue</Button>
                    ) : (
                    <Button className="w-full" onClick={handleVerifyOtp}>Verify OTP</Button>
                )}
            </CardFooter>
        </TabsContent>
        <TabsContent value="password">
             <CardContent className="space-y-4 pt-6">
                 <div className="space-y-1">
                    <Label htmlFor="phoneNumberPassword">Phone Number</Label>
                    <div className="relative">
                    <Phone className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input 
                        id="phoneNumberPassword" 
                        type="tel" 
                        placeholder="e.g., 9876543210 (try ending in 111)" 
                        className="pl-10" 
                        value={phoneNumber} 
                        onChange={(e) => { setPhoneNumber(e.target.value); if (errors.phoneNumber) setErrors(prev => ({...prev, phoneNumber: undefined})) }}
                        aria-invalid={!!errors.phoneNumber}
                        maxLength={10}
                    />
                    </div>
                    {errors.phoneNumber && <p className="text-sm text-destructive pt-1">{errors.phoneNumber}</p>}
                </div>
                 <div className="space-y-1">
                    <Label htmlFor="password">Password</Label>
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
                    />
                    </div>
                    {errors.password && <p className="text-sm text-destructive pt-1">{errors.password}</p>}
                </div>
             </CardContent>
              <CardFooter>
                <Button className="w-full" onClick={handleLoginWithPassword}>Log In</Button>
              </CardFooter>
        </TabsContent>
      </Tabs>
       <CardFooter className="flex flex-col space-y-4 pt-0">
         <p className="text-xs text-muted-foreground text-center">
          By continuing, you agree to our <Link href="/terms-of-service" className="underline hover:text-primary">Terms of Service</Link> and <Link href="/privacy-policy" className="underline hover:text-primary">Privacy Policy</Link>.
        </p>
      </CardFooter>
    </Card>
  );
}
