
export interface Report {
  id: string;
  orderId?: string; // Optional, if the report is about a specific order
  reporterId: string;
  reporterName: string;
  reportedUserId?: string; // Optional, if reporting a specific user
  reportedUserName?: string;
  subject: string;
  details: string;
  reportDate: Date;
  status: 'Open' | 'In Progress' | 'Resolved';
}

export const mockReportsData: Report[] = [
  { 
    id: 'REP001', 
    orderId: 'ORD7361P',
    reporterId: 'CLI001P',
    reporterName: 'Priya Sharma',
    reportedUserId: 'des002',
    reportedUserName: 'Rohan Kapoor',
    subject: 'Significant Delay in Project Delivery',
    details: 'The project deadline was yesterday and I have not received the final deliverables or any update from the designer. I have tried messaging them multiple times without a response. Please look into this.',
    reportDate: new Date(2024, 6, 12),
    status: 'Open',
  },
  { 
    id: 'REP002', 
    reporterId: 'des003',
    reporterName: 'Aisha Khan',
    reportedUserId: 'CLI004S',
    reportedUserName: 'Sunita Rao',
    subject: 'Client is asking for work outside the agreed scope',
    details: 'The client for order ORD2945S is requesting additional logo variations and a full stationery set, which was not part of the premium package they purchased. I have explained this but they are insisting. Need help mediating.',
    reportDate: new Date(2024, 6, 10),
    status: 'In Progress',
  },
  { 
    id: 'REP003', 
    reporterId: 'CLI003K',
    reporterName: 'Rajesh Kumar',
    subject: 'Issue with payment page',
    details: 'I was trying to place a new order, but the payment page seems to be stuck in a loading loop. I tried clearing my cache and using a different browser, but the issue persists.',
    reportDate: new Date(2024, 6, 8),
    status: 'Resolved',
  },
];
