
export type DisputeStatus = 'Open' | 'Under Review' | 'Resolved (Client Favor)' | 'Resolved (Designer Favor)' | 'Closed';
export type DisputeType = 'Deliverable Quality' | 'Non-Delivery' | 'Communication Issue' | 'Scope Creep';

export interface Dispute {
  id: string;
  orderId: string;
  clientName: string;
  disputeType: DisputeType;
  status: DisputeStatus;
  lastUpdated: Date;
}

export const mockDisputesData: Dispute[] = [
    {
        id: 'DISP-001',
        orderId: 'ORD7361P',
        clientName: 'Priya Sharma',
        disputeType: 'Deliverable Quality',
        status: 'Under Review',
        lastUpdated: new Date(new Date().setDate(new Date().getDate() - 2)),
    },
    {
        id: 'DISP-002',
        orderId: 'ORD4011M',
        clientName: 'Mohan Das',
        disputeType: 'Scope Creep',
        status: 'Open',
        lastUpdated: new Date(new Date().setHours(new Date().getHours() - 5)),
    },
    {
        id: 'DISP-003',
        orderId: 'ORD2945S',
        clientName: 'Sunita Rao',
        disputeType: 'Deliverable Quality',
        status: 'Resolved (Designer Favor)',
        lastUpdated: new Date(new Date().setDate(new Date().getDate() - 10)),
    },
    {
        id: 'DISP-004',
        orderId: 'ORDXXXX',
        clientName: 'Old Client',
        disputeType: 'Non-Delivery',
        status: 'Resolved (Client Favor)',
        lastUpdated: new Date(new Date().setMonth(new Date().getMonth() - 1)),
    },
    {
        id: 'DISP-005',
        orderId: 'ORDYYYY',
        clientName: 'Another Client',
        disputeType: 'Communication Issue',
        status: 'Closed',
        lastUpdated: new Date(new Date().setMonth(new Date().getMonth() - 2)),
    },
];
