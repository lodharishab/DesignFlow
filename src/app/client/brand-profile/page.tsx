
"use client";

import { redirect } from 'next/navigation';

export default function OldBrandProfilePage() {
  // This page is now deprecated. Redirect to the new brand profiles listing page.
  redirect('/client/brand-profiles');

  return null;
}
