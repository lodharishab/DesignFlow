
import React from 'react';

// This layout ensures the nested routes are handled correctly under /designer/earnings
export default function EarningsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
