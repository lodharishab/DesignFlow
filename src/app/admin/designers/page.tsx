
"use client";

import { useState, type ReactElement, useEffect, useMemo } from 'react';
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuLabel, 
  DropdownMenuSeparator, 
  DropdownMenuTrigger 
} from "@/components/ui/dropdown-menu";
import { 
    Users, 
    PlusCircle, 
    Edit3, 
    Trash2, 
    CheckCircle, 
    XCircle, 
    Link as LinkIconLucide, 
    CalendarDays, 
    Mail, 
    Filter, 
    ChevronDown,
    CheckCircle2,
    AlertOctagon,
    Clock3,
    TrendingUp, // For Profile Readiness
    Eye
} from 'lucide-react';
import Link from 'next/link';
import { useToast } from "@/hooks/use-toast";
import { format } from 'date-fns';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"; 
import { Progress } from "@/components/ui/progress"; // Import Progress component

interface Designer {
  id: string;
  name: string;
  email: string;
  avatarUrl: string;
  avatarHint: string;
  status: 'Active' | 'Pending Approval' | 'Suspended';
  joinDate: Date;
  servicesApproved: number;
  portfolioLink?: string;
  profileCompletenessScore: number; // Added field
}

const initialDesignersData: Designer[] = [
  { id: 'des_new_app', name: 'New Applicant', email: 'new.designer@example.com', avatarUrl: 'https://placehold.co/40x40.png', avatarHint: 'person silhouette', status: 'Pending Approval', joinDate: new Date(), servicesApproved: 0, portfolioLink: 'https://example.com/newportfolio', profileCompletenessScore: 50 },
  { id: 'des001', name: 'Priya Sharma', email: 'priya.sharma@example.in', avatarUrl: 'https://placehold.co/40x40.png', avatarHint: 'indian woman designer', status: 'Active', joinDate: new Date(2023, 5, 15), servicesApproved: 7, portfolioLink: 'https://example.com/priyasharma', profileCompletenessScore: 95 },
  { id: 'des002', name: 'Rohan Kapoor', email: 'rohan.kapoor@example.in', avatarUrl: 'https://placehold.co/40x40.png', avatarHint: 'indian man architect', status: 'Pending Approval', joinDate: new Date(2023, 8, 20), servicesApproved: 0, portfolioLink: 'https://example.com/rohankapoor', profileCompletenessScore: 60 },
  { id: 'des003', name: 'Aisha Khan', email: 'aisha.khan@example.in', avatarUrl: 'https://placehold.co/40x40.png', avatarHint: 'indian woman creative', status: 'Active', joinDate: new Date(2022, 11, 1), servicesApproved: 10, profileCompletenessScore: 88 },
  { id: 'des004', name: 'Vikram Singh', email: 'vikram.singh@example.in', avatarUrl: 'https://placehold.co/40x40.png', avatarHint: 'indian man artist', status: 'Suspended', joinDate: new Date(2023, 1, 10), servicesApproved: 3, portfolioLink: 'https://example.com/vikramsingh', profileCompletenessScore: 70 },
  { id: 'des005', name: 'Sunita Reddy', email: 'sunita.reddy@example.in', avatarUrl: 'https://placehold.co/40x40.png', avatarHint: 'indian woman professional', status: 'Pending Approval', joinDate: new Date(2024, 0, 5), servicesApproved: 0, profileCompletenessScore: 45 },
  { id: 'des006', name: 'Arjun Mehta', email: 'arjun.mehta@example.in', avatarUrl: 'https://placehold.co/40x40.png', avatarHint: 'indian man photographer', status: 'Active', joinDate: new Date(2023, 3, 12), servicesApproved: 5, portfolioLink: 'https://example.com/arjunmehta', profileCompletenessScore: 92 },
  { id: 'des007', name: 'Neha Joshi', email: 'neha.joshi@example.in', avatarUrl: 'https://placehold.co/40x40.png', avatarHint: 'indian woman fashion designer', status: 'Active', joinDate: new Date(2022, 7, 25), servicesApproved: 8, profileCompletenessScore: 75 },
  { id: 'des008', name: 'Karan Verma', email: 'karan.verma@example.in', avatarUrl: 'https://placehold.co/40x40.png', avatarHint: 'indian man developer', status: 'Pending Approval', joinDate: new Date(2024, 2, 1), servicesApproved: 0, profileCompletenessScore: 30 },
];

