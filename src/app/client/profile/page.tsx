
"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { UserCircle, Mail, Phone, Lock, Save, Edit3, CreditCard, Bell, Building, Image as ImageIcon } from 'lucide-react';
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";

// Mock client data
const mockClientData = {
  name: "Priya Sharma",
  email: "priya.sharma@example.in",
  avatarUrl: "https://placehold.co/100x100.png",
  avatarHint: "indian woman client",
  companyName: "BharatRetail Solutions",
  mobile: "9876543210",
};

export default function ClientProfilePage() {
  const { toast } = useToast();
  const [name, setName] = useState(mockClientData.name);
  const [email, setEmail] = useState(mockClientData.email); 
  const [companyName, setCompanyName] = useState(mockClientData.companyName);
  const [mobile, setMobile] = useState(mockClientData.mobile);
  const [isSaving, setIsSaving] = useState(false);

  const handleProfileUpdate = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    // Simulate API call
    console.log("Updating profile:", { name, companyName, mobile });
    setTimeout(() => {
      toast({
        title: "Profile Updated (Simulated)",
        description: "Your profile information has been saved.",
      });
      setIsSaving(false);
    }, 1000);
  };

  return (
    <div className="space-y-8">
      <h1 className="text-3xl font-bold font-headline flex items-center">
        <UserCircle className="mr-3 h-8 w-8 text-primary" />
        My Profile & Settings
      </h1>

      <form onSubmit={handleProfileUpdate}>
        <Card className="shadow-lg">
          <CardHeader>
            <div className="flex items-center space-x-4">
                <Avatar className="h-20 w-20">
                    <AvatarImage src={mockClientData.avatarUrl} alt={mockClientData.name} data-ai-hint={mockClientData.avatarHint} />
                    <AvatarFallback>{mockClientData.name.substring(0,1)}</AvatarFallback>
                </Avatar>
                <div>
                    <CardTitle>Edit Profile</CardTitle>
                    <CardDescription>Manage your personal and company information.</CardDescription>
                </div>
            </div>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label htmlFor="name" className="flex items-center"><UserCircle className="mr-2 h-4 w-4 text-muted-foreground"/>Full Name</Label>
                <Input id="name" value={name} onChange={(e) => setName(e.target.value)} disabled={isSaving} />
              </div>
              <div className="space-y-2">
                <Label htmlFor="email" className="flex items-center"><Mail className="mr-2 h-4 w-4 text-muted-foreground"/>Email Address</Label>
                <Input id="email" type="email" value={email} disabled />
                <p className="text-xs text-muted-foreground">Email is not editable. Contact support to change.</p>
              </div>
            </div>
            <div className="grid md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label htmlFor="companyName" className="flex items-center"><Building className="mr-2 h-4 w-4 text-muted-foreground"/>Company Name (Optional)</Label>
                <Input id="companyName" value={companyName} onChange={(e) => setCompanyName(e.target.value)} disabled={isSaving}/>
              </div>
              <div className="space-y-2">
                <Label htmlFor="mobile" className="flex items-center"><Phone className="mr-2 h-4 w-4 text-muted-foreground"/>Mobile Number</Label>
                <Input id="mobile" value={mobile} onChange={(e) => setMobile(e.target.value)} disabled/>
                 <p className="text-xs text-muted-foreground">Phone number is your primary login and cannot be changed here.</p>
              </div>
            </div>
             <div className="space-y-2">
                <Label htmlFor="avatar" className="flex items-center"><ImageIcon className="mr-2 h-4 w-4 text-muted-foreground"/>Avatar</Label>
                <Input id="avatar" type="file" disabled className="cursor-not-allowed" />
                 <p className="text-xs text-muted-foreground">Avatar upload coming soon.</p>
              </div>

            <Separator />
            <div className="space-y-2">
                <Label htmlFor="currentPassword" className="flex items-center"><Lock className="mr-2 h-4 w-4 text-muted-foreground"/>Change Password</Label>
                <Input id="currentPassword" type="password" placeholder="Current Password" disabled className="cursor-not-allowed"/>
                <Input id="newPassword" type="password" placeholder="New Password" disabled className="cursor-not-allowed mt-2"/>
                <Input id="confirmNewPassword" type="password" placeholder="Confirm New Password" disabled className="cursor-not-allowed mt-2"/>
                <p className="text-xs text-muted-foreground">Password change functionality coming soon.</p>
            </div>
             <div className="flex justify-end">
                 <Button type="submit" disabled={isSaving}>
                    {isSaving ? 'Saving...' : <><Save className="mr-2 h-4 w-4"/> Save Profile Changes</>}
                </Button>
             </div>
          </CardContent>
        </Card>
      </form>

      <Card className="shadow-lg">
        <CardHeader>
          <CardTitle className="flex items-center"><CreditCard className="mr-2 h-5 w-5 text-muted-foreground"/>Payment Methods</CardTitle>
          <CardDescription>Manage your saved payment methods. (Feature coming soon)</CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground italic">No payment methods saved yet.</p>
          <Button variant="outline" className="mt-4" disabled>Add Payment Method</Button>
        </CardContent>
      </Card>

      <Card className="shadow-lg">
        <CardHeader>
          <CardTitle className="flex items-center"><Bell className="mr-2 h-5 w-5 text-muted-foreground"/>Notification Settings</CardTitle>
          <CardDescription>Manage your email notification preferences. (Feature coming soon)</CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground italic">Notification settings will appear here.</p>
        </CardContent>
      </Card>
    </div>
  );
}
