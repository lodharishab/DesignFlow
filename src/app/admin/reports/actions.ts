
'use server';

import { revalidatePath } from 'next/cache';
import { mockReportsData } from './data';
import type { Report } from './data';

export interface ReportActionResult {
  success: boolean;
  message: string;
  report?: Report;
}

export async function updateReportStatusAction(reportId: string, newStatus: Report['status']): Promise<ReportActionResult> {
  // This is a simulation. In a real app, you would update the database.
  console.log(`Simulating update for report ${reportId} to status ${newStatus}`);
  
  const reportIndex = mockReportsData.findIndex(r => r.id === reportId);
  if (reportIndex === -1) {
    return { success: false, message: "Report not found." };
  }
  
  mockReportsData[reportIndex].status = newStatus;
  
  revalidatePath('/admin/reports');
  
  return { success: true, message: "Status updated successfully." };
}