type StatusFilter = Designer['status'] | 'All';
const statusFilters: { label: string; value: StatusFilter, icon: React.ElementType }[] = [
  { label: 'All Designers', value: 'All', icon: Users },
  { label: 'Active', value: 'Active', icon: CheckCircle2 },
  { label: 'Pending Approval', value: 'Pending Approval', icon: Clock3 },
  { label: 'Suspended', value: 'Suspended', icon: AlertOctagon },
];

export default function AdminDesignersPage(): ReactElement {
  const [allDesigners, setAllDesigners] = useState<Designer[]>(initialDesignersData);
  const [statusFilter, setStatusFilter] = useState<StatusFilter>('All');
  const [selectedDesignerIds, setSelectedDesignerIds] = useState<Set<string>>(new Set());
  const { toast } = useToast();

  const displayedDesigners = useMemo(() => {
    return allDesigners.filter(designer => 
      statusFilter === 'All' || designer.status === statusFilter
    );
  }, [allDesigners, statusFilter]);

  const handleSelectAll = (checked: boolean | 'indeterminate') => {
    if (checked === true) {
      setSelectedDesignerIds(new Set(displayedDesigners.map(d => d.id)));
    } else {
      setSelectedDesignerIds(new Set());
    }
  };

  const handleSelectOne = (designerId: string, checked: boolean | 'indeterminate') => {
    setSelectedDesignerIds(prevSelected => {
      const newSelected = new Set(prevSelected);
      if (checked === true) {
        newSelected.add(designerId);
      } else {
        newSelected.delete(designerId);
      }
      return newSelected;
    });
  };
  
  const isAllDisplayedSelected = useMemo(() => {
    return displayedDesigners.length > 0 && selectedDesignerIds.size === displayedDesigners.length && displayedDesigners.every(d => selectedDesignerIds.has(d.id));
  }, [displayedDesigners, selectedDesignerIds]);

  const isIndeterminate = useMemo(() => {
    const displayedSelectedCount = displayedDesigners.filter(d => selectedDesignerIds.has(d.id)).length;
    return displayedSelectedCount > 0 && displayedSelectedCount < displayedDesigners.length;
  }, [displayedDesigners, selectedDesignerIds]);

  const handleIndividualStatusChange = (designerId: string, newStatus: Designer['status']) => {
    setAllDesigners(prevDesigners =>
      prevDesigners.map(d => (d.id === designerId ? { ...d, status: newStatus } : d))
    );
    const designer = allDesigners.find(d => d.id === designerId);
    toast({
      title: `Designer Status Updated`,
      description: `${designer?.name}'s status changed to ${newStatus}. (Simulated)`,
      duration: 3000,
    });
  };

  const handleBulkStatusChange = (newStatus: Designer['status']) => {
    setAllDesigners(prevDesigners =>
      prevDesigners.map(d => 
        selectedDesignerIds.has(d.id) ? { ...d, status: newStatus } : d
      )
    );
    toast({
      title: `Bulk Status Update`,
      description: `${selectedDesignerIds.size} designer(s) status changed to ${newStatus}. (Simulated)`,
      duration: 3000,
    });
    setSelectedDesignerIds(new Set());
  };
  
  const handleBulkDelete = () => {
    setAllDesigners(prevDesigners =>
      prevDesigners.filter(d => !selectedDesignerIds.has(d.id))
    );
    toast({
      title: `Bulk Delete`,
      description: `${selectedDesignerIds.size} designer(s) deleted. (Simulated)`,
      variant: "destructive",
      duration: 3000,
    });
    setSelectedDesignerIds(new Set());
  };


  const getStatusBadgeVariant = (status: Designer['status']) => {
    switch (status) {
      case 'Active':
        return 'default';
      case 'Pending Approval':
        return 'secondary';
      case 'Suspended':
        return 'destructive';
      default:
        return 'outline';
    }
  };

  return (
    <div className="space-y-8">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <h1 className="text-3xl font-bold font-headline flex items-center">
          <Users className="mr-3 h-8 w-8 text-primary" />
          Manage Designers
        </h1>
        <Button asChild>
          <Link href="/admin/designers/new"> 
            <PlusCircle className="mr-2 h-4 w-4" /> Add New Designer
          </Link>
        </Button>
      </div>

      <Card className="shadow-lg">
        <CardHeader>
          <CardTitle>All Designer Accounts</CardTitle>
          <CardDescription>View, approve, and manage designer profiles and their statuses. Changes are simulated.</CardDescription>
           <div className="pt-4 flex flex-wrap gap-2">
            {statusFilters.map(filter => (
              <Button
                key={filter.value}
                variant={statusFilter === filter.value ? 'default' : 'outline'}
                onClick={() => setStatusFilter(filter.value)}
                size="sm"
              >
                <filter.icon className="mr-2 h-4 w-4" />
                {filter.label}
              </Button>
            ))}
          </div>
        </CardHeader>
        <CardContent>
          {selectedDesignerIds.size > 0 && (
            <div className="mb-4 p-3 bg-secondary/50 rounded-md flex items-center justify-between">
              <p className="text-sm font-medium">
                {selectedDesignerIds.size} designer{selectedDesignerIds.size > 1 ? 's' : ''} selected
              </p>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline">
                    Bulk Actions <ChevronDown className="ml-2 h-4 w-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuLabel>Apply to selected</DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={() => handleBulkStatusChange('Active')} className="text-green-600 dark:text-green-500">
                    <CheckCircle2 className="mr-2 h-4 w-4" /> Activate Selected
                  </DropdownMenuItem>
                   <DropdownMenuItem onClick={() => handleBulkStatusChange('Pending Approval')} className="text-blue-600 dark:text-blue-500">
                    <Clock3 className="mr-2 h-4 w-4" /> Set to Pending
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => handleBulkStatusChange('Suspended')} className="text-red-600 dark:text-red-500">
                    <AlertOctagon className="mr-2 h-4 w-4" /> Suspend Selected
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <AlertDialog>
                    <AlertDialogTrigger asChild>
                        <DropdownMenuItem onSelect={(e) => e.preventDefault()} className="text-destructive focus:bg-destructive/10 focus:text-destructive">
                            <Trash2 className="mr-2 h-4 w-4" /> Delete Selected
                        </DropdownMenuItem>
                    </AlertDialogTrigger>
                    <AlertDialogContent>
                        <AlertDialogHeader>
                        <AlertDialogTitle>Confirm Bulk Deletion</AlertDialogTitle>
                        <AlertDialogDescription>
                            Are you sure you want to delete {selectedDesignerIds.size} selected designer(s)? This action cannot be undone. (Simulated)
                        </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                        <AlertDialogCancel>Cancel</AlertDialogCancel>
                        <AlertDialogAction onClick={handleBulkDelete} className="bg-destructive hover:bg-destructive/90 text-destructive-foreground">
                            Delete
                        </AlertDialogAction>
                        </AlertDialogFooter>
                    </AlertDialogContent>
                  </AlertDialog>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          )}
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-[50px]">
                  <Checkbox
                    checked={isIndeterminate ? 'indeterminate' : isAllDisplayedSelected}
                    onCheckedChange={handleSelectAll}
                    aria-label="Select all displayed rows"
                    disabled={displayedDesigners.length === 0}
                  />
                </TableHead>
                <TableHead className="w-[60px]">Avatar</TableHead>
                <TableHead>Name</TableHead>
                <TableHead><Mail className="inline-block mr-1 h-4 w-4 text-muted-foreground" />Email</TableHead>
                <TableHead className="w-[150px]"><CalendarDays className="inline-block mr-1 h-4 w-4 text-muted-foreground" />Join Date</TableHead>
                <TableHead className="w-[120px] text-center">Services</TableHead>
                <TableHead className="w-[180px]"><TrendingUp className="inline-block mr-1 h-4 w-4 text-muted-foreground" />Profile Readiness</TableHead>
                <TableHead className="w-[150px]">Status</TableHead>
                <TableHead className="text-right w-[200px]">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {displayedDesigners.length === 0 && (
                <TableRow>
                  <TableCell colSpan={9} className="text-center h-24">
                    No designers match the current filter.
                  </TableCell>
                </TableRow>
              )}
              {displayedDesigners.map(designer => (
                <TableRow 
                    key={designer.id}
                    data-state={selectedDesignerIds.has(designer.id) ? "selected" : ""}
                >
                  <TableCell>
                    <Checkbox
                      checked={selectedDesignerIds.has(designer.id)}
                      onCheckedChange={(checked) => handleSelectOne(designer.id, checked)}
                      aria-label={`Select row for ${designer.name}`}
                    />
                  </TableCell>
                  <TableCell>
                    <Avatar className="h-10 w-10">
                      <AvatarImage src={designer.avatarUrl} alt={designer.name} data-ai-hint={designer.avatarHint} />
                      <AvatarFallback>{designer.name.substring(0, 2).toUpperCase()}</AvatarFallback>
                    </Avatar>
                  </TableCell>
                  <TableCell className="font-medium">{designer.name}</TableCell>
                  <TableCell className="text-muted-foreground">{designer.email}</TableCell>
                  <TableCell>{format(designer.joinDate, 'MMM d, yyyy')}</TableCell>
                  <TableCell className="text-center">{designer.servicesApproved}</TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <Progress value={designer.profileCompletenessScore} className="w-20 h-2" aria-label={`${designer.profileCompletenessScore}% complete`} />
                      <span className="text-xs text-muted-foreground">{designer.profileCompletenessScore}%</span>
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge variant={getStatusBadgeVariant(designer.status)}>{designer.status}</Badge>
                  </TableCell>
                  <TableCell className="text-right space-x-1">
                    {designer.status === 'Pending Approval' && (
                      <Button variant="outline" size="sm" className="text-green-600 hover:text-green-700 border-green-600 hover:border-green-700" onClick={() => handleIndividualStatusChange(designer.id, 'Active')}>
                        <CheckCircle className="mr-1 h-3 w-3" /> Approve
                      </Button>
                    )}
                     {designer.status === 'Active' && (
                      <Button variant="outline" size="sm" className="text-red-600 hover:text-red-700 border-red-600 hover:border-red-700" onClick={() => handleIndividualStatusChange(designer.id, 'Suspended')}>
                        <XCircle className="mr-1 h-3 w-3" /> Suspend
                      </Button>
                    )}
                     {designer.status === 'Suspended' && (
                      <Button variant="outline" size="sm" className="text-blue-600 hover:text-blue-700 border-blue-600 hover:border-blue-700" onClick={() => handleIndividualStatusChange(designer.id, 'Active')}>
                        <CheckCircle className="mr-1 h-3 w-3" /> Reactivate
                      </Button>
                    )}
                     <Button variant="outline" size="icon" asChild className="hover:text-primary">
                       <Link href={`/admin/designers/view/${designer.id}`} aria-label={`View ${designer.name}`}>
                        <Eye className="h-4 w-4" />
                      </Link>
                    </Button>
                    <Button variant="outline" size="icon" asChild className="hover:text-primary">
                       <Link href={`/admin/designers/edit/${designer.id}`} aria-label={`Edit ${designer.name}`}>
                        <Edit3 className="h-4 w-4" />
                      </Link>
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
