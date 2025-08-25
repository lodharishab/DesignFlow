
"use client";

import { useState, useMemo, type ReactElement } from 'react';
import Link from 'next/link';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { PlusCircle, Edit3, Trash2, Newspaper, PackageSearch, ArrowUpDown, ChevronUp, ChevronDown, Search } from 'lucide-react';
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

type SortableKeys = 'title' | 'category' | 'publishDate';

interface BlogPostsTableProps {
    initialPosts: BlogPost[];
}

export function BlogPostsTable({ initialPosts }: BlogPostsTableProps): ReactElement {
    const { toast } = useToast();
    const [posts, setPosts] = useState<BlogPost[]>(initialPosts);
    const [searchTerm, setSearchTerm] = useState('');
    const [categoryFilter, setCategoryFilter] = useState('All');
    const [sortConfig, setSortConfig] = useState<{ key: SortableKeys; direction: 'ascending' | 'descending' }>({
        key: 'publishDate',
        direction: 'descending',
    });
    
    const uniqueCategories = useMemo(() => {
        const categories = new Set(initialPosts.map(post => post.category).filter(Boolean));
        return ['All', ...Array.from(categories).sort()];
    }, [initialPosts]);

    const requestSort = (key: SortableKeys) => {
        let direction: 'ascending' | 'descending' = 'ascending';
        if (sortConfig.key === key && sortConfig.direction === 'ascending') {
            direction = 'descending';
        }
        setSortConfig({ key, direction });
    };

    const getSortIndicator = (key: SortableKeys) => {
        if (sortConfig.key !== key) {
            return <ArrowUpDown className="ml-2 h-3 w-3 text-muted-foreground/50" />;
        }
        return sortConfig.direction === 'ascending' ?
            <ChevronUp className="ml-1 h-4 w-4" /> :
            <ChevronDown className="ml-1 h-4 w-4" />;
    };

    const displayedPosts = useMemo(() => {
        let sortableItems = [...posts];

        if (searchTerm) {
            const lowerSearchTerm = searchTerm.toLowerCase();
            sortableItems = sortableItems.filter(post => post.title.toLowerCase().includes(lowerSearchTerm));
        }

        if (categoryFilter !== 'All') {
            sortableItems = sortableItems.filter(post => post.category === categoryFilter);
        }

        if (sortConfig.key) {
            sortableItems.sort((a, b) => {
                const valA = a[sortConfig.key] ?? '';
                const valB = b[sortConfig.key] ?? '';
                let comparison = 0;
                
                if (valA instanceof Date && valB instanceof Date) {
                    comparison = valA.getTime() - valB.getTime();
                } else {
                    comparison = String(valA).toLowerCase().localeCompare(String(valB).toLowerCase());
                }

                return sortConfig.direction === 'ascending' ? comparison : comparison * -1;
            });
        }

        return sortableItems;
    }, [posts, searchTerm, categoryFilter, sortConfig]);

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
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6 p-4 border rounded-lg bg-card">
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
            </div>

            <Table>
                <TableHeader>
                    <TableRow>
                        <TableHead>
                             <Button variant="ghost" onClick={() => requestSort('title')} className="px-1 text-xs sm:text-sm -ml-2">
                                Title {getSortIndicator('title')}
                            </Button>
                        </TableHead>
                        <TableHead>
                             <Button variant="ghost" onClick={() => requestSort('category')} className="px-1 text-xs sm:text-sm -ml-2">
                                Category {getSortIndicator('category')}
                            </Button>
                        </TableHead>
                        <TableHead>Author</TableHead>
                        <TableHead>
                            <Button variant="ghost" onClick={() => requestSort('publishDate')} className="px-1 text-xs sm:text-sm -ml-2">
                                Publish Date {getSortIndicator('publishDate')}
                            </Button>
                        </TableHead>
                        <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {displayedPosts.length === 0 ? (
                        <TableRow>
                            <TableCell colSpan={5} className="text-center h-24">
                                <PackageSearch className="mx-auto h-12 w-12 text-muted-foreground opacity-50 mb-2" />
                                No blog posts match your filters.
                            </TableCell>
                        </TableRow>
                    ) : (
                        displayedPosts.map((post) => (
                            <TableRow key={post.id}>
                                <TableCell className="font-medium hover:text-primary">
                                    <Link href={`/blog/${post.id}`} target="_blank" title={`View "${post.title}" on site`}>
                                        {post.title}
                                    </Link>
                                </TableCell>
                                <TableCell>
                                    {post.category ? <Badge variant="outline">{post.category}</Badge> : <span className="text-muted-foreground italic">N/A</span>}
                                </TableCell>
                                <TableCell className="text-muted-foreground">{post.authorName}</TableCell>
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

