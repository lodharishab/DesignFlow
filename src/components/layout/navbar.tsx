
"use client";

import Link from 'next/link';
import { LogIn, UserPlus, Brush, LayoutGrid, PanelLeftClose, Briefcase, Newspaper, Sparkles, ShoppingCart, UserCircle } from 'lucide-react';
import {
  Navbar as HeroNavbar,
  NavbarBrand,
  NavbarContent,
  NavbarItem,
  NavbarMenuToggle,
  NavbarMenu,
  NavbarMenuItem,
  Button,
  Badge as HeroBadge,
  Avatar,
  Dropdown,
  DropdownTrigger,
  DropdownMenu,
  DropdownItem,
  DropdownSection,
  Divider,
} from '@heroui/react';
import { ModeToggle } from '@/components/shared/mode-toggle';
import * as React from 'react';
import { useUI } from '@/contexts/ui-context';
import { motion, AnimatePresence } from 'framer-motion';

export function Navbar() {
  const { isMobileMenuOpen, setIsMobileMenuOpen, toggleAiChat, isLoggedIn, setIsLoggedIn, userRole, setUserRole } = useUI();
  const [cartItemCount, setCartItemCount] = React.useState(0);

  React.useEffect(() => {
    if (isLoggedIn) {
      import('@/lib/cart-db').then(mod => {
        mod.getCartByUser('client001').then(items => {
          setCartItemCount(items?.length ?? 0);
        }).catch(() => setCartItemCount(0));
      });
    } else {
      setCartItemCount(0);
    }
  }, [isLoggedIn]);

  const handleLogout = () => {
    setIsLoggedIn(false);
    setUserRole(null);
  };

  const getDashboardPath = () => {
    if (userRole === 'admin' || userRole === 'super_admin') return '/admin/dashboard';
    if (userRole === 'designer') return '/designer/dashboard';
    return '/client/dashboard';
  };

  return (
    <HeroNavbar
      isMenuOpen={isMobileMenuOpen}
      onMenuOpenChange={setIsMobileMenuOpen}
      maxWidth="xl"
      position="sticky"
      classNames={{
        base: "bg-background/70 backdrop-blur-xl border-b border-divider/50 shadow-sm",
        wrapper: "px-4 sm:px-6",
        item: "data-[active=true]:text-primary",
      }}
      height="4rem"
    >
      {/* Left: Brand */}
      <NavbarContent justify="start">
        <NavbarBrand as={Link} href="/" className="gap-2 cursor-pointer">
          <motion.div
            whileHover={{ rotate: [0, -10, 10, -5, 0] }}
            transition={{ duration: 0.5 }}
          >
            <Brush className="h-6 w-6 text-primary" />
          </motion.div>
          <span className="font-bold font-headline text-lg bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
            HYPE
          </span>
        </NavbarBrand>
      </NavbarContent>

      {/* Center: Desktop Nav */}
      <NavbarContent className="hidden md:flex gap-1" justify="center">
        <NavbarItem>
          <Button
            as={Link}
            href="/design-services"
            variant="light"
            size="sm"
            radius="full"
            className="text-default-600 font-medium hover:text-primary"
          >
            Services
          </Button>
        </NavbarItem>
        <NavbarItem>
          <Button
            as={Link}
            href="/portfolio"
            variant="light"
            size="sm"
            radius="full"
            className="text-default-600 font-medium hover:text-primary"
          >
            Portfolio
          </Button>
        </NavbarItem>
        <NavbarItem>
          <Button
            as={Link}
            href="/designers"
            variant="light"
            size="sm"
            radius="full"
            className="text-default-600 font-medium hover:text-primary"
          >
            Designers
          </Button>
        </NavbarItem>
        <NavbarItem>
          <Button
            as={Link}
            href="/blog"
            variant="light"
            size="sm"
            radius="full"
            className="text-default-600 font-medium hover:text-primary"
          >
            Blog
          </Button>
        </NavbarItem>
        <NavbarItem>
          <Divider orientation="vertical" className="h-5 mx-1" />
        </NavbarItem>
        <NavbarItem>
          <Button
            variant="light"
            onPress={toggleAiChat}
            startContent={<Sparkles className="h-4 w-4 text-primary" />}
            className="text-default-600 font-medium hover:text-primary"
            radius="full"
            size="sm"
          >
            Kira AI
          </Button>
        </NavbarItem>
      </NavbarContent>

      {/* Right: Desktop Actions */}
      <NavbarContent justify="end" className="gap-1">
        {/* Cart */}
        <NavbarItem className="hidden md:flex">
          <Button
            as={Link}
            href="/cart"
            isIconOnly
            variant="light"
            radius="full"
            size="sm"
            className="text-default-600 hover:text-primary relative"
          >
            <ShoppingCart className="h-5 w-5" />
            {cartItemCount > 0 && (
              <motion.span
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                className="absolute -top-1 -right-1 bg-danger text-white text-[10px] font-bold rounded-full h-4 w-4 flex items-center justify-center"
              >
                {cartItemCount}
              </motion.span>
            )}
          </Button>
        </NavbarItem>

        {/* Theme Toggle */}
        <NavbarItem className="hidden md:flex">
          <ModeToggle />
        </NavbarItem>

        {/* Auth / Avatar */}
        <NavbarItem className="hidden md:flex">
          {isLoggedIn ? (
            <Dropdown placement="bottom-end">
              <DropdownTrigger>
                <Avatar
                  as="button"
                  isBordered
                  color="primary"
                  size="sm"
                  src="https://placehold.co/100x100.png"
                  name="Client"
                  className="transition-transform hover:scale-105"
                />
              </DropdownTrigger>
              <DropdownMenu aria-label="User menu" variant="flat">
                <DropdownSection showDivider>
                  <DropdownItem key="profile" className="h-14 gap-2" textValue="Client User">
                    <p className="font-semibold">Client User</p>
                    <p className="text-xs text-default-400">client@designhype.in</p>
                  </DropdownItem>
                </DropdownSection>
                <DropdownSection showDivider>
                  <DropdownItem key="dashboard" as={Link} href={getDashboardPath()} textValue="Dashboard">
                    Dashboard
                  </DropdownItem>
                  <DropdownItem key="orders" as={Link} href="/client/orders" textValue="My Orders">
                    My Orders
                  </DropdownItem>
                  <DropdownItem key="settings" as={Link} href="/client/profile" textValue="Settings">
                    Settings
                  </DropdownItem>
                </DropdownSection>
                <DropdownSection>
                  <DropdownItem key="logout" color="danger" onPress={handleLogout} textValue="Log out">
                    Log out
                  </DropdownItem>
                </DropdownSection>
              </DropdownMenu>
            </Dropdown>
          ) : (
            <div className="flex items-center gap-2">
              <Button
                as={Link}
                href="/login"
                variant="light"
                size="sm"
                radius="full"
                startContent={<LogIn className="h-4 w-4" />}
                className="text-default-600 font-medium"
              >
                Login
              </Button>
              <Button
                as={Link}
                href="/signup"
                color="primary"
                size="sm"
                radius="full"
                variant="shadow"
                startContent={<UserPlus className="h-4 w-4" />}
                className="font-medium"
              >
                Sign Up
              </Button>
            </div>
          )}
        </NavbarItem>

        {/* Mobile Toggle */}
        <NavbarMenuToggle
          aria-label={isMobileMenuOpen ? "Close menu" : "Open menu"}
          className="md:hidden text-default-600"
        />
      </NavbarContent>

      {/* Mobile Menu */}
      <NavbarMenu className="pt-6 pb-8 bg-background/95 backdrop-blur-xl gap-4">
        <NavbarMenuItem>
          <Button
            fullWidth
            variant="light"
            className="justify-start text-base py-6 text-default-700"
            startContent={<Sparkles className="h-5 w-5 text-primary" />}
            onPress={() => { toggleAiChat(); setIsMobileMenuOpen(false); }}
            radius="lg"
          >
            Ask Kira AI
          </Button>
        </NavbarMenuItem>
        <NavbarMenuItem>
          <Button
            as={Link}
            href="/services"
            fullWidth
            variant="light"
            className="justify-start text-base py-6 text-default-700"
            startContent={<LayoutGrid className="h-5 w-5" />}
            onPress={() => setIsMobileMenuOpen(false)}
            radius="lg"
          >
            Services
          </Button>
        </NavbarMenuItem>
        <NavbarMenuItem>
          <Button
            as={Link}
            href="/portfolio"
            fullWidth
            variant="light"
            className="justify-start text-base py-6 text-default-700"
            startContent={<Briefcase className="h-5 w-5" />}
            onPress={() => setIsMobileMenuOpen(false)}
            radius="lg"
          >
            Portfolio
          </Button>
        </NavbarMenuItem>
        <NavbarMenuItem>
          <Button
            as={Link}
            href="/blog"
            fullWidth
            variant="light"
            className="justify-start text-base py-6 text-default-700"
            startContent={<Newspaper className="h-5 w-5" />}
            onPress={() => setIsMobileMenuOpen(false)}
            radius="lg"
          >
            Blog
          </Button>
        </NavbarMenuItem>
        <NavbarMenuItem>
          <Button
            as={Link}
            href="/cart"
            fullWidth
            variant="light"
            className="justify-start text-base py-6 text-default-700"
            startContent={<ShoppingCart className="h-5 w-5" />}
            onPress={() => setIsMobileMenuOpen(false)}
            radius="lg"
          >
            Cart {cartItemCount > 0 && `(${cartItemCount})`}
          </Button>
        </NavbarMenuItem>

        <Divider className="my-2" />

        <NavbarMenuItem className="flex items-center justify-between px-3">
          <span className="text-sm text-default-500">Appearance</span>
          <ModeToggle />
        </NavbarMenuItem>

        <Divider className="my-2" />

        {isLoggedIn ? (
          <>
            <NavbarMenuItem>
              <Button
                as={Link}
                href={getDashboardPath()}
                fullWidth
                color="primary"
                variant="flat"
                className="justify-start text-base py-6"
                startContent={<UserCircle className="h-5 w-5" />}
                onPress={() => setIsMobileMenuOpen(false)}
                radius="lg"
              >
                My Dashboard
              </Button>
            </NavbarMenuItem>
            <NavbarMenuItem>
              <Button
                fullWidth
                variant="bordered"
                className="justify-start text-base py-6"
                startContent={<LogIn className="h-5 w-5" />}
                onPress={() => { handleLogout(); setIsMobileMenuOpen(false); }}
                radius="lg"
              >
                Log Out
              </Button>
            </NavbarMenuItem>
          </>
        ) : (
          <>
            <NavbarMenuItem>
              <Button
                as={Link}
                href="/login"
                fullWidth
                color="primary"
                variant="flat"
                className="justify-start text-base py-6"
                startContent={<LogIn className="h-5 w-5" />}
                onPress={() => setIsMobileMenuOpen(false)}
                radius="lg"
              >
                Login
              </Button>
            </NavbarMenuItem>
            <NavbarMenuItem>
              <Button
                as={Link}
                href="/signup"
                fullWidth
                color="primary"
                variant="shadow"
                className="justify-start text-base py-6"
                startContent={<UserPlus className="h-5 w-5" />}
                onPress={() => setIsMobileMenuOpen(false)}
                radius="lg"
              >
                Sign Up
              </Button>
            </NavbarMenuItem>
          </>
        )}
      </NavbarMenu>
    </HeroNavbar>
  );
}
