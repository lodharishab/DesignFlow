
export type DisputeStatus = 'Open' | 'Under Review' | 'Resolved (Client Favor)' | 'Resolved (Designer Favor)' | 'Closed';
export type DisputeType = 'Deliverable Quality' | 'Non-Delivery' | 'Communication Issue' | 'Scope Creep';

export interface TimelineEvent {
    actor: 'Client' | 'Designer' | 'Admin';
    action: string;
    timestamp: Date;
}

export interface Dispute {
  id: string;
  orderId: string;
  serviceName: string;
  servicePrice: number;
  orderDeadline: Date;
  clientName: string;
  disputeType: DisputeType;
  status: DisputeStatus;
  lastUpdated: Date;
  clientClaim: string;
  designerResponse?: string;
  adminNotes?: string;
  timeline: TimelineEvent[];
}

export const mockDisputesData: Dispute[] = [
    {
        id: 'DISP-001',
        orderId: 'ORD7361P',
        serviceName: 'E-commerce Website UI/UX',
        servicePrice: 24999,
        orderDeadline: new Date('2024-07-28'),
        clientName: 'Priya Sharma',
        disputeType: 'Deliverable Quality',
        status: 'Under Review',
        lastUpdated: new Date(new Date().setDate(new Date().getDate() - 2)),
        clientClaim: "The final designs delivered do not match the approved mockups. The color palette is completely different and several key UI elements are missing. This is not what we agreed upon.",
        designerResponse: "I followed the feedback from the last revision round which requested a 'bolder' color scheme. The missing elements were discussed as post-launch additions. I am happy to make adjustments to the colors as part of a final revision.",
        adminNotes: "Reviewing both parties' claims. Initial assessment suggests a communication gap. Mediating a final revision round.",
        timeline: [
            { actor: 'Client', action: 'Dispute opened for "Deliverable Quality".', timestamp: new Date(new Date().setDate(new Date().getDate() - 4)) },
            { actor: 'Admin', action: 'Acknowledged dispute, requested designer response.', timestamp: new Date(new Date().setDate(new Date().getDate() - 4)) },
            { actor: 'Designer', action: 'Submitted response to the dispute claim.', timestamp: new Date(new Date().setDate(new Date().getDate() - 3)) },
            { actor: 'Admin', action: 'Dispute status changed to "Under Review".', timestamp: new Date(new Date().setDate(new Date().getDate() - 2)) },
        ]
    },
    {
        id: 'DISP-002',
        orderId: 'ORD4011M',
        serviceName: 'Mobile App Icon Set',
        servicePrice: 4999,
        orderDeadline: new Date('2024-07-15'),
        clientName: 'Mohan Das',
        disputeType: 'Scope Creep',
        status: 'Open',
        lastUpdated: new Date(new Date().setHours(new Date().getHours() - 5)),
        clientClaim: "Designer is refusing to provide icons in SVG format, but this is a standard format for icons. They are trying to charge extra for it.",
        designerResponse: "The 'Basic' tier purchased by the client specifies delivery in PNG format only. SVG source files are part of the 'Standard' tier. I have offered an upgrade path.",
        adminNotes: "Awaiting review.",
        timeline: [
             { actor: 'Client', action: 'Dispute opened for "Scope Creep".', timestamp: new Date(new Date().setHours(new Date().getHours() - 5)) },
        ]
    },
    {
        id: 'DISP-003',
        orderId: 'ORD2945S',
        serviceName: 'Startup Logo & Brand Identity',
        servicePrice: 19999,
        orderDeadline: new Date('2024-06-15'),
        clientName: 'Sunita Rao',
        disputeType: 'Deliverable Quality',
        status: 'Resolved (Designer Favor)',
        lastUpdated: new Date(new Date().setDate(new Date().getDate() - 10)),
        clientClaim: "The final logo files are not usable for my printer.",
        designerResponse: "Provided standard vector files (AI, EPS, SVG) as per the service scope. Advised the client to check with their printer for specific requirements, but received no response before the dispute was filed. The files are industry-standard.",
        adminNotes: "Designer provided industry-standard files as per the service agreement. Client did not specify non-standard requirements. No fault on the designer's part. Case closed.",
        timeline: [
            { actor: 'Client', action: 'Dispute opened.', timestamp: new Date(new Date().setDate(new Date().getDate() - 15)) },
            { actor: 'Admin', action: 'Investigation started.', timestamp: new Date(new Date().setDate(new Date().getDate() - 14)) },
            { actor: 'Admin', action: 'Final decision reached. Resolved in favor of the designer.', timestamp: new Date(new Date().setDate(new Date().getDate() - 10)) },
        ]
    },
];
