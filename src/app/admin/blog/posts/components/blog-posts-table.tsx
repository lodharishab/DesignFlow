
"use client";

import { useState, useMemo, type ReactElement } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { PlusCircle, Edit3, Trash2, Newspaper, PackageSearch, ArrowUpDown, ChevronUp, ChevronDown, Search, CheckCircle, FileText, Clock, Eye, BarChart2, ThumbsUp, MessageSquare, ChevronDown as ChevronDownIcon, CheckCircle2, AlertOctagon, Copy } from 'lucide-react';
import { type BlogPost, deleteBlogPost } from '@/lib/blog-db';
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
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger
} from "@/components/ui/dropdown-menu";
import { useToast } from '@/hooks/use-toast';
import { cn } from '@/lib/utils';
import { Checkbox } from '@/components/ui/checkbox';

type SortByType = 'newest' | 'oldest' | 'views' | 'likes' | 'comments';
type StatusFilter = 'All' | BlogPost['status'];

interface BlogPostsTableProps {
    initialPosts: BlogPost[];
}

const statusFilters: {label: string; value: StatusFilter, icon?: React.ElementType}[] = [
    {label: 'All Posts', value: 'All'},
    {label: 'Published', value: 'Published', icon: CheckCircle},
    {label: 'Drafts', value: 'Draft', icon: FileText},
    {label: 'Scheduled', value: 'Scheduled', icon: Clock},
];

const sortOptions: {label: string, value: SortByType}[] = [
    {label: 'Newest First', value: 'newest'},
    {label: 'Oldest First', value: 'oldest'},
    {label: 'Most Viewed', value: 'views'},
    {label: 'Most Liked', value: 'likes'},
    {label: 'Most Comments', value: 'comments'},
]

