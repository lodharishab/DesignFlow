
"use client";

import { useUI } from "@/contexts/ui-context";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
  DropdownMenuGroup,
} from "@/components/ui/dropdown-menu";
import { Sparkles, ChevronsUpDown, Check, PlusCircle, Settings, Heart } from "lucide-react";
import Image from 'next/image';
import Link from 'next/link';

export function BrandSwitcher() {
  const { brandKits, activeBrandKit, setActiveBrandKit } = useUI();

  if (brandKits.length === 0) {
    return (
      <Button variant="outline" asChild>
        <Link href="/client/brand-profile/new">
          <PlusCircle className="mr-2 h-4 w-4" />
          Create First Brand
        </Link>
      </Button>
    );
  }

  const favoriteKits = brandKits.filter(kit => kit.isFavorite);
  const otherKits = brandKits.filter(kit => !kit.isFavorite);

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" className="w-[240px] justify-between">
          <div className="flex items-center gap-2 overflow-hidden">
            {activeBrandKit?.logoUrl ? (
                <div className="relative h-6 w-6 shrink-0">
                    <Image src={activeBrandKit.logoUrl} alt={activeBrandKit.companyName} layout="fill" objectFit="contain" />
                </div>
            ) : (
                <Sparkles className="h-5 w-5 text-primary shrink-0" />
            )}
            <span className="truncate font-medium">{activeBrandKit?.companyName || "Select a Brand"}</span>
          </div>
          <ChevronsUpDown className="h-4 w-4 text-muted-foreground shrink-0" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-[240px]" align="end">
        <DropdownMenuLabel>Switch Brand Profile</DropdownMenuLabel>
        <DropdownMenuSeparator />
        
        {favoriteKits.length > 0 && (
          <DropdownMenuGroup>
             <DropdownMenuLabel className="text-xs text-muted-foreground px-2 pt-1.5">Favorites</DropdownMenuLabel>
             {favoriteKits.map((kit) => (
              <DropdownMenuItem key={kit.id} onSelect={() => setActiveBrandKit(kit)}>
                <div className="flex items-center justify-between w-full">
                  <div className="flex items-center gap-2 overflow-hidden">
                      <Heart className="h-4 w-4 text-red-500 fill-current" />
                      <span className="truncate">{kit.companyName}</span>
                  </div>
                  {activeBrandKit?.id === kit.id && <Check className="h-4 w-4 text-primary" />}
                </div>
              </DropdownMenuItem>
            ))}
          </DropdownMenuGroup>
        )}
        
        {(favoriteKits.length > 0 && otherKits.length > 0) && <DropdownMenuSeparator />}
        
        {otherKits.length > 0 && (
          <DropdownMenuGroup>
            {otherKits.map((kit) => (
              <DropdownMenuItem key={kit.id} onSelect={() => setActiveBrandKit(kit)}>
                <div className="flex items-center justify-between w-full">
                  <div className="flex items-center gap-2 overflow-hidden">
                      {kit.logoUrl ? (
                          <div className="relative h-6 w-6 shrink-0">
                              <Image src={kit.logoUrl} alt={kit.companyName} layout="fill" objectFit="contain" />
                          </div>
                      ) : (
                          <Sparkles className="h-5 w-5 text-muted-foreground shrink-0" />
                      )}
                      <span className="truncate">{kit.companyName}</span>
                  </div>
                  {activeBrandKit?.id === kit.id && <Check className="h-4 w-4 text-primary" />}
                </div>
              </DropdownMenuItem>
            ))}
          </DropdownMenuGroup>
        )}

        <DropdownMenuSeparator />
        <DropdownMenuItem asChild>
           <Link href="/client/brand-profiles">
              <Settings className="mr-2 h-4 w-4" />
              Manage All Brands
            </Link>
        </DropdownMenuItem>
        <DropdownMenuItem asChild>
          <Link href="/client/brand-profile/new">
            <PlusCircle className="mr-2 h-4 w-4" />
            Create New Brand
          </Link>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
