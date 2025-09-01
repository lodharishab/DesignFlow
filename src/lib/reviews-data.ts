
export interface DesignerReview {
  id: string;
  orderId: string;
  clientName: string;
  clientAvatarUrl: string;
  clientAvatarHint: string;
  serviceName: string;
  category: string;
  rating: number; // 1-5
  reviewText?: string;
  reviewDate: Date;
  isFeatured?: boolean;
  isReported?: boolean; // New field
}

export const mockDesignerReviews: DesignerReview[] = [
  { id: 'rev001', orderId: 'ORD2945S', clientName: 'Sunita Rao', clientAvatarUrl: 'https://placehold.co/100x100.png', clientAvatarHint: 'woman corporate', serviceName: 'Startup Logo & Brand Identity', category: 'Logo & Branding', rating: 5, reviewText: 'Priya was absolutely amazing! She understood the vision for SwasthyaLink perfectly and delivered a brand identity that exceeded all our expectations. The process was smooth and collaborative. Highly recommend!', reviewDate: new Date(2024, 6, 14), isFeatured: true, isReported: false },
  { id: 'rev002', orderId: 'ORDXXXX1', clientName: 'Arun Kumar', clientAvatarUrl: 'https://placehold.co/100x100.png', clientAvatarHint: 'man startup founder', serviceName: 'E-commerce Website UI/UX', category: 'Web UI/UX', rating: 4, reviewText: 'The UI design was clean and modern. There were some minor delays but the end result was great and Priya was very responsive to feedback.', reviewDate: new Date(2024, 6, 12), isFeatured: false, isReported: false },
  { id: 'rev004', orderId: 'ORDXXXX3', clientName: 'Vijay Patil', clientAvatarUrl: 'https://placehold.co/100x100.png', clientAvatarHint: 'man small business owner', serviceName: 'Modern Logo Design', category: 'Logo & Branding', rating: 5, reviewText: 'Fantastic work on the logo. Quick turnaround and very creative.', reviewDate: new Date(2024, 6, 10), isFeatured: false, isReported: true },
  { id: 'rev005', orderId: 'ORDYYYY1', clientName: 'Rina Desai', clientAvatarUrl: 'https://placehold.co/100x100.png', clientAvatarHint: 'woman professional', serviceName: 'Social Media Campaign Graphics', category: 'Social Media', rating: 5, reviewText: 'The festival creatives were vibrant and perfect for our target audience. We saw a great engagement boost. Will definitely work with Priya again!', reviewDate: new Date(2024, 5, 18), isFeatured: true, isReported: false },
  { id: 'rev006', orderId: 'ORDZZZZ2', clientName: 'Amit Singh', clientAvatarUrl: 'https://placehold.co/100x100.png', clientAvatarHint: 'man entrepreneur', serviceName: 'Business Card Design', category: 'Print Design', rating: 4, reviewText: 'The business cards were high quality and delivered on time. The design was professional and exactly what we asked for.', reviewDate: new Date(2024, 4, 25), isFeatured: false, isReported: false },
];
