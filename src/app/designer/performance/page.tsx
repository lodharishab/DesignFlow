import { redirect } from 'next/navigation';

// Redirect to the reviews sub-page since /designer/performance has no index content
export default function DesignerPerformancePage() {
  redirect('/designer/performance/reviews');
}
