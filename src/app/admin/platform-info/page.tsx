
"use client";

import { redirect } from 'next/navigation';

export default function PlatformInfoPage() {
  // Redirect the base platform-info page to the README page by default.
  redirect('/admin/platform-info/readme');

  // You can return null or a loading indicator, but redirect is cleaner.
  return null;
}
