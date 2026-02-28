
'use server';

import { revalidatePath } from 'next/cache';
import { updateReportStatus, type Report } from '@/lib/reports-db';

export interface ReportActionResult {
  success: boolean;
  message: string;
  report?: Report;
}

export async function updateReportStatusAction(reportId: string, newStatus: Report['status']): Promise<ReportActionResult> {
  console.log(`Updating report ${reportId} to status ${newStatus}`);
  
  try {
    await updateReportStatus(reportId, newStatus);
    revalidatePath('/admin/reports');
    return { success: true, message: "Status updated successfully." };
  } catch (e) {
    console.error('Error updating report status:', e);
    return { success: false, message: "Failed to update report status." };
  }
}
