
"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Hourglass, LogOut, Home, Brush } from "lucide-react";
import Link from "next/link";

export default function DesignerPendingApprovalPage() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-secondary to-background p-4">
      <Link href="/" className="mb-8 flex items-center space-x-2">
        <Brush className="h-8 w-8 text-primary" />
        <span className="font-bold font-headline text-3xl">HYPE</span>
      </Link>
      <Card className="w-full max-w-lg shadow-xl">
        <CardHeader className="items-center text-center">
          <Hourglass className="h-16 w-16 text-primary mb-4" />
          <CardTitle className="font-headline text-2xl">Application Pending Review</CardTitle>
          <CardDescription className="mt-2">
            Thank you for your interest in joining HYPE as a designer!
            <br />
            Your application is currently under review by our admin team.
          </CardDescription>
        </CardHeader>
        <CardContent className="text-center">
          <p className="text-muted-foreground mb-2">
            We&apos;ll notify you via email once your application has been processed.
            This usually takes 1-2 business days.
          </p>
          <p className="text-muted-foreground">
            In the meantime, you can explore our platform or log out.
          </p>
        </CardContent>
        <CardFooter className="flex flex-col space-y-3 pt-6 sm:flex-row sm:space-y-0 sm:space-x-3">
          <Button className="w-full sm:w-auto" asChild>
            <Link href="/">
              <Home className="mr-2 h-4 w-4" />
              Return to Homepage
            </Link>
          </Button>
          <Button variant="outline" className="w-full sm:w-auto" asChild>
            {/* For prototype, logout could just go to homepage or login */}
            <Link href="/login">
              <LogOut className="mr-2 h-4 w-4" />
              Log Out
            </Link>
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
}
