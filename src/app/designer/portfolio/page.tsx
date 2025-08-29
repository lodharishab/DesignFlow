
"use client";

import { useState, useMemo, useEffect, type ReactElement } from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { PlusCircle, Edit, Trash2, PackageSearch, ListFilter, Search, ArrowUpDown, ChevronUp, ChevronDown } from 'lucide-react';
import Image from 'next/image';
import { getPortfolioItemsByDesignerId } from '@/lib/portfolio-db';
import type { PortfolioItem } from '@/components/shared/portfolio-item-card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

// Hardcoded designerId for now, replace with actual auth logic
const MOCK_DESIGNER_ID = "des001";
type SortablePortfolioKeys = 'projectDate' | 'title' | 'views' | 'likes';

async function getInitialData() {
    return await getPortfolioItemsByDesignerId(MOCK_DESIGNER_ID);
}

export default function DesignerPortfolioPage(): ReactElement {
  const [portfolioItems, setPortfolioItems] = useState<PortfolioItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  
  // Filtering and Sorting State
  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('All');
  const [sortConfig, setSortConfig] = useState<{ key: SortablePortfolioKeys; direction: 'ascending' | 'descending' }>({
    key: 'projectDate',
    direction: 'descending',
  });

  useEffect(() => {
    getInitialData().then(data => {
      setPortfolioItems(data);
      setIsLoading(false);
    });
  }, []);
  
  const uniqueCategories = useMemo(() => {
    const categories = new Set(portfolioItems.map(item => item.category));
    return ['All', ...Array.from(categories).sort()];
  }, [portfolioItems]);

  const requestSort = (key: SortablePortfolioKeys) => {
    let direction: 'ascending' | 'descending' = 'ascending';
    if (sortConfig.key === key && sortConfig.direction === 'ascending') {
      direction = 'descending';
    }
    setSortConfig({ key, direction });
  };
  
  const getSortIndicator = (key: SortablePortfolioKeys) => {
    if (sortConfig.key !== key) {
      return <ArrowUpDown className="ml-2 h-3 w-3 text-muted-foreground/50" />;
    }
    return sortConfig.direction === 'ascending' ?
      <ChevronDown className="ml-1 h-4 w-4" /> :
      <ChevronUp className="ml-1 h-4 w-4" />;
  };

  const displayedItems = useMemo(() => {
    let filtered = [...portfolioItems];

    if (categoryFilter !== 'All') {
      filtered = filtered.filter(item => item.category === categoryFilter);
    }
    
    if (searchTerm) {
        const lowerSearch = searchTerm.toLowerCase();
        filtered = filtered.filter(item => 
            item.title.toLowerCase().includes(lowerSearch) ||
            item.category.toLowerCase().includes(lowerSearch) ||
            item.clientName?.toLowerCase().includes(lowerSearch) ||
            item.tags?.some(tag => tag.toLowerCase().includes(lowerSearch))
        );
    }

    if (sortConfig.key) {
      filtered.sort((a, b) => {
        let valA = a[sortConfig.key!];
        let valB = b[sortConfig.key!];

        // Handle potentially undefined or null values for sorting
        if (valA === undefined || valA === null) return 1;
        if (valB === undefined || valB === null) return -1;
        
        let comparison = 0;
        if(sortConfig.key === 'projectDate') {
            // Assuming YYYY-MM format, convert to comparable strings or dates
            comparison = (valA as string).localeCompare(valB as string);
        } else if (typeof valA === 'number' && typeof valB === 'number') {
          comparison = valA - valB;
        } else {
          comparison = String(valA).toLowerCase().localeCompare(String(valB).toLowerCase());
        }
        
        return sortConfig.direction === 'ascending' ? comparison : comparison * -1;
      });
    }

    return filtered;
  }, [portfolioItems, categoryFilter, searchTerm, sortConfig]);

  if (isLoading) {
    return <div>Loading portfolio...</div>; // Or a spinner component
  }

  return (
    <div className="space-y-8">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <h1 className="text-3xl font-bold font-headline">Manage Your Portfolio</h1>
        <Button asChild>
          <Link href="/designer/portfolio/new">
            <PlusCircle className="mr-2 h-4 w-4" /> Add New Project
          </Link>
        </Button>
      </div>

       <Card className="shadow-lg">
        <CardHeader>
          <CardTitle>Filter & Sort Projects</CardTitle>
           <div className="pt-4 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            <div className="space-y-1">
                <Label htmlFor="search" className="text-xs">Search Title, Client, etc.</Label>
                <div className="relative">
                    <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input id="search" placeholder="e.g., E-commerce or startup..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} className="pl-9"/>
                </div>
            </div>
             <div className="space-y-1">
                <Label htmlFor="categoryFilter" className="text-xs">Filter by Category</Label>
                <Select value={categoryFilter} onValueChange={setCategoryFilter}>
                  <SelectTrigger id="categoryFilter"><SelectValue /></SelectTrigger>
                  <SelectContent>
                    {uniqueCategories.map(cat => <SelectItem key={cat} value={cat}>{cat}</SelectItem>)}
                  </SelectContent>
                </Select>
            </div>
            <div className="space-y-1">
                <Label htmlFor="sortBy" className="text-xs">Sort By</Label>
                <Select value={sortConfig.key || ''} onValueChange={(v) => requestSort(v as SortablePortfolioKeys)}>
                  <SelectTrigger id="sortBy"><SelectValue /></SelectTrigger>
                  <SelectContent>
                      <SelectItem value="projectDate">Newest</SelectItem>
                      <SelectItem value="title">Title</SelectItem>
                      <SelectItem value="views">Most Viewed</SelectItem>
                      <SelectItem value="likes">Most Popular</SelectItem>
                  </SelectContent>
                </Select>
            </div>
           </div>
        </CardHeader>
        <CardContent>
            {displayedItems.length === 0 ? (
                <div className="text-center py-12">
                    <PackageSearch className="mx-auto h-24 w-24 text-muted-foreground opacity-50" />
                    <h2 className="mt-6 text-2xl font-semibold">No Projects Found</h2>
                    <p className="mt-2 text-muted-foreground">Your portfolio is empty or no projects match the current filters.</p>
                    {portfolioItems.length > 0 ? (
                        <Button variant="link" onClick={() => {setSearchTerm(''); setCategoryFilter('All');}}>Clear Filters</Button>
                    ) : (
                         <Button asChild className="mt-6">
                            <Link href="/designer/portfolio/new">
                                <PlusCircle className="mr-2 h-5 w-5" /> Add Your First Project
                            </Link>
                        </Button>
                    )}
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {displayedItems.map((item) => (
                    <Card key={item._id || item.id} className="overflow-hidden flex flex-col">
                    <div className="relative aspect-video w-full">
                        <Image
                        src={item.coverImageUrl}
                        alt={item.title}
                        fill
                        style={{ objectFit: 'cover' }}
                        data-ai-hint={item.coverImageHint}
                        />
                    </div>
                    <CardHeader className="pb-3">
                        <CardTitle className="text-lg font-headline group-hover:text-primary transition-colors">
                        {item.title}
                        </CardTitle>
                        <CardDescription className="text-xs text-muted-foreground">
                        Category: <Badge variant="outline" className="ml-1">{item.category}</Badge>
                        </CardDescription>
                    </CardHeader>
                    <CardContent className="text-sm text-muted-foreground flex-grow">
                        <p className="line-clamp-3">{item.projectDescription}</p>
                    </CardContent>
                    <CardContent className="pt-3 pb-4 border-t">
                        <div className="flex justify-end space-x-2">
                        <Button variant="outline" size="sm" asChild>
                            <Link href={`/designer/portfolio/edit/${item.id}`}>
                            <Edit className="mr-1.5 h-3.5 w-3.5" /> Edit
                            </Link>
                        </Button>
                        <Button variant="outline" size="sm" className="text-destructive hover:bg-destructive/10 hover:text-destructive" disabled>
                            <Trash2 className="mr-1.5 h-3.5 w-3.5" /> Delete
                        </Button>
                        </div>
                    </CardContent>
                    </Card>
                ))}
                </div>
            )}
        </CardContent>
      </Card>
    </div>
  );
}
