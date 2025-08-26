
"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Separator } from "@/components/ui/separator";
import { Settings, UserCog, CreditCard, Bell, Layers, IndianRupee, History, Search as SearchIcon } from "lucide-react";
import React, { useState, useMemo } from 'react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { format, formatDistanceToNow } from "date-fns";
import Link from 'next/link';
import { Badge } from "@/components/ui/badge";

// In a real app, these values would be fetched and saved to a backend.
interface SiteSettings {
  platformName: string;
  contactEmail: string;
  defaultCurrency: string;
  allowClientRegistrations: boolean;
  allowDesignerRegistrations: boolean;
  termsUrl: string;
  privacyUrl: string;
  enableMemberships: boolean;
  clientBasicPlanName: string;
  clientBasicPlanPrice: string;
  clientPremiumPlanName: string;
  clientPremiumPlanPrice: string;
  designerBasicPlanName: string;
  designerBasicPlanPrice: string;
  designerProPlanName: string;
  designerProPlanPrice: string;
  enableFreeTrial: boolean;
  trialDurationDays: number;
  adminNotificationEmail: string;
  stripeApiKey: string; // Placeholder
  paypalClientId: string; // Placeholder
}

interface AuditLog {
  id: string;
  action: 'User Update' | 'Service Edit' | 'Order Status Change' | 'Settings Change' | 'Designer Approved';
  actor: {
    id: string;
    name: string;
  };
  target: {
    type: 'User' | 'Service' | 'Order' | 'Platform';
    id: string;
    name?: string;
  };
  timestamp: Date;
  notes?: string;
}

const mockAuditLogs: AuditLog[] = [
    { id: 'log_001', action: 'Order Status Change', actor: { id: 'admin001', name: 'Admin User' }, target: { type: 'Order', id: 'ORD7361P', name: 'E-commerce Website UI/UX' }, timestamp: new Date(new Date().setDate(new Date().getDate() - 1)), notes: 'Status changed from Pending to In Progress' },
    { id: 'log_002', action: 'Designer Approved', actor: { id: 'admin002', name: 'Super Admin' }, target: { type: 'User', id: 'des007', name: 'Neha Joshi' }, timestamp: new Date(new Date().setDate(new Date().getDate() - 2)), notes: 'Approved for Print Design category.' },
    { id: 'log_003', action: 'Service Edit', actor: { id: 'admin001', name: 'Admin User' }, target: { type: 'Service', id: '1', name: 'Modern Logo Design' }, timestamp: new Date(new Date().setDate(new Date().getDate() - 3)), notes: 'Updated price for Premium tier.' },
    { id: 'log_004', action: 'Settings Change', actor: { id: 'admin002', name: 'Super Admin' }, target: { type: 'Platform', id: 'registration_settings', name: 'User Registrations' }, timestamp: new Date(new Date().setDate(new Date().getDate() - 4)), notes: 'Disabled new designer registrations.' },
    { id: 'log_005', action: 'User Update', actor: { id: 'admin001', name: 'Admin User' }, target: { type: 'User', id: 'usr003', name: 'Charlie Brown' }, timestamp: new Date(new Date().setDate(new Date().getDate() - 5)), notes: 'Suspended user account.' },
];

const uniqueActors = Array.from(new Set(mockAuditLogs.map(log => log.actor.name))).sort();
const uniqueActions = Array.from(new Set(mockAuditLogs.map(log => log.action))).sort();

