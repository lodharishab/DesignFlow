
export interface Review {
  id: string;
  orderId: string;
  authorName: string;
  authorRole: 'Client' | 'Designer';
  recipientName: string;
  serviceName: string;
  rating: number; // 1-5
  reviewText?: string;
  reviewDate: Date;
  status: 'Pending' | 'Approved' | 'Hidden';
}

export const mockReviewsData: Review[] = [
  { id: 'rev001', orderId: 'ORD2945S', authorName: 'Sunita Rao', authorRole: 'Client', recipientName: 'Priya Sharma', serviceName: 'Startup Logo & Brand Identity', rating: 5, reviewText: 'Priya was absolutely amazing! She understood the vision for SwasthyaLink perfectly and delivered a brand identity that exceeded all our expectations. The process was smooth and collaborative. Highly recommend!', reviewDate: new Date(2024, 6, 14), status: 'Approved' },
  { id: 'rev002', orderId: 'ORDXXXX1', authorName: 'Arun Kumar', authorRole: 'Client', recipientName: 'Rohan Kapoor', serviceName: 'E-commerce Website UI/UX', rating: 4, reviewText: 'The UI design was clean and modern. There were some minor delays but the end result was great and Rohan was very responsive to feedback.', reviewDate: new Date(2024, 6, 12), status: 'Approved' },
  { id: 'rev003', orderId: 'ORDXXXX2', authorName: 'Kavita Singh', authorRole: 'Client', recipientName: 'Aisha Khan', serviceName: 'Social Media Campaign', rating: 3, reviewText: '', reviewDate: new Date(2024, 6, 11), status: 'Pending' },
  { id: 'rev004', orderId: 'ORDXXXX3', authorName: 'Vijay Patil', authorRole: 'Client', recipientName: 'Priya Sharma', serviceName: 'Modern Logo Design', rating: 5, reviewText: 'Fantastic work on the logo. Quick turnaround and very creative.', reviewDate: new Date(2024, 6, 10), status: 'Hidden' },
  { id: 'rev005', orderId: 'ORD2945S', authorName: 'Priya Sharma', authorRole: 'Designer', recipientName: 'Sunita Rao', serviceName: 'Startup Logo & Brand Identity', rating: 5, reviewText: 'Sunita was a pleasure to work with. She provided a clear and detailed brief, was very communicative, and offered constructive feedback. A fantastic client!', reviewDate: new Date(2024, 6, 15), status: 'Pending' },
];
