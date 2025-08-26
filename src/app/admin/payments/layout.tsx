
// This is an empty layout file. 
// It can be used to wrap the payments section if a specific layout is needed in the future.
// For now, it just passes the children through.

import React from 'react';

export default function PaymentsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
