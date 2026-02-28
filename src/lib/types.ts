export interface PortfolioItem {
  _id?: string;
  id: string;
  designerId?: string;
  title: string;
  category: string;
  categorySlug: string;
  clientName?: string;
  projectDate?: string;
  coverImageUrl: string;
  coverImageHint: string;
  projectDescription: string;
  galleryImages: Array<{ url: string; hint: string; caption?: string }>;
  tags?: string[];
  views?: number;
  likes?: number;
  designer?: {
    id: string;
    slug: string;
    name: string;
    avatarUrl?: string;
    imageHint?: string;
  };
}

export interface BlogPost {
  _id?: string;
  id: string;
  title: string;
  excerpt: string;
  content: string;
  authorName: string;
  authorId?: string;
  authorAvatarUrl?: string;
  authorAvatarHint?: string;
  publishDate: Date;
  status: 'Published' | 'Draft' | 'Scheduled';
  featuredImageUrl: string;
  featuredImageHint: string;
  category?: string;
  categorySlug?: string;
  tags?: string[];
  views?: number;
  likes?: number;
  comments?: number;
}

export interface BrandProfileFormData {
  [key: string]: any;
  id: string;
  companyName: string;
  companyWebsite: string;
  industry: string;
  companySize: string;
  targetAudience: string;
  brandValues: string;
  tags?: string[];
  preferredDesignStyle: string;
  colorsToUse: string;
  colorsToAvoid: string;
  notesForDesigners: string;
  communicationPreference: string;
  feedbackStyle: string;
  brandGuidelinesLink: string;
  existingAssetsLink: string;
  logoUrl?: string | null;
  projectTypes: string[];
  isFavorite?: boolean;
}

export interface CartItem {
  id: string;
  userId: string;
  serviceId?: string;
  tierId?: string;
  name: string;
  tierName?: string;
  price: number;
  imageUrl?: string;
  imageHint?: string;
  quantity: number;
}

export interface DesignerProfile {
  id: string;
  slug: string;
  name: string;
  email?: string;
  avatarUrl: string;
  imageHint: string;
  bio: string;
  specialties: string[];
  location?: string;
  memberSince?: Date;
  website?: string;
  socialLinks?: { platform: string; url: string }[];
  profileCompletenessScore?: number;
  adminRanking?: number;
  clientRatingAverage?: number | null;
  clientRatingCount?: number;
  overallRanking?: number;
  badges?: ('Top Rated' | 'Rising Talent' | 'On-Time Delivery' | 'Verified')[];
  status?: string;
  servicesApproved?: number;
  portfolioLink?: string;
}

export interface Dispute {
  id: string;
  orderId: string;
  designerId?: string;
  serviceName?: string;
  servicePrice?: number;
  orderDeadline?: Date;
  clientName?: string;
  disputeType: string;
  status: string;
  lastUpdated: Date;
  clientClaim?: string;
  designerResponse?: string;
  adminNotes?: string;
  timeline?: DisputeTimelineEvent[];
}

export interface DisputeTimelineEvent {
  id: string;
  disputeId: string;
  actor: string;
  action: string;
  timestamp: Date;
}

export interface Conversation {
  id: string;
  orderId?: string;
  participantOneId?: string;
  participantTwoId?: string;
  participantOneName?: string;
  participantTwoName?: string;
  participantOneAvatarUrl?: string;
  participantTwoAvatarUrl?: string;
  participantOneAvatarHint?: string;
  participantTwoAvatarHint?: string;
  lastMessage?: string;
  lastMessageTimestamp?: Date;
  lastReadTimestampOne?: Date;
  lastReadTimestampTwo?: Date;
  unreadCountOne: number;
  unreadCountTwo: number;
  isPinnedOne: boolean;
  isPinnedTwo: boolean;
  isArchived: boolean;
  isMuted: boolean;
  messages?: Message[];
  sharedFiles?: ChatFile[];
}

export interface Message {
  id: string;
  conversationId: string;
  senderId?: string;
  senderRole?: string;
  text?: string;
  timestamp: Date;
  status: string;
  isPinned: boolean;
  fileUrl?: string;
  fileName?: string;
  fileSize?: number;
  fileType?: string;
}

export interface ChatFile {
  id: string;
  conversationId: string;
  name: string;
  size?: number;
  type?: string;
  url: string;
  timestamp: Date;
}

export interface Notification {
  id: string;
  userId: string;
  type: string;
  title: string;
  message?: string;
  relatedOrderId?: string;
  relatedPortfolioId?: string;
  priority: string;
  isRead: boolean;
  isArchived: boolean;
  createdAt: Date;
}

export type OrderStatus = 'Pending Assignment' | 'In Progress' | 'Awaiting Client Review' | 'Revision Requested' | 'Completed' | 'Cancelled' | 'Refunded';

export interface OrderEvent {
  id: string;
  orderId: string;
  timestamp: Date;
  event: string;
  actor?: string;
  notes?: string;
}

export interface Milestone {
  id: string;
  orderId: string;
  title: string;
  dueDate?: Date;
  amount?: number;
  status: string;
}