export function BlogPostsTable({ initialPosts }: BlogPostsTableProps): ReactElement {
    const { toast } = useToast();
    const router = useRouter();
    const [posts, setPosts] = useState<BlogPost[]>(initialPosts);
    const [searchTerm, setSearchTerm] = useState('');
    const [categoryFilter, setCategoryFilter] = useState('All');
    const [statusFilter, setStatusFilter] = useState<StatusFilter>('All');
    const [sortBy, setSortBy] = useState<SortByType>('newest');
    const [selectedPostIds, setSelectedPostIds] = useState<Set<string>>(new Set());
    
    const uniqueCategories = useMemo(() => {
        const categories = new Set(initialPosts.map(post => post.category).filter(Boolean));
        return ['All', ...Array.from(categories).sort()];
    }, [initialPosts]);

    const getStatusBadgeVariant = (status: BlogPost['status']) => {
        switch (status) {
            case 'Published': return 'default';
            case 'Draft': return 'secondary';
            case 'Scheduled': return 'outline';
            default: return 'outline';
        }
    }

    const displayedPosts = useMemo(() => {
        let sortableItems = [...posts];

        if (searchTerm) {
            const lowerSearchTerm = searchTerm.toLowerCase();
            sortableItems = sortableItems.filter(post => post.title.toLowerCase().includes(lowerSearchTerm));
        }

        if (categoryFilter !== 'All') {
            sortableItems = sortableItems.filter(post => post.category === categoryFilter);
        }

        if (statusFilter !== 'All') {
            sortableItems = sortableItems.filter(post => post.status === statusFilter);
        }

        sortableItems.sort((a, b) => {
            switch (sortBy) {
                case 'oldest':
                    return a.publishDate.getTime() - b.publishDate.getTime();
                case 'views':
                    return (b.views || 0) - (a.views || 0);
                case 'likes':
                    return (b.likes || 0) - (a.likes || 0);
                case 'comments':
                    return (b.comments || 0) - (a.comments || 0);
                case 'newest':
                default:
                    return b.publishDate.getTime() - a.publishDate.getTime();
            }
        });

        return sortableItems;
    }, [posts, searchTerm, categoryFilter, statusFilter, sortBy]);

    const handleSelectAll = (checked: boolean | 'indeterminate') => {
        if (checked === true) {
        setSelectedPostIds(new Set(displayedPosts.map(d => d.id)));
        } else {
        setSelectedPostIds(new Set());
        }
    };

    const handleSelectOne = (postId: string, checked: boolean | 'indeterminate') => {
        setSelectedPostIds(prevSelected => {
        const newSelected = new Set(prevSelected);
        if (checked === true) {
            newSelected.add(postId);
        } else {
            newSelected.delete(postId);
        }
        return newSelected;
        });
    };
  
    const isAllDisplayedSelected = useMemo(() => {
        return displayedPosts.length > 0 && selectedPostIds.size === displayedPosts.length && displayedPosts.every(d => selectedPostIds.has(d.id));
    }, [displayedPosts, selectedPostIds]);

    const isIndeterminate = useMemo(() => {
        const displayedSelectedCount = displayedPosts.filter(d => selectedPostIds.has(d.id)).length;
        return displayedSelectedCount > 0 && displayedSelectedCount < displayedPosts.length;
    }, [displayedPosts, selectedPostIds]);


    const handleDeletePost = async (postId: string) => {
        const success = await deleteBlogPost(postId);
        if (success) {
            setPosts(prevPosts => prevPosts.filter(p => p.id !== postId));
            toast({ title: 'Success', description: 'Blog post deleted successfully.' });
        } else {
            toast({ title: 'Error', description: 'Failed to delete blog post.', variant: 'destructive' });
        }
    };
    
    const handleBulkStatusChange = (newStatus: BlogPost['status']) => {
        setPosts(prevPosts =>
            prevPosts.map(post => 
                selectedPostIds.has(post.id) ? { ...post, status: newStatus } : post
            )
        );
        toast({
            title: `Bulk Status Update`,
            description: `${selectedPostIds.size} post(s) status changed to ${newStatus}. (Simulated)`,
        });
        setSelectedPostIds(new Set());
    };

    const handleBulkDelete = () => {
        setPosts(prevPosts =>
            prevPosts.filter(p => !selectedPostIds.has(p.id))
        );
        toast({
            title: 'Bulk Delete Success',
            description: `${selectedPostIds.size} post(s) have been deleted. (Simulated)`,
            variant: 'destructive',
        });
        setSelectedPostIds(new Set());
    };
    
    const getDuplicateQuery = (post: BlogPost) => {
        const { _id, id, publishDate, ...duplicatablePost } = post;
        const postToDuplicate = {
            ...duplicatablePost,
            title: `${duplicatablePost.title} (Copy)`,
            publishDateString: new Date().toISOString().split('T')[0], // Set to today
        }
        return `?duplicate=${encodeURIComponent(JSON.stringify(postToDuplicate))}`;
    }

    const handleDuplicateSelected = () => {
        if (selectedPostIds.size !== 1) return;
        const postId = selectedPostIds.values().next().value;
        const postToDuplicate = posts.find(p => p.id === postId);
        if (postToDuplicate) {
            const duplicateQuery = getDuplicateQuery(postToDuplicate);
            router.push(`/admin/blog/posts/new${duplicateQuery}`);
        }
    };


    return (
        <>
            <div className="flex flex-wrap gap-2 mb-4">
                {statusFilters.map(filter => (
                    <Button
                        key={filter.value}
                        variant={statusFilter === filter.value ? 'default' : 'outline'}
                        size="sm"
                        onClick={() => setStatusFilter(filter.value)}
                    >
                         {filter.icon && <filter.icon className="mr-2 h-4 w-4" />}
                         {filter.label}
                    </Button>
                ))}
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 mb-6 p-4 border rounded-lg bg-card">
                <div className="space-y-1">
                    <Label htmlFor="searchTitle" className="text-xs">Search by Title</Label>
                    <div className="relative">
                        <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                        <Input
                            id="searchTitle"
                            placeholder="e.g., Design Trends"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="pl-9"
                        />
                    </div>
                </div>
                <div className="space-y-1">
                    <Label htmlFor="categoryFilter" className="text-xs">Filter by Category</Label>
                    <Select value={categoryFilter} onValueChange={setCategoryFilter}>
                        <SelectTrigger id="categoryFilter">
                            <SelectValue placeholder="Select a category" />
                        </SelectTrigger>
                        <SelectContent>
                            {uniqueCategories.map(cat => (
                                <SelectItem key={cat} value={cat}>{cat}</SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                </div>
                 <div className="space-y-1">
                    <Label htmlFor="sortBy" className="text-xs">Sort By</Label>
                    <Select value={sortBy} onValueChange={(v) => setSortBy(v as SortByType)}>
                        <SelectTrigger id="sortBy">
                            <SelectValue placeholder="Sort posts by..." />
                        </SelectTrigger>
                        <SelectContent>
                            {sortOptions.map(option => (
                                <SelectItem key={option.value} value={option.value}>{option.label}</SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                </div>
            </div>

            {selectedPostIds.size > 0 && (
                <div className="mb-4 p-3 bg-secondary/50 rounded-md flex items-center justify-between">
                <p className="text-sm font-medium">
                    {selectedPostIds.size} post{selectedPostIds.size > 1 ? 's' : ''} selected
                </p>
                <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                    <Button variant="outline">
                        Bulk Actions <ChevronDownIcon className="ml-2 h-4 w-4" />
                    </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                    <DropdownMenuLabel>Apply to selected</DropdownMenuLabel>
                    <DropdownMenuSeparator />
                     <DropdownMenuItem onClick={handleDuplicateSelected} disabled={selectedPostIds.size !== 1}>
                        <Copy className="mr-2 h-4 w-4" /> Duplicate
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => handleBulkStatusChange('Published')}>
                        <CheckCircle2 className="mr-2 h-4 w-4" /> Publish
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => handleBulkStatusChange('Draft')}>
                        <FileText className="mr-2 h-4 w-4" /> Set to Draft
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                     <AlertDialog>
                        <AlertDialogTrigger asChild>
                            <DropdownMenuItem onSelect={(e) => e.preventDefault()} className="text-destructive focus:bg-destructive/10 focus:text-destructive">
                                <Trash2 className="mr-2 h-4 w-4" /> Delete
                            </DropdownMenuItem>
                        </AlertDialogTrigger>
                        <AlertDialogContent>
                            <AlertDialogHeader>
                            <AlertDialogTitle>Confirm Bulk Deletion</AlertDialogTitle>
                            <AlertDialogDescription>
                                Are you sure you want to delete {selectedPostIds.size} selected post(s)? This action cannot be undone.
                            </AlertDialogDescription>
                            </AlertDialogHeader>
                            <AlertDialogFooter>
                            <AlertDialogCancel>Cancel</AlertDialogCancel>
                            <AlertDialogAction onClick={handleBulkDelete} className="bg-destructive hover:bg-destructive/90 text-destructive-foreground">
                                Delete Posts
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
                                disabled={displayedPosts.length === 0}
                            />
                        </TableHead>
                        <TableHead className="w-[40%]">Title</TableHead>
                        <TableHead>Category</TableHead>
                        <TableHead>Author</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead>Publish Date</TableHead>
                        <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {displayedPosts.length === 0 ? (
                        <TableRow>
                            <TableCell colSpan={7} className="text-center h-24">
                                <PackageSearch className="mx-auto h-12 w-12 text-muted-foreground opacity-50 mb-2" />
                                No blog posts match your filters.
                            </TableCell>
                        </TableRow>
                    ) : (
                        displayedPosts.map((post) => (
                            <TableRow key={post.id} data-state={selectedPostIds.has(post.id) ? "selected" : ""}>
                                <TableCell>
                                    <Checkbox
                                        checked={selectedPostIds.has(post.id)}
                                        onCheckedChange={(checked) => handleSelectOne(post.id, checked)}
                                        aria-label={`Select row for ${post.title}`}
                                    />
                                </TableCell>
                                <TableCell className="font-medium">
                                    <Link href={`/blog/${post.id}`} target="_blank" title={`View "${post.title}" on site`} className="hover:text-primary hover:underline">
                                        {post.title}
                                    </Link>
                                    <div className="flex items-center gap-4 mt-1.5 text-xs text-muted-foreground">
                                        <div className="flex items-center" title="Views">
                                            <Eye className="h-3.5 w-3.5 mr-1" /> {post.views?.toLocaleString() || 0}
                                        </div>
                                        <div className="flex items-center" title="Likes">
                                            <ThumbsUp className="h-3.5 w-3.5 mr-1" /> {post.likes?.toLocaleString() || 0}
                                        </div>
                                        <div className="flex items-center" title="Comments">
                                            <MessageSquare className="h-3.5 w-3.5 mr-1" /> {post.comments?.toLocaleString() || 0}
                                        </div>
                                    </div>
                                </TableCell>
                                <TableCell>
                                    {post.category ? <Badge variant="outline">{post.category}</Badge> : <span className="text-muted-foreground italic">N/A</span>}
                                </TableCell>
                                 <TableCell className="text-muted-foreground">{post.authorName}</TableCell>
                                <TableCell>
                                    <Badge variant={getStatusBadgeVariant(post.status)}>{post.status}</Badge>
                                </TableCell>
                                <TableCell className="text-muted-foreground">{format(post.publishDate, 'MMM d, yyyy')}</TableCell>
                                <TableCell className="text-right space-x-1">
                                    <Button variant="outline" size="icon" asChild className="hover:text-primary">
                                        <Link href={`/admin/blog/posts/new${getDuplicateQuery(post)}`} aria-label={`Duplicate ${post.title}`}>
                                            <Copy className="h-4 w-4" />
                                        </Link>
                                    </Button>
                                    <Button variant="outline" size="icon" asChild className="hover:text-primary">
                                        <Link href={`/admin/blog/posts/edit/${post.id}`} aria-label={`Edit ${post.title}`}>
                                            <Edit3 className="h-4 w-4" />
                                        </Link>
                                    </Button>
                                    <AlertDialog>
                                        <AlertDialogTrigger asChild>
                                            <Button variant="outline" size="icon" className="hover:text-destructive" aria-label={`Delete ${post.title}`}>
                                                <Trash2 className="h-4 w-4" />
                                            </Button>
                                        </AlertDialogTrigger>
                                        <AlertDialogContent>
                                            <AlertDialogHeader>
                                                <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                                                <AlertDialogDescription>
                                                    This action cannot be undone. This will permanently delete the blog post
                                                    "{post.title}".
                                                </AlertDialogDescription>
                                            </AlertDialogHeader>
                                            <AlertDialogFooter>
                                                <AlertDialogCancel>Cancel</AlertDialogCancel>
                                                <AlertDialogAction onClick={() => handleDeletePost(post.id)}>
                                                    Continue
                                                </AlertDialogAction>
                                            </AlertDialogFooter>
                                        </AlertDialogContent>
                                    </AlertDialog>
                                </TableCell>
                            </TableRow>
                        ))
                    )}
                </TableBody>
            </Table>
        </>
    );
}