function AuditLogsSection() {
    const [searchTerm, setSearchTerm] = useState('');
    const [actionFilter, setActionFilter] = useState('All');
    const [actorFilter, setActorFilter] = useState('All');

    const filteredLogs = useMemo(() => {
        return mockAuditLogs.filter(log => {
            const searchTermLower = searchTerm.toLowerCase();
            const searchMatch = !searchTerm ||
                log.target.id.toLowerCase().includes(searchTermLower) ||
                log.target.name?.toLowerCase().includes(searchTermLower) ||
                log.notes?.toLowerCase().includes(searchTermLower);

            const actionMatch = actionFilter === 'All' || log.action === actionFilter;
            const actorMatch = actorFilter === 'All' || log.actor.name === actorFilter;

            return searchMatch && actionMatch && actorMatch;
        });
    }, [searchTerm, actionFilter, actorFilter]);

    return (
        <Card className="shadow-lg">
            <CardHeader>
                <CardTitle className="flex items-center"><History className="mr-2 h-5 w-5 text-muted-foreground" />Audit Logs</CardTitle>
                <CardDescription>Review recent administrative actions taken across the platform.</CardDescription>
                <div className="pt-4 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                    <div className="space-y-1">
                        <Label htmlFor="logSearch" className="text-xs">Search Target/Notes</Label>
                         <div className="relative">
                            <SearchIcon className="absolute left-2.5 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                            <Input id="logSearch" placeholder="e.g., ORD7361P or user" className="pl-9" value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} />
                        </div>
                    </div>
                     <div className="space-y-1">
                        <Label htmlFor="actionFilter" className="text-xs">Filter by Action</Label>
                        <Select value={actionFilter} onValueChange={setActionFilter}>
                            <SelectTrigger id="actionFilter"><SelectValue /></SelectTrigger>
                            <SelectContent>
                                <SelectItem value="All">All Actions</SelectItem>
                                {uniqueActions.map(action => <SelectItem key={action} value={action}>{action}</SelectItem>)}
                            </SelectContent>
                        </Select>
                    </div>
                     <div className="space-y-1">
                        <Label htmlFor="actorFilter" className="text-xs">Filter by Admin</Label>
                        <Select value={actorFilter} onValueChange={setActorFilter}>
                            <SelectTrigger id="actorFilter"><SelectValue /></SelectTrigger>
                            <SelectContent>
                                <SelectItem value="All">All Admins</SelectItem>
                                 {uniqueActors.map(actor => <SelectItem key={actor} value={actor}>{actor}</SelectItem>)}
                            </SelectContent>
                        </Select>
                    </div>
                </div>
            </CardHeader>
            <CardContent>
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead>Action</TableHead>
                            <TableHead>Target</TableHead>
                            <TableHead>Actor</TableHead>
                            <TableHead>Timestamp</TableHead>
                            <TableHead>Notes</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {filteredLogs.map(log => (
                            <TableRow key={log.id}>
                                <TableCell><Badge variant="secondary">{log.action}</Badge></TableCell>
                                <TableCell>
                                    <span className="font-medium">{log.target.name || log.target.id}</span>
                                    <span className="block text-xs text-muted-foreground">{log.target.type}: {log.target.id}</span>
                                </TableCell>
                                <TableCell>{log.actor.name}</TableCell>
                                <TableCell className="text-xs text-muted-foreground" title={format(log.timestamp, 'PPpp')}>
                                    {formatDistanceToNow(log.timestamp, { addSuffix: true })}
                                </TableCell>
                                <TableCell className="text-sm text-muted-foreground">{log.notes || 'N/A'}</TableCell>
                            </TableRow>
                        ))}
                        {filteredLogs.length === 0 && (
                             <TableRow><TableCell colSpan={5} className="text-center h-24">No logs match your filters.</TableCell></TableRow>
                        )}
                    </TableBody>
                </Table>
            </CardContent>
        </Card>
    );
}