export interface OrderAttachment {
  id: string;
  orderId: string;
  name: string;
  url: string;
  type?: string;
  submittedAt?: Date;
}

export interface Order {
  id: string;
  clientName: string;
  clientId?: string;
  designerName?: string;
  designerId?: string;
  serviceName: string;
  serviceId?: string;
  serviceTier?: string;
  serviceScope?: string[];
  orderDate: Date;
  dueDate?: Date;
  status: OrderStatus;
  totalAmount: number;
  currency: string;
  paymentMethod?: string;
  transactionId?: string;
  clientBrief?: string;
  briefAttachments?: Array<{ name: string; url: string; type: string }>;
  deliverables?: Array<{ name: string; url: string; submittedAt: string }>;
  revisionNotes?: string;
  revisionRequestDate?: Date;
  revisionsAllowed: number;
  revisionsUsed: number;
  privateNotes?: string;
  privateNotesLastEdited?: Date;
  orderEvents: OrderEvent[];
  milestones?: Milestone[];
}

export interface PortfolioItemRecord extends Omit<PortfolioItem, '_id' | 'id'> {
  _id?: string;
  id: string;
  designerId: string;
}

export type ReportStatus = 'Open' | 'In Progress' | 'Resolved';

export interface Report {
  id: string;
  orderId?: string;
  reporterId?: string;
  reporterName: string;
  reportedUserId?: string;
  reportedUserName?: string;
  subject: string;
  details?: string;
  reportDate: Date;
  status: ReportStatus;
}

export interface DesignerReview {
  id: string;
  orderId: string;
  clientName: string;
  clientAvatarUrl: string;
  clientAvatarHint: string;
  serviceName: string;
  category: string;
  rating: number;
  reviewText?: string;
  reviewDate: Date;
  isFeatured?: boolean;
  isReported?: boolean;
  revisions: number;
}

export interface AdminReview {
  id: string;
  orderId: string;
  authorName: string;
  authorRole: string;
  recipientName: string;
  serviceName: string;
  rating: number;
  reviewText?: string;
  reviewDate: Date;
  status: 'Pending' | 'Approved' | 'Hidden';
}

export interface ServiceTierData {
  id: string;
  serviceId: string;
  name: string;
  price: number;
  description?: string;
  deliveryTimeMin?: number;
  deliveryTimeMax?: number;
  deliveryTimeUnit?: string;
  scope?: string[];
  iconName?: string;
}

export interface ServiceData {
  id: string;
  name: string;
  generalDescription?: string;
  longDescription?: string;
  category?: string;
  categorySlug?: string;
  tags?: string[];
  imageUrl?: string;
  imageHint?: string;
  status: string;
  tiers: ServiceTierData[];
}

export interface ServiceCategory {
  id: string;
  name: string;
  description?: string;
  slug?: string;
  serviceCount?: number;
}

export interface ServiceSubCategory {
  id: string;
  name: string;
  description?: string;
  parentCategoryId?: string;
  parentCategoryName?: string;
  slug?: string;
  serviceCount?: number;
}

export interface SiteSettings {
  id: string;
  platformName: string;
  contactEmail?: string;
  defaultCurrency: string;
  allowClientRegistrations: boolean;
  allowDesignerRegistrations: boolean;
  termsUrl?: string;
  privacyUrl?: string;
  enableMemberships: boolean;
  clientBasicPlanName?: string;
  clientBasicPlanPrice?: string;
  clientPremiumPlanName?: string;
  clientPremiumPlanPrice?: string;
  designerBasicPlanName?: string;
  designerBasicPlanPrice?: string;
  designerProPlanName?: string;
  designerProPlanPrice?: string;
  enableFreeTrial: boolean;
  trialDurationDays: number;
  adminNotificationEmail?: string;
  stripeApiKey?: string;
  paypalClientId?: string;
}

export interface AuditLog {
  id: string;
  action: string;
  actorId?: string;
  actorName?: string;
  targetType?: string;
  targetId?: string;
  targetName?: string;
  timestamp: Date;
  notes?: string;
}

export interface Transaction {
  id: string;
  orderId?: string;
  userId?: string;
  date: Date;
  type: string;
  status: string;
  amount: number;
  description?: string;
  paymentMethod?: string;
  clientName?: string;
  designerName?: string;
}

export interface PayoutRequest {
  id: string;
  designerId?: string;
  orderId?: string;
  orderName?: string;
  amount: number;
  reason?: string;
  status: string;
  requestDate: Date;
  repaidAmount: number;
}

export interface PaymentMethod {
  id: string;
  userId: string;
  userName?: string;
  userRole?: string;
  methodType: string;
  identifier: string;
  isPrimary: boolean;
  status: string;
  lastUpdated: Date;
}

export interface User {
  id: string;
  name: string;
  email: string;
  mobileNumber?: string;
  roles: string[];
  avatarUrl?: string;
  avatarHint?: string;
  joinDate: Date;
  lastLogin: Date | null;
  status: string;
  phone?: string;
  staffRole?: string;
}
