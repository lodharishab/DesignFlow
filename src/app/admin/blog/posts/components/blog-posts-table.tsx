
"use client";

import { useState, useMemo, type ReactElement } from 'react';
import Link from 'next/link';
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { PlusCircle, Edit3, Trash2, Newspaper, PackageSearch, ArrowUpDown, ChevronUp, ChevronDown, Search, CheckCircle, FileText, Clock, Eye, BarChart2, ThumbsUp, MessageSquare } from 'lucide-react';
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
import { useToast } from '@/hooks/use-toast';
import { cn } from '@/lib/utils';

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
    const [posts, setPosts] = useState<BlogPost[]>(initialPosts);
    const [searchTerm, setSearchTerm] = useState('');
    const [categoryFilter, setCategoryFilter] = useState('All');
    const [statusFilter, setStatusFilter] = useState<StatusFilter>('All');
    const [sortBy, setSortBy] = useState<SortByType>('newest');
    
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

    const handleDeletePost = async (postId: string) => {
        const success = await deleteBlogPost(postId);
        if (success) {
            setPosts(prevPosts => prevPosts.filter(p => p.id !== postId));
            toast({ title: 'Success', description: 'Blog post deleted successfully.' });
        } else {
            toast({ title: 'Error', description: 'Failed to delete blog post.', variant: 'destructive' });
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

            <Table>
                <TableHeader>
                    <TableRow>
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
                            <TableCell colSpan={6} className="text-center h-24">
                                <PackageSearch className="mx-auto h-12 w-12 text-muted-foreground opacity-50 mb-2" />
                                No blog posts match your filters.
                            </TableCell>
                        </TableRow>
                    ) : (
                        displayedPosts.map((post) => (
                            <TableRow key={post.id}>
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
                                <TableCell className="text-right space-x-2">
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