export default function AdminSettingsPage() {
  const [settings, setSettings] = useState<SiteSettings>({
    platformName: "DesignFlow",
    contactEmail: "admin@designflow.com",
    defaultCurrency: "INR", // Changed to INR
    allowClientRegistrations: true,
    allowDesignerRegistrations: true,
    termsUrl: "/terms-of-service",
    privacyUrl: "/privacy-policy",
    enableMemberships: true,
    clientBasicPlanName: "Client Basic",
    clientBasicPlanPrice: "799", // Example INR price
    clientPremiumPlanName: "Client Premium",
    clientPremiumPlanPrice: "2499", // Example INR price
    designerBasicPlanName: "Designer Starter",
    designerBasicPlanPrice: "1599", // Example INR price
    designerProPlanName: "Designer Pro",
    designerProPlanPrice: "3999", // Example INR price
    enableFreeTrial: true,
    trialDurationDays: 14,
    adminNotificationEmail: "notifications@designflow.com",
    stripeApiKey: "",
    paypalClientId: "",
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { id, value } = e.target;
    setSettings(prev => ({ ...prev, [id]: value }));
  };

  const handleSwitchChange = (id: keyof SiteSettings, checked: boolean) => {
    setSettings(prev => ({ ...prev, [id]: checked }));
  };

  const handleSaveSettings = () => {
    // In a real app, this would make an API call to save settings.
    console.log("Settings saved (simulated):", settings);
    // You might want to show a toast notification here.
  };

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold font-headline flex items-center">
          <Settings className="mr-3 h-8 w-8 text-primary" />
          Platform Settings
        </h1>
        <Button onClick={handleSaveSettings}>Save All Settings</Button>
      </div>

      {/* General Site Settings */}
      <Card className="shadow-lg">
        <CardHeader>
          <CardTitle className="flex items-center"><Settings className="mr-2 h-5 w-5 text-muted-foreground" />General Site Settings</CardTitle>
          <CardDescription>Basic configuration for your platform.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <Label htmlFor="platformName">Platform Name</Label>
              <Input id="platformName" value={settings.platformName} onChange={handleInputChange} placeholder="Your Platform Name" />
            </div>
            <div>
              <Label htmlFor="contactEmail">Contact Email</Label>
              <Input id="contactEmail" type="email" value={settings.contactEmail} onChange={handleInputChange} placeholder="contact@example.com" />
            </div>
          </div>
          <div>
            <Label htmlFor="defaultCurrency" className="flex items-center">
              <IndianRupee className="mr-2 h-4 w-4 text-muted-foreground" /> Default Currency
            </Label>
            <Input id="defaultCurrency" value={settings.defaultCurrency} onChange={handleInputChange} placeholder="INR, USD, etc." />
             <p className="text-xs text-muted-foreground mt-1">e.g., INR, USD, EUR. This affects membership pricing display.</p>
          </div>
        </CardContent>
      </Card>

      {/* User & Registration Settings */}
      <Card className="shadow-lg">
        <CardHeader>
          <CardTitle className="flex items-center"><UserCog className="mr-2 h-5 w-5 text-muted-foreground" />User & Registration</CardTitle>
          <CardDescription>Control user sign-ups and legal document links.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="flex items-center justify-between space-x-2 p-4 border rounded-md">
            <Label htmlFor="allowClientRegistrations" className="flex flex-col space-y-1">
              <span>Allow New Client Registrations</span>
              <span className="font-normal leading-snug text-muted-foreground">
                Enable or disable new clients from signing up.
              </span>
            </Label>
            <Switch
              id="allowClientRegistrations"
              checked={settings.allowClientRegistrations}
              onCheckedChange={(checked) => handleSwitchChange('allowClientRegistrations', checked)}
            />
          </div>
          <div className="flex items-center justify-between space-x-2 p-4 border rounded-md">
            <Label htmlFor="allowDesignerRegistrations" className="flex flex-col space-y-1">
              <span>Allow New Designer Registrations</span>
               <span className="font-normal leading-snug text-muted-foreground">
                Enable or disable new designers from signing up. (All new designers are pending approval)
              </span>
            </Label>
            <Switch
              id="allowDesignerRegistrations"
              checked={settings.allowDesignerRegistrations}
              onCheckedChange={(checked) => handleSwitchChange('allowDesignerRegistrations', checked)}
            />
          </div>
          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <Label htmlFor="termsUrl">Terms of Service URL</Label>
              <Input id="termsUrl" value={settings.termsUrl} onChange={handleInputChange} placeholder="/terms-of-service" />
            </div>
            <div>
              <Label htmlFor="privacyUrl">Privacy Policy URL</Label>
              <Input id="privacyUrl" value={settings.privacyUrl} onChange={handleInputChange} placeholder="/privacy-policy" />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Membership Settings */}
      <Card className="shadow-lg">
        <CardHeader>
          <CardTitle className="flex items-center"><Layers className="mr-2 h-5 w-5 text-muted-foreground" />Membership Settings</CardTitle>
          <CardDescription>Manage membership plans and trial options.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="flex items-center justify-between space-x-2 p-4 border rounded-md">
            <Label htmlFor="enableMemberships" className="flex flex-col space-y-1">
              <span>Enable Memberships</span>
               <span className="font-normal leading-snug text-muted-foreground">
                Toggle the entire membership system on or off.
              </span>
            </Label>
            <Switch
              id="enableMemberships"
              checked={settings.enableMemberships}
              onCheckedChange={(checked) => handleSwitchChange('enableMemberships', checked)}
            />
          </div>
          
          <Separator />
          <h3 className="text-lg font-medium">Client Membership Plans (Examples)</h3>
          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <Label htmlFor="clientBasicPlanName">Basic Plan Name</Label>
              <Input id="clientBasicPlanName" value={settings.clientBasicPlanName} onChange={handleInputChange} />
            </div>
            <div>
              <Label htmlFor="clientBasicPlanPrice">Basic Plan Price ({settings.defaultCurrency})</Label>
              <Input id="clientBasicPlanPrice" type="number" value={settings.clientBasicPlanPrice} onChange={handleInputChange} />
            </div>
          </div>
           <div className="grid md:grid-cols-2 gap-6">
            <div>
              <Label htmlFor="clientPremiumPlanName">Premium Plan Name</Label>
              <Input id="clientPremiumPlanName" value={settings.clientPremiumPlanName} onChange={handleInputChange} />
            </div>
            <div>
              <Label htmlFor="clientPremiumPlanPrice">Premium Plan Price ({settings.defaultCurrency})</Label>
              <Input id="clientPremiumPlanPrice" type="number" value={settings.clientPremiumPlanPrice} onChange={handleInputChange} />
            </div>
          </div>
          <Button variant="outline" className="w-full md:w-auto" disabled>Manage All Client Plans (Coming Soon)</Button>

          <Separator />
          <h3 className="text-lg font-medium">Designer Membership Plans (Examples)</h3>
           <div className="grid md:grid-cols-2 gap-6">
            <div>
              <Label htmlFor="designerBasicPlanName">Basic Plan Name</Label>
              <Input id="designerBasicPlanName" value={settings.designerBasicPlanName} onChange={handleInputChange} />
            </div>
            <div>
              <Label htmlFor="designerBasicPlanPrice">Basic Plan Price ({settings.defaultCurrency})</Label>
              <Input id="designerBasicPlanPrice" type="number" value={settings.designerBasicPlanPrice} onChange={handleInputChange} />
            </div>
          </div>
           <div className="grid md:grid-cols-2 gap-6">
            <div>
              <Label htmlFor="designerProPlanName">Pro Plan Name</Label>
              <Input id="designerProPlanName" value={settings.designerProPlanName} onChange={handleInputChange} />
            </div>
            <div>
              <Label htmlFor="designerProPlanPrice">Pro Plan Price ({settings.defaultCurrency})</Label>
              <Input id="designerProPlanPrice" type="number" value={settings.designerProPlanPrice} onChange={handleInputChange} />
            </div>
          </div>
          <Button variant="outline" className="w-full md:w-auto" disabled>Manage All Designer Plans (Coming Soon)</Button>

          <Separator />
          <h3 className="text-lg font-medium">Free Trial</h3>
          <div className="flex items-center justify-between space-x-2 p-4 border rounded-md">
            <Label htmlFor="enableFreeTrial" className="flex flex-col space-y-1">
              <span>Enable Free Trial</span>
               <span className="font-normal leading-snug text-muted-foreground">
                Offer a trial period for new members.
              </span>
            </Label>
            <Switch
              id="enableFreeTrial"
              checked={settings.enableFreeTrial}
              onCheckedChange={(checked) => handleSwitchChange('enableFreeTrial', checked)}
            />
          </div>
           {settings.enableFreeTrial && (
            <div>
              <Label htmlFor="trialDurationDays">Trial Duration (Days)</Label>
              <Input id="trialDurationDays" type="number" value={settings.trialDurationDays.toString()} onChange={handleInputChange} />
            </div>
           )}
        </CardContent>
      </Card>
      
      {/* Payment Gateway Settings (Placeholder) */}
      <Card className="shadow-lg">
        <CardHeader>
          <CardTitle className="flex items-center"><CreditCard className="mr-2 h-5 w-5 text-muted-foreground" />Payment Gateway Settings</CardTitle>
          <CardDescription>Configure your payment processor integrations. (UI Placeholders)</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div>
            <Label htmlFor="stripeApiKey">Stripe API Key (Secret)</Label>
            <Input id="stripeApiKey" type="password" value={settings.stripeApiKey} onChange={handleInputChange} placeholder="sk_test_••••••••••••••••••••••••" />
             <p className="text-xs text-muted-foreground mt-1">Enter your Stripe secret key. This is a placeholder and not saved.</p>
          </div>
           <div>
            <Label htmlFor="paypalClientId">PayPal Client ID</Label>
            <Input id="paypalClientId" value={settings.paypalClientId} onChange={handleInputChange} placeholder="PayPal Client ID" />
            <p className="text-xs text-muted-foreground mt-1">Enter your PayPal Client ID. This is a placeholder and not saved.</p>
          </div>
           <Button variant="outline" disabled>Connect Payment Gateways (Coming Soon)</Button>
        </CardContent>
      </Card>

      {/* Notification Settings */}
      <Card className="shadow-lg">
        <CardHeader>
          <CardTitle className="flex items-center"><Bell className="mr-2 h-5 w-5 text-muted-foreground" />Notification Settings</CardTitle>
          <CardDescription>Configure email notifications.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div>
            <Label htmlFor="adminNotificationEmail">Admin Notification Email</Label>
            <Input id="adminNotificationEmail" type="email" value={settings.adminNotificationEmail} onChange={handleInputChange} placeholder="admin-alerts@example.com" />
            <p className="text-xs text-muted-foreground mt-1">Email address for receiving important platform notifications.</p>
          </div>
          {/* More notification toggles could go here */}
        </CardContent>
      </Card>

      {/* Audit Logs Section */}
      <AuditLogsSection />

      <div className="flex justify-end mt-8">
         <Button onClick={handleSaveSettings} size="lg">Save All Settings</Button>
      </div>
    </div>
  );
}
