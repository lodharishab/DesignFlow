/**
 * Database Seed Script
 *
 * Populates all 28 tables with the demo data that was previously hardcoded
 * across the codebase. Run with: npm run db:seed
 *
 * Usage:  npx tsx src/lib/seed.ts
 */
import { neon } from '@neondatabase/serverless';
import { drizzle } from 'drizzle-orm/neon-http';
import { sql } from 'drizzle-orm';
import * as schema from './schema';

// ---------------------------------------------------------------------------
// Connection
// ---------------------------------------------------------------------------
const connectionString = process.env.DATABASE_URL || process.env.REPLIT_DB_URL;
if (!connectionString) {
  console.error('❌  DATABASE_URL is not set');
  process.exit(1);
}
const client = neon(connectionString);
const db = drizzle(client, { schema });

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------
function d(y: number, m: number, day: number, h = 0, min = 0): Date {
  return new Date(y, m, day, h, min);
}
function daysAgo(n: number): Date {
  const dt = new Date();
  dt.setDate(dt.getDate() - n);
  return dt;
}

// ---------------------------------------------------------------------------
// 1. Users
// ---------------------------------------------------------------------------
const usersData: (typeof schema.users.$inferInsert)[] = [
  { id: 'usr001', name: 'Priya Sharma', email: 'priya.sharma@example.in', mobileNumber: '9820098200', roles: ['Client'], avatarUrl: 'https://placehold.co/40x40.png', avatarHint: 'indian woman client', joinDate: d(2023,0,15), lastLogin: d(2024,5,1), status: 'Active' },
  { id: 'des002', name: 'Rohan Kapoor', email: 'rohan.designer@example.in', mobileNumber: '9987654321', roles: ['Designer'], avatarUrl: 'https://placehold.co/40x40.png', avatarHint: 'indian man designer', joinDate: d(2022,11,5), lastLogin: d(2024,5,3), status: 'Active' },
  { id: 'usr003', name: 'Aarav Patel', email: 'aarav.patel@example.in', mobileNumber: '9765432109', roles: ['Client','Designer'], avatarUrl: 'https://placehold.co/40x40.png', avatarHint: 'indian person avatar', joinDate: d(2023,2,20), lastLogin: d(2024,4,28), status: 'Suspended' },
  { id: 'staff001', name: 'Aditi Singh', email: 'aditi.admin@example.in', mobileNumber: '9654321098', roles: ['Admin'], avatarUrl: 'https://placehold.co/40x40.png', avatarHint: 'indian woman admin', joinDate: d(2022,5,10), lastLogin: d(2024,5,4), status: 'Active', staffRole: 'Admin' },
  { id: 'usr005', name: 'Vikram Kumar', email: 'vikram.guest@example.in', mobileNumber: '9500195001', roles: ['Guest'], avatarUrl: 'https://placehold.co/40x40.png', avatarHint: 'indian man silhouette', joinDate: d(2024,0,1), lastLogin: null, status: 'Active' },
  { id: 'usr006', name: 'Sneha Reddy', email: 'sneha.client@example.in', mobileNumber: '9123456789', roles: ['Client'], avatarUrl: 'https://placehold.co/40x40.png', avatarHint: 'indian woman professional', joinDate: d(2023,4,12), lastLogin: d(2024,5,2), status: 'Active' },
  { id: 'des007', name: 'Arjun Desai', email: 'arjun.creator@example.in', mobileNumber: '9234567890', roles: ['Designer'], avatarUrl: 'https://placehold.co/40x40.png', avatarHint: 'indian man creative', joinDate: d(2023,7,22), lastLogin: d(2024,4,30), status: 'Active' },
  { id: 'usr008', name: 'Meera Iyer', email: 'meera.iyer@example.in', mobileNumber: '9345678901', roles: ['Client'], avatarUrl: 'https://placehold.co/40x40.png', avatarHint: 'indian woman customer', joinDate: d(2024,1,5), lastLogin: d(2024,5,5), status: 'Active' },
  { id: 'des009', name: 'Karan Malhotra', email: 'karan.m@example.in', mobileNumber: '9456789012', roles: ['Designer','Admin'], avatarUrl: 'https://placehold.co/40x40.png', avatarHint: 'indian man business', joinDate: d(2022,8,1), lastLogin: d(2024,5,4), status: 'Suspended' },
  { id: 'usr010', name: 'Deepika Rao', email: 'deepika.rao@example.in', mobileNumber: '9567890123', roles: ['Client'], avatarUrl: 'https://placehold.co/40x40.png', avatarHint: 'indian woman corporate', joinDate: d(2023,10,30), lastLogin: d(2024,5,1), status: 'Active' },
  // Additional client IDs referenced in orders
  { id: 'CLI001P', name: 'Priya Sharma (Client)', email: 'priya.client@example.in', mobileNumber: '9820098201', roles: ['Client'], avatarUrl: 'https://placehold.co/40x40.png', avatarHint: 'indian woman', joinDate: d(2023,0,15), status: 'Active' },
  { id: 'CLI003K', name: 'Rajesh Kumar', email: 'rajesh.kumar@example.in', mobileNumber: '9111223344', roles: ['Client'], avatarUrl: 'https://placehold.co/40x40.png', avatarHint: 'indian man', joinDate: d(2023,3,1), status: 'Active' },
  { id: 'CLI004S', name: 'Sunita Rao', email: 'sunita.rao@example.in', mobileNumber: '9222334455', roles: ['Client'], avatarUrl: 'https://placehold.co/40x40.png', avatarHint: 'indian woman', joinDate: d(2023,1,10), status: 'Active' },
  { id: 'CLI005V', name: 'Vikram Mehta', email: 'vikram.mehta@example.in', mobileNumber: '9333445566', roles: ['Client'], avatarUrl: 'https://placehold.co/40x40.png', avatarHint: 'indian man', joinDate: d(2023,5,1), status: 'Active' },
  { id: 'CLI006A', name: 'Anjali Iyer', email: 'anjali.iyer@example.in', mobileNumber: '9444556677', roles: ['Client'], avatarUrl: 'https://placehold.co/40x40.png', avatarHint: 'indian woman', joinDate: d(2023,4,20), status: 'Active' },
  { id: 'CLI007M', name: 'Mohan Das', email: 'mohan.das@example.in', mobileNumber: '9555667788', roles: ['Client'], avatarUrl: 'https://placehold.co/40x40.png', avatarHint: 'indian man', joinDate: d(2023,2,15), status: 'Active' },
  { id: 'CLI008R', name: 'Riya Sen', email: 'riya.sen@example.in', mobileNumber: '9666778899', roles: ['Client'], avatarUrl: 'https://placehold.co/40x40.png', avatarHint: 'indian woman', joinDate: d(2023,3,10), status: 'Active' },
  // Designer user records (needed for FK references from payment_methods, notifications, reports)
  { id: 'des001', name: 'Priya Sharma (Designer)', email: 'priya.des@example.in', roles: ['Designer'], avatarUrl: 'https://placehold.co/40x40.png', avatarHint: 'indian woman designer', joinDate: d(2022,5,10), lastLogin: d(2024,5,3), status: 'Active' },
  { id: 'des003', name: 'Aisha Khan', email: 'aisha.khan@example.in', roles: ['Designer'], avatarUrl: 'https://placehold.co/40x40.png', avatarHint: 'indian woman', joinDate: d(2023,1,20), lastLogin: d(2024,5,2), status: 'Active' },
  { id: 'des004', name: 'Vikram Singh', email: 'vikram.singh@example.in', roles: ['Designer'], avatarUrl: 'https://placehold.co/40x40.png', avatarHint: 'indian man', joinDate: d(2020,10,5), lastLogin: d(2024,4,30), status: 'Active' },
  { id: 'des005', name: 'Sunita Reddy', email: 'sunita.reddy@example.in', roles: ['Designer'], avatarUrl: 'https://placehold.co/40x40.png', avatarHint: 'indian woman', joinDate: d(2022,2,18), lastLogin: d(2024,4,28), status: 'Active' },
  { id: 'des006', name: 'Arjun Mehta', email: 'arjun.mehta@example.in', roles: ['Designer'], avatarUrl: 'https://placehold.co/40x40.png', avatarHint: 'indian man', joinDate: d(2021,11,30), lastLogin: d(2024,5,1), status: 'Active' },
  // Admin/staff user for audit logs
  { id: 'admin001', name: 'Admin User', email: 'admin@designhype.in', roles: ['Admin'], avatarUrl: 'https://placehold.co/40x40.png', avatarHint: 'admin', joinDate: d(2022,0,1), lastLogin: d(2024,5,4), status: 'Active', staffRole: 'Admin' },
  { id: 'admin002', name: 'Super Admin', email: 'super.admin@designhype.in', roles: ['Super Admin'], avatarUrl: 'https://placehold.co/40x40.png', avatarHint: 'admin', joinDate: d(2022,0,1), lastLogin: d(2024,5,4), status: 'Active', staffRole: 'Super Admin' },
];

// ---------------------------------------------------------------------------
// 2. Designer Profiles
// ---------------------------------------------------------------------------
const designerProfilesData: (typeof schema.designerProfiles.$inferInsert)[] = [
  { id: 'des001', slug: 'priya-sharma', name: 'Priya Sharma', email: 'priya.sharma@example.in', avatarUrl: 'https://placehold.co/150x150.png', imageHint: 'indian woman designer smiling', bio: 'Priya is a creative visionary from Mumbai with over 7 years of experience specializing in brand identity, web UI/UX, and illustrative design.', specialties: ['Logo Design','Web UI/UX','Branding','Illustration','Icon Design'], location: 'Mumbai, India', memberSince: d(2022,5,10), website: 'https://example.com/priyasharma', socialLinks: [{platform:'Behance',url:'#'},{platform:'Instagram',url:'#'}], profileCompletenessScore: 95, adminRanking: 5, clientRatingAverage: '4.80', clientRatingCount: 23, overallRanking: 5, badges: ['Top Rated','On-Time Delivery','Verified'], status: 'Active', servicesApproved: 7 },
  { id: 'des002', slug: 'rohan-kapoor', name: 'Rohan Kapoor', email: 'rohan.kapoor@example.in', avatarUrl: 'https://placehold.co/150x150.png', imageHint: 'indian man software developer', bio: 'Rohan, based in Bangalore, is a meticulous and detail-oriented designer with a knack for creating intuitive app interfaces and sustainable packaging solutions.', specialties: ['App Design','Packaging Design','UI/UX','3D Modeling','Print Design'], location: 'Bangalore, India', memberSince: d(2021,8,15), socialLinks: [{platform:'Dribbble',url:'#'},{platform:'LinkedIn',url:'#'}], profileCompletenessScore: 90, adminRanking: 4, clientRatingAverage: '4.70', clientRatingCount: 18, overallRanking: 4, badges: ['On-Time Delivery','Verified'], status: 'Active', servicesApproved: 0 },
  { id: 'des003', slug: 'aisha-khan', name: 'Aisha Khan', email: 'aisha.khan@example.in', avatarUrl: 'https://placehold.co/150x150.png', imageHint: 'indian woman graphic artist', bio: 'Aisha, from Delhi, brings energy and innovation to every project, specializing in motion graphics, social media campaigns, and compelling brand narratives.', specialties: ['Social Media Graphics','Motion Graphics','Video Editing','Branding','Content Creation'], location: 'Delhi, India', memberSince: d(2023,1,20), socialLinks: [{platform:'Instagram',url:'#'},{platform:'YouTube',url:'#'}], profileCompletenessScore: 88, adminRanking: 4, clientRatingAverage: '4.90', clientRatingCount: 30, overallRanking: 4, badges: ['Top Rated','Verified'], status: 'Active', servicesApproved: 10 },
  { id: 'des004', slug: 'vikram-singh', name: 'Vikram Singh', email: 'vikram.singh@example.in', avatarUrl: 'https://placehold.co/150x150.png', imageHint: 'indian man architect thinking', bio: 'Vikram, working out of Jaipur, is a master of print design and presentation aesthetics.', specialties: ['Print Design','Presentation Design','Typography','Layout Design','Corporate Branding'], location: 'Jaipur, India', memberSince: d(2020,10,5), website: 'https://example.com/vikramdesign', profileCompletenessScore: 92, adminRanking: 5, clientRatingAverage: '4.60', clientRatingCount: 15, overallRanking: 5, badges: ['On-Time Delivery','Verified'], status: 'Active', servicesApproved: 3 },
  { id: 'des005', slug: 'sunita-reddy', name: 'Sunita Reddy', email: 'sunita.reddy@example.in', avatarUrl: 'https://placehold.co/150x150.png', imageHint: 'indian woman entrepreneur', bio: 'Sunita is a Hyderabad-based UI/UX designer passionate about creating user-centered experiences for startups.', specialties: ['Web UI/UX','App Design','User Research','Prototyping','Figma'], location: 'Hyderabad, India', memberSince: d(2022,2,18), socialLinks: [{platform:'LinkedIn',url:'#'}], profileCompletenessScore: 85, adminRanking: 3, clientRatingAverage: null, clientRatingCount: 0, overallRanking: 3, badges: ['Verified','Rising Talent'], status: 'Active', servicesApproved: 0 },
  { id: 'des006', slug: 'arjun-mehta', name: 'Arjun Mehta', email: 'arjun.mehta@example.in', avatarUrl: 'https://placehold.co/150x150.png', imageHint: 'indian man photographer', bio: 'Arjun, from Pune, focuses on illustration and branding, with a special love for traditional Indian art forms.', specialties: ['Illustration','Branding','Logo Design','Digital Art','Cultural Design'], location: 'Pune, India', memberSince: d(2021,11,30), website: 'https://example.com/arjunmehtaart', profileCompletenessScore: 80, adminRanking: 4, clientRatingAverage: '4.50', clientRatingCount: 12, overallRanking: 4, badges: ['Verified'], status: 'Active', servicesApproved: 5 },
  { id: 'des007', slug: 'neha-joshi', name: 'Neha Joshi', email: 'neha.joshi@example.in', avatarUrl: 'https://placehold.co/150x150.png', imageHint: 'indian woman fashion designer', bio: 'Based in Chennai, Neha is an expert in packaging design and print materials.', specialties: ['Packaging Design','Print Design','Brand Identity','Sustainable Design','Label Design'], location: 'Chennai, India', memberSince: d(2023,4,5), profileCompletenessScore: 75, adminRanking: 3, clientRatingAverage: '4.20', clientRatingCount: 8, overallRanking: 3, badges: ['Verified'], status: 'Active', servicesApproved: 8 },
];

// ---------------------------------------------------------------------------
// 3. Service Categories
// ---------------------------------------------------------------------------
const serviceCategoriesData: (typeof schema.serviceCategories.$inferInsert)[] = [
  { id: 'cat001', name: 'Logo Design', description: 'Professional logo design services', slug: 'logo-design' },
  { id: 'cat002', name: 'Web UI/UX', description: 'Website and web application design', slug: 'web-ui-ux' },
  { id: 'cat003', name: 'Print Materials', description: 'Brochures, flyers, and print collateral', slug: 'print-materials' },
  { id: 'cat004', name: 'Custom Illustrations', description: 'Digital and hand-drawn illustrations', slug: 'custom-illustrations' },
  { id: 'cat005', name: 'Social Media Graphics', description: 'Posts, stories, and campaign graphics', slug: 'social-media-graphics' },
  { id: 'cat006', name: 'Packaging Design', description: 'Product packaging and label design', slug: 'packaging' },
  { id: 'cat007', name: 'Motion Graphics', description: 'Animation and video graphics', slug: 'motion-graphics' },
  { id: 'cat008', name: 'Presentation Design', description: 'Business and pitch deck presentations', slug: 'presentations' },
  { id: 'cat009', name: 'UI/UX Design', description: 'App and web UI/UX design', slug: 'ui-ux-design' },
  { id: 'cat010', name: 'Photography', description: 'Photo editing and retouching', slug: 'photography' },
  { id: 'cat011', name: 'Print Design', description: 'Print design and layout', slug: 'print-design' },
  { id: 'cat012', name: 'Social Media', description: 'Social media content creation', slug: 'social-media' },
  { id: 'cat013', name: 'Illustration', description: 'Custom illustration and digital art', slug: 'illustration' },
];

// ---------------------------------------------------------------------------
// 4. Services + Tiers
// ---------------------------------------------------------------------------
const servicesData: (typeof schema.services.$inferInsert)[] = [
  { id: 'SVC001', name: 'Modern Logo Design', generalDescription: 'Unique logos for brands, startups, and businesses. Get a memorable identity that resonates with your target audience.', category: 'Logo Design', categorySlug: 'logo-design', tags: ['branding','startup','vector logo','e-commerce logo','brand identity'], imageUrl: 'https://placehold.co/600x400.png', imageHint: 'startup logo', status: 'Active' },
  { id: 'SVC002', name: 'Social Media Pack', generalDescription: 'Engaging posts for Instagram, Facebook, optimized for festivals, regional trends, and audience engagement.', category: 'Social Media', categorySlug: 'social-media', tags: ['instagram marketing','festival creatives','regional content','whatsapp status','social media marketing'], imageUrl: 'https://placehold.co/600x400.png', imageHint: 'social media graphics', status: 'Active' },
  { id: 'SVC003', name: 'Professional Brochure Design', generalDescription: 'Tri-fold or bi-fold brochures for businesses and events.', category: 'Print Design', categorySlug: 'print-design', tags: ['marketing material','event brochure','corporate profile','print ads','catalogue design'], imageUrl: 'https://placehold.co/600x400.png', imageHint: 'company brochure', status: 'Active' },
  { id: 'SVC004', name: 'UI/UX Web Design Mockup', generalDescription: 'High-fidelity mockups for websites, considering modern UI patterns and accessibility.', category: 'UI/UX Design', categorySlug: 'ui-ux-design', tags: ['responsive design','mobile first','figma design','e-commerce ui','landing page design'], imageUrl: 'https://placehold.co/600x400.png', imageHint: 'website design mockup', status: 'Active' },
  { id: 'SVC005', name: 'Custom Illustration', generalDescription: 'Unique illustrations with options for various art styles, modern digital art for diverse applications.', category: 'Illustration', categorySlug: 'illustration', tags: ['digital art','character design','folk art','custom graphics','vector illustration'], imageUrl: 'https://placehold.co/600x400.png', imageHint: 'digital illustration art', status: 'Active' },
  { id: 'SVC006', name: 'Packaging Design Concept', generalDescription: 'Creative packaging concepts for FMCG, sweets, or artisanal products.', category: 'Packaging', categorySlug: 'packaging', tags: ['product packaging','fmcg design','label design','sustainable packaging','box design'], imageUrl: 'https://placehold.co/600x400.png', imageHint: 'product packaging concept', status: 'Active' },
  { id: 'SVC007', name: 'Basic Logo Sketch', generalDescription: 'Quick logo sketches exploring design motifs and modern ideas.', category: 'Logo Design', categorySlug: 'logo-design', tags: ['logo ideation','concept sketch','design motifs','quick design','brainstorming'], imageUrl: 'https://placehold.co/600x400.png', imageHint: 'logo sketch design', status: 'Active' },
  { id: 'SVC008', name: 'Animated Explainer Video', generalDescription: 'Short animated videos (2D) to explain your product/service.', category: 'Motion Graphics', categorySlug: 'motion-graphics', tags: ['2d animation','marketing video','product demo','voiceover services','video marketing'], imageUrl: 'https://placehold.co/600x400.png', imageHint: 'explainer video character animation', status: 'Active' },
  { id: 'SVC009', name: 'Business Presentation Design', generalDescription: 'Professional presentations for businesses, investors, and conferences.', category: 'Presentations', categorySlug: 'presentations', tags: ['pitch deck','corporate presentation','powerpoint design','investor deck','keynote slides'], imageUrl: 'https://placehold.co/600x400.png', imageHint: 'business ppt slide design', status: 'Active' },
  { id: 'SVC010', name: 'App Icon Design', generalDescription: 'Memorable and scalable app icons for iOS and Android.', category: 'UI/UX Design', categorySlug: 'ui-ux-design', tags: ['app icon','ios design','android design','mobile branding','icon set'], imageUrl: 'https://placehold.co/600x400.png', imageHint: 'mobile app icon', status: 'Active' },
  { id: 'SVC011', name: 'E-commerce Product Photography Editing', generalDescription: 'Professional editing and retouching for e-commerce product photos.', category: 'Photography', categorySlug: 'photography', tags: ['photo retouching','background removal','amazon','ebay','image enhancement'], imageUrl: 'https://placehold.co/600x400.png', imageHint: 'product photo editing services', status: 'Active' },
  { id: 'SVC012', name: 'Infographic Design', generalDescription: 'Visually compelling infographics to present data and information clearly.', category: 'Illustration', categorySlug: 'illustration', tags: ['data visualization','report design','visual content','content marketing'], imageUrl: 'https://placehold.co/600x400.png', imageHint: 'data infographic visualization', status: 'Active' },
  // Order-referenced services
  { id: 'SVC001IN', name: 'Startup Logo & Brand Identity', generalDescription: 'Complete brand identity for startups', category: 'Logo Design', categorySlug: 'logo-design', tags: ['startup','brand identity'], imageUrl: 'https://placehold.co/600x400.png', imageHint: 'brand identity', status: 'Active' },
  { id: 'SVC002IN', name: 'Social Media Campaign Graphics', generalDescription: 'Campaign graphics for social media platforms', category: 'Social Media', categorySlug: 'social-media', tags: ['campaign','social media'], imageUrl: 'https://placehold.co/600x400.png', imageHint: 'social campaign', status: 'Active' },
  { id: 'SVC003IN', name: 'Restaurant Menu Design', generalDescription: 'Custom menu design for restaurants', category: 'Print Design', categorySlug: 'print-design', tags: ['menu','restaurant'], imageUrl: 'https://placehold.co/600x400.png', imageHint: 'menu design', status: 'Active' },
  { id: 'SVC004IN', name: 'E-commerce Website UI/UX', generalDescription: 'E-commerce website design', category: 'UI/UX Design', categorySlug: 'ui-ux-design', tags: ['ecommerce','website'], imageUrl: 'https://placehold.co/600x400.png', imageHint: 'ecommerce ui', status: 'Active' },
  { id: 'SVC005IN', name: 'Festival Banner Design', generalDescription: 'Banners for festivals and celebrations', category: 'Print Design', categorySlug: 'print-design', tags: ['festival','banner'], imageUrl: 'https://placehold.co/600x400.png', imageHint: 'festival banner', status: 'Active' },
  { id: 'SVC006IN', name: 'Mobile App Icon Set', generalDescription: 'Custom icon sets for mobile applications', category: 'UI/UX Design', categorySlug: 'ui-ux-design', tags: ['app icon','mobile'], imageUrl: 'https://placehold.co/600x400.png', imageHint: 'app icons', status: 'Active' },
  { id: 'SVC007IN', name: 'Wedding Invitation Design', generalDescription: 'Custom wedding invitation designs', category: 'Print Design', categorySlug: 'print-design', tags: ['wedding','invitation'], imageUrl: 'https://placehold.co/600x400.png', imageHint: 'wedding invite', status: 'Active' },
];

const serviceTiersData: (typeof schema.serviceTiers.$inferInsert)[] = [
  // SVC001 Modern Logo Design
  { id: 'tier_001_b', serviceId: 'SVC001', name: 'Basic', price: '4999', description: '2 logo concepts, 1 revision', deliveryTimeMin: 3, deliveryTimeMax: 5, deliveryTimeUnit: 'business_days' },
  { id: 'tier_001_s', serviceId: 'SVC001', name: 'Standard', price: '9999', description: '4 logo concepts, 3 revisions, source files', deliveryTimeMin: 5, deliveryTimeMax: 7, deliveryTimeUnit: 'business_days' },
  { id: 'tier_001_p', serviceId: 'SVC001', name: 'Premium', price: '14999', description: '6 logo concepts, unlimited revisions, brand guidelines', deliveryTimeMin: 7, deliveryTimeMax: 10, deliveryTimeUnit: 'business_days' },
  // SVC002 Social Media Pack
  { id: 'tier_002_b', serviceId: 'SVC002', name: 'Basic', price: '2499', description: '5 social media posts', deliveryTimeMin: 2, deliveryTimeMax: 3, deliveryTimeUnit: 'business_days' },
  { id: 'tier_002_s', serviceId: 'SVC002', name: 'Standard', price: '4999', description: '15 posts, 3 platforms', deliveryTimeMin: 3, deliveryTimeMax: 5, deliveryTimeUnit: 'business_days' },
  // SVC003 Brochure
  { id: 'tier_003_s', serviceId: 'SVC003', name: 'Standard', price: '7999', description: 'Bi-fold brochure', deliveryTimeMin: 4, deliveryTimeMax: 6, deliveryTimeUnit: 'business_days' },
  { id: 'tier_003_p', serviceId: 'SVC003', name: 'Premium', price: '12999', description: 'Tri-fold brochure with illustrations', deliveryTimeMin: 6, deliveryTimeMax: 8, deliveryTimeUnit: 'business_days' },
  // SVC004 UI/UX Web Design
  { id: 'tier_004_s', serviceId: 'SVC004', name: 'Standard', price: '15999', description: 'Up to 3 pages', deliveryTimeMin: 7, deliveryTimeMax: 10, deliveryTimeUnit: 'business_days' },
  { id: 'tier_004_p', serviceId: 'SVC004', name: 'Premium', price: '23999', description: 'Up to 5 pages with prototype', deliveryTimeMin: 10, deliveryTimeMax: 14, deliveryTimeUnit: 'business_days' },
  // SVC005 Custom Illustration
  { id: 'tier_005_b', serviceId: 'SVC005', name: 'Basic', price: '3999', description: '1 illustration', deliveryTimeMin: 3, deliveryTimeMax: 5, deliveryTimeUnit: 'business_days' },
  { id: 'tier_005_s', serviceId: 'SVC005', name: 'Standard', price: '7999', description: '3 illustrations', deliveryTimeMin: 5, deliveryTimeMax: 7, deliveryTimeUnit: 'business_days' },
  { id: 'tier_005_p', serviceId: 'SVC005', name: 'Premium', price: '11999', description: '5 illustrations with source files', deliveryTimeMin: 7, deliveryTimeMax: 10, deliveryTimeUnit: 'business_days' },
  // SVC006 Packaging
  { id: 'tier_006_s', serviceId: 'SVC006', name: 'Standard', price: '12999', description: '1 packaging concept', deliveryTimeMin: 7, deliveryTimeMax: 10, deliveryTimeUnit: 'business_days' },
  { id: 'tier_006_p', serviceId: 'SVC006', name: 'Premium', price: '19999', description: '3 packaging concepts with 3D mockup', deliveryTimeMin: 10, deliveryTimeMax: 14, deliveryTimeUnit: 'business_days' },
  // SVC007 Basic Logo Sketch
  { id: 'tier_007_b', serviceId: 'SVC007', name: 'Basic', price: '2499', description: '3 sketches', deliveryTimeMin: 1, deliveryTimeMax: 2, deliveryTimeUnit: 'business_days' },
  // SVC008 Animated Explainer
  { id: 'tier_008_s', serviceId: 'SVC008', name: 'Standard', price: '19999', description: '60-second video', deliveryTimeMin: 10, deliveryTimeMax: 14, deliveryTimeUnit: 'business_days' },
  { id: 'tier_008_p', serviceId: 'SVC008', name: 'Premium', price: '34999', description: '120-second video with voiceover', deliveryTimeMin: 14, deliveryTimeMax: 21, deliveryTimeUnit: 'business_days' },
  // SVC009 Business Presentation
  { id: 'tier_009_s', serviceId: 'SVC009', name: 'Standard', price: '8999', description: 'Up to 15 slides', deliveryTimeMin: 3, deliveryTimeMax: 5, deliveryTimeUnit: 'business_days' },
  { id: 'tier_009_p', serviceId: 'SVC009', name: 'Premium', price: '15999', description: 'Up to 30 slides with animations', deliveryTimeMin: 5, deliveryTimeMax: 7, deliveryTimeUnit: 'business_days' },
  // SVC010 App Icon
  { id: 'tier_010_s', serviceId: 'SVC010', name: 'Standard', price: '3999', description: '1 icon, iOS + Android', deliveryTimeMin: 2, deliveryTimeMax: 3, deliveryTimeUnit: 'business_days' },
  { id: 'tier_010_p', serviceId: 'SVC010', name: 'Premium', price: '6999', description: 'Icon + splash screen + app store screenshots', deliveryTimeMin: 3, deliveryTimeMax: 5, deliveryTimeUnit: 'business_days' },
  // SVC011 Photo Editing
  { id: 'tier_011_b', serviceId: 'SVC011', name: 'Basic', price: '1999', description: '5 photos', deliveryTimeMin: 1, deliveryTimeMax: 2, deliveryTimeUnit: 'business_days' },
  { id: 'tier_011_s', serviceId: 'SVC011', name: 'Standard', price: '4999', description: '20 photos with background removal', deliveryTimeMin: 2, deliveryTimeMax: 4, deliveryTimeUnit: 'business_days' },
  // SVC012 Infographic
  { id: 'tier_012_s', serviceId: 'SVC012', name: 'Standard', price: '6999', description: '1 infographic', deliveryTimeMin: 3, deliveryTimeMax: 5, deliveryTimeUnit: 'business_days' },
  { id: 'tier_012_p', serviceId: 'SVC012', name: 'Premium', price: '11999', description: '3 infographics with data visualization', deliveryTimeMin: 5, deliveryTimeMax: 7, deliveryTimeUnit: 'business_days' },
];

// ---------------------------------------------------------------------------
// 5. Orders + Events + Milestones
// ---------------------------------------------------------------------------
const ordersData: (typeof schema.orders.$inferInsert)[] = [
  { id: 'ORD7361P', clientName: 'Priya Sharma', clientId: 'CLI001P', designerName: 'Rohan Kapoor', designerId: 'des002', serviceName: 'E-commerce Website UI/UX', serviceId: 'SVC004IN', serviceTier: 'Premium', serviceScope: ['Up to 5 pages UI/UX design','Mobile, tablet, and desktop views','Interactive prototype','Full style guide'], orderDate: d(2024,6,1,10,30), dueDate: d(2024,6,11,10,30), status: 'In Progress', totalAmount: '24999', currency: 'INR', paymentMethod: 'Razorpay', transactionId: 'pay_Olcftg87sHjkl', clientBrief: 'Need a modern and clean UI/UX for a new e-commerce platform selling Indian handicrafts.', revisionsAllowed: 3, revisionsUsed: 0, privateNotes: 'Client seems very particular about the color palette.' },
  { id: 'ORD1038K', clientName: 'Rajesh Kumar', clientId: 'CLI003K', serviceName: 'Social Media Campaign Graphics', serviceId: 'SVC002IN', serviceTier: 'Standard', serviceScope: ['15 social media posts','Up to 3 platforms','3 Rounds of revisions','Source files'], orderDate: d(2024,6,5,14,0), dueDate: d(2024,6,8,14,0), status: 'Pending Assignment', totalAmount: '7999', currency: 'INR', paymentMethod: 'PhonePe', transactionId: 'txn_HghtrDEWAq789', clientBrief: 'Require engaging graphics for a Diwali festival campaign.', revisionsAllowed: 3, revisionsUsed: 0 },
  { id: 'ORD2945S', clientName: 'Sunita Rao', clientId: 'CLI004S', designerName: 'Priya Sharma', designerId: 'des001', serviceName: 'Startup Logo & Brand Identity', serviceId: 'SVC001IN', serviceTier: 'Premium', serviceScope: ['5 Initial concepts','Unlimited revisions','Full vector & source files','Detailed brand guidelines','Social media kit','Business card design'], orderDate: d(2024,5,20,16,45), dueDate: d(2024,6,15), status: 'Completed', totalAmount: '19999', currency: 'INR', paymentMethod: 'Razorpay', transactionId: 'pay_Nnbvcxz87Uyt', clientBrief: "Brand identity for 'SwasthyaLink'. Logo should evoke trust, technology, and wellness.", revisionsAllowed: 99, revisionsUsed: 1 },
  { id: 'ORD8872V', clientName: 'Vikram Mehta', clientId: 'CLI005V', serviceName: 'Festival Banner Design', serviceId: 'SVC005IN', serviceTier: 'Basic', serviceScope: ['2 Banner concepts','1 Revision round','Print-ready files'], orderDate: d(2024,6,8,9,15), status: 'Cancelled', totalAmount: '2499', currency: 'INR', paymentMethod: 'Razorpay', transactionId: 'pay_Kkjhgf56Qwe', clientBrief: 'Need vibrant banners for Ganesh Chaturthi celebrations.', revisionsAllowed: 1, revisionsUsed: 0 },
  { id: 'ORD6531A', clientName: 'Anjali Iyer', clientId: 'CLI006A', designerName: 'Vikram Singh', designerId: 'des004', serviceName: 'Restaurant Menu Design', serviceId: 'SVC003IN', serviceTier: 'Standard', serviceScope: ['Custom menu design (up to 4 pages)','Stock imagery included','3 revision rounds','Print-ready PDF'], orderDate: d(2024,6,10,11,20), dueDate: d(2024,6,15,11,20), status: 'Awaiting Client Review', totalAmount: '6999', currency: 'INR', paymentMethod: 'PhonePe', transactionId: 'txn_Qoiuyt09Mnb', clientBrief: 'Menu design for a South Indian fusion restaurant.', revisionsAllowed: 3, revisionsUsed: 0 },
  { id: 'ORD4011M', clientName: 'Mohan Das', clientId: 'CLI007M', designerName: 'Sunita Reddy', designerId: 'des005', serviceName: 'Mobile App Icon Set', serviceId: 'SVC006IN', serviceTier: 'Standard', serviceScope: ['Set of 10 custom icons','Consistent style','Multiple sizes','2 revision rounds'], orderDate: d(2024,5,25,9,0), dueDate: d(2024,6,2,9,0), status: 'In Progress', totalAmount: '4999', currency: 'INR', paymentMethod: 'Razorpay', transactionId: 'pay_Xyz123abcDef', clientBrief: 'Set of 10 unique icons for a travel app.', revisionsAllowed: 2, revisionsUsed: 0 },
  { id: 'ORD9274R', clientName: 'Riya Sen', clientId: 'CLI008R', designerName: 'Arjun Mehta', designerId: 'des006', serviceName: 'Wedding Invitation Design', serviceId: 'SVC007IN', serviceTier: 'Premium', serviceScope: ['Custom invitation design','Digital and print-ready files','Envelope design','3 revision rounds'], orderDate: d(2024,4,15,15,30), dueDate: d(2024,5,10), status: 'Revision Requested', totalAmount: '9999', currency: 'INR', paymentMethod: 'Bank Transfer', transactionId: 'BT_WEDINV_RIYA01', clientBrief: 'Elegant and traditional Indian wedding invitation. Theme: Peacock feathers and gold accents.', revisionNotes: 'The color palette needs to be warmer. Please explore more traditional gold tones.', revisionRequestDate: d(2024,5,7,10,0), revisionsAllowed: 3, revisionsUsed: 1 },
  { id: 'ORD5050T', clientName: 'Priya Sharma', clientId: 'CLI001P', designerName: 'Aisha Khan', designerId: 'des003', serviceName: 'Social Media Campaign Graphics', serviceId: 'SVC002IN', serviceTier: 'Standard', orderDate: d(2024,5,15), status: 'Completed', totalAmount: '7999', currency: 'INR', revisionsAllowed: 3, revisionsUsed: 0 },
];

const orderEventsData: (typeof schema.orderEvents.$inferInsert)[] = [
  // ORD7361P
  { id: 'ev_7361p_1', orderId: 'ORD7361P', timestamp: d(2024,6,2,9,5), event: 'Status changed to In Progress', actor: 'System' },
  { id: 'ev_7361p_2', orderId: 'ORD7361P', timestamp: d(2024,6,2,9,0), event: 'Designer Assigned: Rohan Kapoor', actor: 'Admin' },
  { id: 'ev_7361p_3', orderId: 'ORD7361P', timestamp: d(2024,6,1,11,0), event: 'Payment Successful (Razorpay)', actor: 'System' },
  { id: 'ev_7361p_4', orderId: 'ORD7361P', timestamp: d(2024,6,1,10,30), event: 'Order Placed', actor: 'Priya Sharma' },
  // ORD1038K
  { id: 'ev_1038k_1', orderId: 'ORD1038K', timestamp: d(2024,6,5,14,10), event: 'Status changed to Pending Assignment', actor: 'System' },
  { id: 'ev_1038k_2', orderId: 'ORD1038K', timestamp: d(2024,6,5,14,5), event: 'Payment Successful (PhonePe)', actor: 'System' },
  { id: 'ev_1038k_3', orderId: 'ORD1038K', timestamp: d(2024,6,5,14,0), event: 'Order Placed', actor: 'Rajesh Kumar' },
  // ORD2945S
  { id: 'ev_2945s_1', orderId: 'ORD2945S', timestamp: d(2024,6,12,12,5), event: 'Status changed to Completed', actor: 'System' },
  { id: 'ev_2945s_2', orderId: 'ORD2945S', timestamp: d(2024,6,12,12,0), event: 'Final delivery approved by client.', actor: 'Sunita Rao' },
  { id: 'ev_2945s_3', orderId: 'ORD2945S', timestamp: d(2024,5,20,16,45), event: 'Order Placed', actor: 'Sunita Rao' },
  // ORD8872V
  { id: 'ev_8872v_1', orderId: 'ORD8872V', timestamp: d(2024,6,9,10,0), event: 'Order Cancelled by Client', actor: 'Vikram Mehta' },
  { id: 'ev_8872v_2', orderId: 'ORD8872V', timestamp: d(2024,6,8,9,15), event: 'Order Placed', actor: 'Vikram Mehta' },
  // ORD6531A
  { id: 'ev_6531a_1', orderId: 'ORD6531A', timestamp: d(2024,6,15,17,5), event: 'Status changed to Awaiting Client Review', actor: 'System' },
  { id: 'ev_6531a_2', orderId: 'ORD6531A', timestamp: d(2024,6,15,17,0), event: 'Menu draft submitted by designer.', actor: 'Vikram Singh' },
  { id: 'ev_6531a_3', orderId: 'ORD6531A', timestamp: d(2024,6,10,11,20), event: 'Order Placed', actor: 'Anjali Iyer' },
  // ORD4011M
  { id: 'ev_4011m_1', orderId: 'ORD4011M', timestamp: d(2024,5,26,10,5), event: 'Status changed to In Progress', actor: 'System' },
  { id: 'ev_4011m_2', orderId: 'ORD4011M', timestamp: d(2024,5,26,10,0), event: 'Designer Assigned: Sunita Reddy', actor: 'Admin' },
  { id: 'ev_4011m_3', orderId: 'ORD4011M', timestamp: d(2024,5,25,9,0), event: 'Order Placed', actor: 'Mohan Das' },
  // ORD9274R
  { id: 'ev_9274r_1', orderId: 'ORD9274R', timestamp: d(2024,5,7,10,5), event: 'Status changed to Revision Requested', actor: 'System' },
  { id: 'ev_9274r_2', orderId: 'ORD9274R', timestamp: d(2024,5,7,10,0), event: 'Client requested revisions on color palette.', actor: 'Riya Sen' },
  { id: 'ev_9274r_3', orderId: 'ORD9274R', timestamp: d(2024,5,5,18,0), event: 'Initial invitation drafts submitted.', actor: 'Arjun Mehta' },
  { id: 'ev_9274r_4', orderId: 'ORD9274R', timestamp: d(2024,4,15,15,30), event: 'Order Placed', actor: 'Riya Sen' },
];

const orderMilestonesData: (typeof schema.orderMilestones.$inferInsert)[] = [
  { id: 'm1_7361p', orderId: 'ORD7361P', title: 'Phase 1: Wireframes & UX Flow', dueDate: d(2024,6,8), amount: '8000', status: 'Paid' },
  { id: 'm2_7361p', orderId: 'ORD7361P', title: 'Phase 2: UI Design & Style Guide', dueDate: d(2024,6,20), amount: '12000', status: 'Delivered' },
  { id: 'm3_7361p', orderId: 'ORD7361P', title: 'Phase 3: Final Assets & Prototype', dueDate: d(2024,6,28), amount: '4999', status: 'Pending' },
];

// ---------------------------------------------------------------------------
// 6. Transactions
// ---------------------------------------------------------------------------
const transactionsData: (typeof schema.transactions.$inferInsert)[] = [
  { id: 'txn_Olcftg87sHjkl', orderId: 'ORD7361P', date: d(2024,6,1), type: 'Sale', status: 'On Hold', amount: '24999', paymentMethod: 'Razorpay', clientName: 'Priya Sharma', designerName: 'Rohan Kapoor' },
  { id: 'txn_HghtrDEWAq789', orderId: 'ORD1038K', date: d(2024,6,5), type: 'Sale', status: 'On Hold', amount: '7999', paymentMethod: 'PhonePe', clientName: 'Rajesh Kumar', designerName: 'Priya Sharma' },
  { id: 'txn_Nnbvcxz87Uyt', orderId: 'ORD2945S', date: d(2024,5,20), type: 'Sale', status: 'Completed', amount: '19999', paymentMethod: 'Razorpay', clientName: 'Sunita Rao', designerName: 'Priya Sharma' },
  { id: 'txn_payout_ps01', orderId: 'ORD2945S', date: d(2024,6,14), type: 'Payout', status: 'Completed', amount: '-17999.10', paymentMethod: 'Bank Transfer', clientName: 'Sunita Rao', designerName: 'Priya Sharma' },
  { id: 'txn_fee_ps01', orderId: 'ORD2945S', date: d(2024,6,14), type: 'Fee', status: 'Completed', amount: '-1999.90', clientName: 'Sunita Rao', designerName: 'Priya Sharma' },
  { id: 'txn_Kkjhgf56Qwe', orderId: 'ORD8872V', date: d(2024,6,8), type: 'Sale', status: 'Failed', amount: '2499', paymentMethod: 'Razorpay', clientName: 'Vikram Mehta' },
  { id: 'txn_Qoiuyt09Mnb', orderId: 'ORD6531A', date: d(2024,6,10), type: 'Sale', status: 'Completed', amount: '6999', paymentMethod: 'PhonePe', clientName: 'Anjali Iyer', designerName: 'Vikram Singh' },
  { id: 'txn_payout_vs01', orderId: 'ORD6531A', date: d(2024,6,18), type: 'Payout', status: 'Pending', amount: '-6299.10', paymentMethod: 'Bank Transfer', clientName: 'Anjali Iyer', designerName: 'Vikram Singh' },
  { id: 'txn_fee_vs01', orderId: 'ORD6531A', date: d(2024,6,18), type: 'Fee', status: 'Pending', amount: '-699.90', clientName: 'Anjali Iyer', designerName: 'Vikram Singh' },
  { id: 'txn_Xyz123abcDef', orderId: 'ORD4011M', date: d(2024,5,25), type: 'Sale', status: 'Refunded', amount: '4999', paymentMethod: 'Razorpay', clientName: 'Mohan Das', designerName: 'Sunita Reddy' },
  { id: 'txn_refund_md01', orderId: 'ORD4011M', date: d(2024,6,2), type: 'Refund', status: 'Completed', amount: '-4999', clientName: 'Mohan Das' },
  { id: 'txn_BT_WEDINV_RIYA01', orderId: 'ORD9274R', date: d(2024,4,15), type: 'Sale', status: 'On Hold', amount: '9999', paymentMethod: 'Bank Transfer', clientName: 'Riya Sen', designerName: 'Arjun Mehta' },
];

// ---------------------------------------------------------------------------
// 7. Payout Requests
// ---------------------------------------------------------------------------
const payoutRequestsData: (typeof schema.payoutRequests.$inferInsert)[] = [
  { id: 'ADV001', designerId: 'des002', orderId: 'ORD7361P', orderName: 'E-commerce Website UI/UX', amount: '5000', reason: 'Software subscription renewal (Adobe CC)', status: 'Pending', requestDate: d(2024,6,19), repaidAmount: '2500' },
  { id: 'ADV002', designerId: 'des003', orderId: 'ORD1038K', orderName: 'Social Media Campaign Graphics', amount: '10000', reason: 'Hardware upgrade - Graphics tablet', status: 'Approved', requestDate: d(2024,6,15), repaidAmount: '0' },
  { id: 'ADV003', designerId: 'des004', orderId: 'ORD6531A', orderName: 'Restaurant Menu Design', amount: '3000', reason: 'Marketing materials for personal brand', status: 'Rejected', requestDate: d(2024,6,12), repaidAmount: '0' },
];

// ---------------------------------------------------------------------------
// 8. Payment Methods
// ---------------------------------------------------------------------------
const paymentMethodsData: (typeof schema.paymentMethods.$inferInsert)[] = [
  { id: 'pm_1', userId: 'usr001', userName: 'Priya Sharma', userRole: 'Client', methodType: 'Card', identifier: '**** **** **** 4242', isPrimary: true, status: 'Verified', lastUpdated: d(2024,5,1) },
  { id: 'pm_2', userId: 'usr003', userName: 'Aarav Patel', userRole: 'Client', methodType: 'UPI', identifier: 'aarav@upi', isPrimary: false, status: 'Verified', lastUpdated: d(2024,4,20) },
  { id: 'pm_3', userId: 'usr006', userName: 'Sneha Reddy', userRole: 'Client', methodType: 'Card', identifier: '**** **** **** 1234', isPrimary: true, status: 'Pending', lastUpdated: d(2024,5,15) },
  { id: 'pm_4', userId: 'des002', userName: 'Rohan Kapoor', userRole: 'Designer', methodType: 'Bank Transfer', identifier: 'HDFC ****5678', isPrimary: true, status: 'Verified', lastUpdated: d(2024,5,10) },
  { id: 'pm_5', userId: 'des003', userName: 'Aisha Khan', userRole: 'Designer', methodType: 'PayPal', identifier: 'aisha.khan@paypal', isPrimary: true, status: 'Verified', lastUpdated: d(2024,3,25) },
  { id: 'pm_6', userId: 'des004', userName: 'Vikram Singh', userRole: 'Designer', methodType: 'Bank Transfer', identifier: 'ICICI ****9012', isPrimary: true, status: 'Rejected', lastUpdated: d(2024,5,5) },
];

// ---------------------------------------------------------------------------
// 9. Reviews
// ---------------------------------------------------------------------------
const reviewsData: (typeof schema.reviews.$inferInsert)[] = [
  { id: 'rev001', orderId: 'ORD2945S', authorName: 'Sunita Rao', authorRole: 'Client', recipientName: 'Priya Sharma', serviceName: 'Startup Logo & Brand Identity', category: 'Logo & Branding', rating: 5, reviewText: 'Priya was absolutely amazing! She understood the vision for SwasthyaLink perfectly.', reviewDate: d(2024,6,14), status: 'Approved', isFeatured: true, isReported: false, revisions: 1, clientAvatarUrl: 'https://placehold.co/100x100.png', clientAvatarHint: 'woman corporate' },
  { id: 'rev002', authorName: 'Arun Kumar', authorRole: 'Client', recipientName: 'Rohan Kapoor', serviceName: 'E-commerce Website UI/UX', category: 'Web UI/UX', rating: 4, reviewText: 'The UI design was clean and modern. Some minor delays but great end result.', reviewDate: d(2024,6,12), status: 'Approved', isFeatured: false, isReported: false, revisions: 2, clientAvatarUrl: 'https://placehold.co/100x100.png', clientAvatarHint: 'man startup founder' },
  { id: 'rev003', authorName: 'Kavita Singh', authorRole: 'Client', recipientName: 'Aisha Khan', serviceName: 'Social Media Campaign', category: 'Social Media', rating: 3, reviewText: 'The designs were okay, but it took a few revisions to get them right.', reviewDate: d(2024,6,11), status: 'Pending', isFeatured: false, isReported: false, revisions: 3, clientAvatarUrl: 'https://placehold.co/100x100.png', clientAvatarHint: 'woman client' },
  { id: 'rev004', authorName: 'Vijay Patil', authorRole: 'Client', recipientName: 'Priya Sharma', serviceName: 'Modern Logo Design', category: 'Logo & Branding', rating: 5, reviewText: 'Fantastic work on the logo. Quick turnaround and very creative.', reviewDate: d(2024,6,10), status: 'Hidden', isFeatured: false, isReported: true, revisions: 0, clientAvatarUrl: 'https://placehold.co/100x100.png', clientAvatarHint: 'man small business owner' },
  { id: 'rev005', orderId: 'ORD2945S', authorName: 'Priya Sharma', authorRole: 'Designer', recipientName: 'Sunita Rao', serviceName: 'Startup Logo & Brand Identity', category: 'Logo & Branding', rating: 5, reviewText: 'Sunita was a pleasure to work with. Clear brief and constructive feedback.', reviewDate: d(2024,6,15), status: 'Pending', isFeatured: false, isReported: false, revisions: 0 },
  { id: 'rev006', authorName: 'Amit Singh', authorRole: 'Client', recipientName: 'Priya Sharma', serviceName: 'Business Card Design', category: 'Print Design', rating: 4, reviewText: 'The business cards were high quality and delivered on time.', reviewDate: d(2024,4,25), status: 'Approved', isFeatured: false, isReported: false, revisions: 1, clientAvatarUrl: 'https://placehold.co/100x100.png', clientAvatarHint: 'man entrepreneur' },
  { id: 'rev007', orderId: 'ORD5050T', authorName: 'Rina Desai', authorRole: 'Client', recipientName: 'Priya Sharma', serviceName: 'Social Media Campaign Graphics', category: 'Social Media', rating: 5, reviewText: 'The festival creatives were vibrant and perfect for our target audience.', reviewDate: d(2024,5,18), status: 'Approved', isFeatured: true, isReported: false, revisions: 0, clientAvatarUrl: 'https://placehold.co/100x100.png', clientAvatarHint: 'woman professional' },
];

// ---------------------------------------------------------------------------
// 10. Disputes + Timeline
// ---------------------------------------------------------------------------
const disputesData: (typeof schema.disputes.$inferInsert)[] = [
  { id: 'DISP-001', orderId: 'ORD7361P', designerId: 'des002', serviceName: 'E-commerce Website UI/UX', servicePrice: '24999', orderDeadline: d(2024,6,11), clientName: 'Priya Sharma', disputeType: 'Deliverable Quality', status: 'Under Review', lastUpdated: daysAgo(2), clientClaim: 'The delivered wireframes do not match the brief requirements.', designerResponse: 'The wireframes follow the brief — I can elaborate on specific sections.', adminNotes: 'Reviewing both sides. Requested additional context from designer.' },
  { id: 'DISP-002', orderId: 'ORD4011M', designerId: 'des005', serviceName: 'Mobile App Icon Set', servicePrice: '4999', orderDeadline: d(2024,6,2), clientName: 'Mohan Das', disputeType: 'Scope Creep', status: 'Open', lastUpdated: daysAgo(5), clientClaim: 'Designer is asking for additional payment for requested changes within scope.' },
  { id: 'DISP-003', orderId: 'ORD2945S', designerId: 'des001', serviceName: 'Startup Logo & Brand Identity', servicePrice: '19999', clientName: 'Sunita Rao', disputeType: 'Non-Delivery', status: 'Resolved (Designer Favor)', lastUpdated: daysAgo(15), clientClaim: 'Designer did not deliver on time.', designerResponse: 'Delivery was made 1 day after the deadline due to client-requested scope changes.', adminNotes: 'Resolved in favor of designer. Client agreed to extended timeline.' },
];

const disputeTimelineData: (typeof schema.disputeTimelineEvents.$inferInsert)[] = [
  { id: 'dte_001_1', disputeId: 'DISP-001', actor: 'Client', action: 'Filed dispute citing deliverable quality issues.', timestamp: daysAgo(5) },
  { id: 'dte_001_2', disputeId: 'DISP-001', actor: 'Admin', action: 'Dispute acknowledged. Designer notified.', timestamp: daysAgo(4) },
  { id: 'dte_001_3', disputeId: 'DISP-001', actor: 'Designer', action: 'Submitted response with supporting evidence.', timestamp: daysAgo(3) },
  { id: 'dte_001_4', disputeId: 'DISP-001', actor: 'Admin', action: 'Under review. Requested additional wireframe comparison.', timestamp: daysAgo(2) },
  { id: 'dte_002_1', disputeId: 'DISP-002', actor: 'Client', action: 'Filed dispute about scope creep charges.', timestamp: daysAgo(5) },
  { id: 'dte_003_1', disputeId: 'DISP-003', actor: 'Client', action: 'Filed non-delivery complaint.', timestamp: daysAgo(20) },
  { id: 'dte_003_2', disputeId: 'DISP-003', actor: 'Designer', action: 'Provided evidence of scope change request from client.', timestamp: daysAgo(18) },
  { id: 'dte_003_3', disputeId: 'DISP-003', actor: 'Admin', action: 'Resolved in favor of designer.', timestamp: daysAgo(15) },
];

// ---------------------------------------------------------------------------
// 11. Reports
// ---------------------------------------------------------------------------
const reportsData: (typeof schema.reports.$inferInsert)[] = [
  { id: 'rpt_001', orderId: 'ORD7361P', reporterId: 'CLI001P', reporterName: 'Priya Sharma', reportedUserId: 'des002', reportedUserName: 'Rohan Kapoor', subject: 'Unresponsive designer', details: 'Designer has not responded to messages for 3 days.', reportDate: daysAgo(7), status: 'In Progress' },
  { id: 'rpt_002', orderId: 'ORD9274R', reporterId: 'CLI008R', reporterName: 'Riya Sen', reportedUserId: 'des006', reportedUserName: 'Arjun Mehta', subject: 'Quality concerns', details: 'Revisions are not addressing the feedback provided.', reportDate: daysAgo(10), status: 'Open' },
];

// ---------------------------------------------------------------------------
// 12. Notifications
// ---------------------------------------------------------------------------
const notificationsData: (typeof schema.notifications.$inferInsert)[] = [
  { id: 'notif_1', userId: 'des001', type: 'Revision Request', title: 'Revision Request on ORD9274R', message: 'Client Riya Sen has requested revisions on the wedding invitation color palette.', relatedOrderId: 'ORD9274R', priority: 'High', isRead: false, isArchived: false, createdAt: daysAgo(1) },
  { id: 'notif_2', userId: 'des002', type: 'New Order', title: 'New Order: E-commerce Website UI/UX', message: 'You have been assigned to order ORD7361P.', relatedOrderId: 'ORD7361P', priority: 'Medium', isRead: false, isArchived: false, createdAt: daysAgo(2) },
  { id: 'notif_3', userId: 'des003', type: 'Category Approved', title: 'Category Approved: Social Media Graphics', message: 'You have been approved for the Social Media Graphics category.', priority: 'Medium', isRead: true, isArchived: false, createdAt: daysAgo(5) },
  { id: 'notif_4', userId: 'des001', type: 'Order Approved', title: 'Order ORD2945S Approved', message: 'Your delivery for Startup Logo & Brand Identity has been approved.', relatedOrderId: 'ORD2945S', priority: 'Medium', isRead: true, isArchived: true, createdAt: daysAgo(10) },
  { id: 'notif_5', userId: 'CLI001P', type: 'Message', title: 'New Message from Rohan Kapoor', message: 'Sure, I can have the revised wireframes ready by tomorrow morning.', relatedOrderId: 'ORD7361P', priority: 'Low', isRead: false, isArchived: false, createdAt: daysAgo(0) },
  { id: 'notif_6', userId: 'des007', type: 'Category Rejected', title: 'Category Rejected: Motion Graphics', message: 'Your application for the Motion Graphics category was not approved at this time.', priority: 'High', isRead: false, isArchived: true, createdAt: daysAgo(3) },
];

// ---------------------------------------------------------------------------
// 13. Site Settings
// ---------------------------------------------------------------------------
const siteSettingsData: (typeof schema.siteSettings.$inferInsert)[] = [
  {
    id: 'default',
    platformName: 'HYPE',
    contactEmail: 'admin@designhype.in',
    defaultCurrency: 'INR',
    allowClientRegistrations: true,
    allowDesignerRegistrations: true,
    termsUrl: '/terms-of-service',
    privacyUrl: '/privacy-policy',
    enableMemberships: true,
    clientBasicPlanName: 'Client Basic',
    clientBasicPlanPrice: '799',
    clientPremiumPlanName: 'Client Premium',
    clientPremiumPlanPrice: '2499',
    designerBasicPlanName: 'Designer Starter',
    designerBasicPlanPrice: '1599',
    designerProPlanName: 'Designer Pro',
    designerProPlanPrice: '3999',
    enableFreeTrial: true,
    trialDurationDays: 14,
    adminNotificationEmail: 'notifications@designhype.in',
  },
];

// ---------------------------------------------------------------------------
// 14. Audit Logs
// ---------------------------------------------------------------------------
const auditLogsData: (typeof schema.auditLogs.$inferInsert)[] = [
  { id: 'log_001', action: 'Order Status Change', actorId: 'admin001', actorName: 'Admin User', targetType: 'Order', targetId: 'ORD7361P', targetName: 'E-commerce Website UI/UX', timestamp: daysAgo(1), notes: 'Status changed from Pending to In Progress' },
  { id: 'log_002', action: 'Designer Approved', actorId: 'admin002', actorName: 'Super Admin', targetType: 'User', targetId: 'des007', targetName: 'Neha Joshi', timestamp: daysAgo(2), notes: 'Approved for Print Design category.' },
  { id: 'log_003', action: 'Service Edit', actorId: 'admin001', actorName: 'Admin User', targetType: 'Service', targetId: 'SVC001', targetName: 'Modern Logo Design', timestamp: daysAgo(3), notes: 'Updated price for Premium tier.' },
  { id: 'log_004', action: 'Settings Change', actorId: 'admin002', actorName: 'Super Admin', targetType: 'Platform', targetId: 'registration_settings', targetName: 'User Registrations', timestamp: daysAgo(4), notes: 'Disabled new designer registrations.' },
  { id: 'log_005', action: 'User Update', actorId: 'admin001', actorName: 'Admin User', targetType: 'User', targetId: 'usr003', targetName: 'Aarav Patel', timestamp: daysAgo(5), notes: 'Suspended user account.' },
];

// ---------------------------------------------------------------------------
// 15. Conversations + Messages
// ---------------------------------------------------------------------------
const conversationsData: (typeof schema.conversations.$inferInsert)[] = [
  { id: 'conv_001', orderId: 'ORD7361P', participantOneId: 'CLI001P', participantTwoId: 'des002', participantOneName: 'Priya Sharma', participantTwoName: 'Rohan Kapoor', participantOneAvatarUrl: 'https://placehold.co/100x100.png', participantTwoAvatarUrl: 'https://placehold.co/100x100.png', participantOneAvatarHint: 'indian woman client', participantTwoAvatarHint: 'indian man designer', lastMessage: 'Sure, I can have the revised wireframes ready by tomorrow morning.', lastMessageTimestamp: daysAgo(0), unreadCountOne: 2, isPinnedOne: true },
  { id: 'conv_002', orderId: 'ORD5050T', participantOneId: 'CLI001P', participantTwoId: 'des003', participantOneName: 'Priya Sharma', participantTwoName: 'Aisha Khan', participantOneAvatarUrl: 'https://placehold.co/100x100.png', participantTwoAvatarUrl: 'https://placehold.co/100x100.png', participantOneAvatarHint: 'indian woman client', participantTwoAvatarHint: 'indian woman graphic artist', lastMessage: 'Excellent! The campaign is performing well. Thanks for the quick turnaround.', lastMessageTimestamp: daysAgo(1), unreadCountOne: 0 },
  { id: 'conv_admin_001', participantOneId: 'staff001', participantTwoId: 'usr001', participantOneName: 'Admin', participantTwoName: 'Priya Sharma', participantOneAvatarUrl: 'https://placehold.co/100x100.png', participantTwoAvatarUrl: 'https://placehold.co/100x100.png', lastMessage: 'Great, thanks for the update! Looking forward to the designs.', lastMessageTimestamp: daysAgo(0), unreadCountTwo: 0, isPinnedTwo: true },
  { id: 'conv_admin_002', participantOneId: 'staff001', participantTwoId: 'des002', participantOneName: 'Admin', participantTwoName: 'Rohan Kapoor', participantOneAvatarUrl: 'https://placehold.co/100x100.png', participantTwoAvatarUrl: 'https://placehold.co/100x100.png', lastMessage: 'Yes, I have submitted my portfolio for the new category.', lastMessageTimestamp: daysAgo(0) },
];

const messagesData: (typeof schema.messages.$inferInsert)[] = [
  // conv_001 (Client-Designer)
  { id: 'msg_c1_1', conversationId: 'conv_001', senderId: 'CLI001P', senderRole: 'client', text: 'Hi Rohan, I had a quick question about the wireframes for the dashboard.', timestamp: daysAgo(0), status: 'seen' },
  { id: 'msg_c1_2', conversationId: 'conv_001', senderId: 'des002', senderRole: 'designer', text: 'Hey! Of course, ask away. Happy to clarify anything.', timestamp: daysAgo(0), isPinned: true },
  { id: 'msg_c1_3', conversationId: 'conv_001', senderId: 'CLI001P', senderRole: 'client', text: 'The new analytics section looks great, but could we add a date range filter at the top?', timestamp: daysAgo(0), status: 'seen' },
  { id: 'msg_c1_4', conversationId: 'conv_001', senderId: 'des002', senderRole: 'designer', text: "Good catch! You're right, I can definitely add that in.", timestamp: daysAgo(0) },
  { id: 'msg_c1_5', conversationId: 'conv_001', senderId: 'des002', senderRole: 'designer', text: 'Sure, I can have the revised wireframes ready by tomorrow morning. Does that work for you?', timestamp: daysAgo(0) },
  // conv_002 (Client-Designer)
  { id: 'msg_c2_1', conversationId: 'conv_002', senderId: 'CLI001P', senderRole: 'client', text: 'Hi Aisha, thanks for the final social media graphics. They look perfect!', timestamp: daysAgo(1), status: 'seen' },
  { id: 'msg_c2_2', conversationId: 'conv_002', senderId: 'des003', senderRole: 'designer', text: "You're welcome! Glad you liked them. Let me know if you need anything else.", timestamp: daysAgo(1) },
  { id: 'msg_c2_3', conversationId: 'conv_002', senderId: 'CLI001P', senderRole: 'client', text: 'Excellent! The campaign is performing well. Thanks for the quick turnaround.', timestamp: daysAgo(1), status: 'seen' },
  // conv_admin_001 (Admin-Client)
  { id: 'msg_a1_1', conversationId: 'conv_admin_001', senderId: 'staff001', senderRole: 'admin', text: 'Hi Priya, just wanted to let you know your assigned designer has started working on the project.', timestamp: daysAgo(0) },
  { id: 'msg_a1_2', conversationId: 'conv_admin_001', senderId: 'usr001', senderRole: 'user', text: 'Great, thanks for the update! Looking forward to the designs.', timestamp: daysAgo(0) },
  // conv_admin_002 (Admin-Designer)
  { id: 'msg_a2_1', conversationId: 'conv_admin_002', senderId: 'staff001', senderRole: 'admin', text: 'Hi Rohan, did you get a chance to submit your portfolio for the Web UI/UX category?', timestamp: daysAgo(0) },
  { id: 'msg_a2_2', conversationId: 'conv_admin_002', senderId: 'des002', senderRole: 'user', text: 'Yes, I have submitted my portfolio for the new category.', timestamp: daysAgo(0) },
];

const chatFilesData: (typeof schema.chatFiles.$inferInsert)[] = [
  { id: 'cf_001', conversationId: 'conv_001', name: 'initial-brief.pdf', size: 120400, type: 'pdf', url: '#', timestamp: daysAgo(0) },
  { id: 'cf_002', conversationId: 'conv_001', name: 'inspiration.jpg', size: 800000, type: 'image', url: 'https://picsum.photos/seed/chatimg1/200/200', timestamp: daysAgo(0) },
];

// ---------------------------------------------------------------------------
// 16. Cart Items (demo)
// ---------------------------------------------------------------------------
const cartItemsData: (typeof schema.cartItems.$inferInsert)[] = [
  { id: 'cart_001', userId: 'usr001', serviceId: 'SVC001', tierId: 'tier_001_s', name: 'Modern Logo Design', tierName: 'Standard', price: '9999', imageUrl: 'https://placehold.co/100x100.png', imageHint: 'startup logo', quantity: 1 },
  { id: 'cart_002', userId: 'usr001', serviceId: 'SVC002', tierId: 'tier_002_b', name: 'Social Media Pack', tierName: 'Basic', price: '2499', imageUrl: 'https://placehold.co/100x100.png', imageHint: 'social media', quantity: 1 },
  { id: 'cart_003', userId: 'usr001', serviceId: 'SVC004', tierId: 'tier_004_s', name: 'UI/UX Web Design Mockup', tierName: 'Standard', price: '15999', imageUrl: 'https://placehold.co/100x100.png', imageHint: 'web design', quantity: 1 },
];

// ===========================================================================
// SEED RUNNER
// ===========================================================================

/** Remove undefined/null keys so Drizzle doesn't serialize them as empty strings */
function clean<T extends Record<string, unknown>>(obj: T): T {
  const result = { ...obj };
  for (const key of Object.keys(result)) {
    if (result[key] === null || result[key] === undefined) {
      delete result[key];
    }
  }
  return result;
}

async function seed() {
  console.log('🌱 Seeding database...\n');

  // Truncate everything (reverse FK order) so we start fresh
  console.log('  🗑️  Truncating all tables...');
  await client`TRUNCATE TABLE chat_files, messages, conversations, audit_logs, notifications, dispute_timeline_events, disputes, reports, reviews, cart_items, payment_methods, payout_requests, transactions, order_attachments, order_milestones, order_events, orders, service_approved_designers, service_tiers, services, service_subcategories, service_categories, brand_profiles, portfolio_items, blog_posts, site_settings, designer_profiles, users CASCADE`;
  console.log('  ✅ Tables truncated\n');

  // Order matters due to foreign keys
  const steps: [string, () => Promise<void>][] = [
    ['Users', async () => {
      for (const u of usersData) {
        await db.insert(schema.users).values(clean(u));
      }
    }],
    ['Designer Profiles', async () => {
      for (const dp of designerProfilesData) {
        await db.insert(schema.designerProfiles).values(clean(dp));
      }
    }],
    ['Site Settings', async () => {
      for (const s of siteSettingsData) {
        await db.insert(schema.siteSettings).values(clean(s));
      }
    }],
    ['Service Categories', async () => {
      for (const c of serviceCategoriesData) {
        await db.insert(schema.serviceCategories).values(clean(c));
      }
    }],
    ['Services', async () => {
      for (const s of servicesData) {
        await db.insert(schema.services).values(clean(s));
      }
    }],
    ['Service Tiers', async () => {
      for (const t of serviceTiersData) {
        await db.insert(schema.serviceTiers).values(clean(t));
      }
    }],
    ['Orders', async () => {
      for (const o of ordersData) {
        await db.insert(schema.orders).values(clean(o));
      }
    }],
    ['Order Events', async () => {
      for (const e of orderEventsData) {
        await db.insert(schema.orderEvents).values(clean(e));
      }
    }],
    ['Order Milestones', async () => {
      for (const m of orderMilestonesData) {
        await db.insert(schema.orderMilestones).values(clean(m));
      }
    }],
    ['Transactions', async () => {
      for (const t of transactionsData) {
        await db.insert(schema.transactions).values(clean(t));
      }
    }],
    ['Payout Requests', async () => {
      for (const p of payoutRequestsData) {
        await db.insert(schema.payoutRequests).values(clean(p));
      }
    }],
    ['Payment Methods', async () => {
      for (const pm of paymentMethodsData) {
        await db.insert(schema.paymentMethods).values(clean(pm));
      }
    }],
    ['Reviews', async () => {
      for (const r of reviewsData) {
        await db.insert(schema.reviews).values(clean(r));
      }
    }],
    ['Disputes', async () => {
      for (const d of disputesData) {
        await db.insert(schema.disputes).values(clean(d));
      }
    }],
    ['Dispute Timeline', async () => {
      for (const dt of disputeTimelineData) {
        await db.insert(schema.disputeTimelineEvents).values(clean(dt));
      }
    }],
    ['Reports', async () => {
      for (const r of reportsData) {
        await db.insert(schema.reports).values(clean(r));
      }
    }],
    ['Notifications', async () => {
      for (const n of notificationsData) {
        await db.insert(schema.notifications).values(clean(n));
      }
    }],
    ['Conversations', async () => {
      for (const c of conversationsData) {
        await db.insert(schema.conversations).values(clean(c));
      }
    }],
    ['Messages', async () => {
      for (const m of messagesData) {
        await db.insert(schema.messages).values(clean(m));
      }
    }],
    ['Chat Files', async () => {
      for (const cf of chatFilesData) {
        await db.insert(schema.chatFiles).values(clean(cf));
      }
    }],
    ['Cart Items', async () => {
      for (const ci of cartItemsData) {
        await db.insert(schema.cartItems).values(clean(ci));
      }
    }],
    ['Audit Logs', async () => {
      for (const al of auditLogsData) {
        await db.insert(schema.auditLogs).values(clean(al));
      }
    }],
    ['Blog Posts (re-seed)', async () => {
      await db.insert(schema.blogPosts).values([
        { id: 'blog_seed_1', title: '5 Design Trends to Watch in 2025', excerpt: 'Explore emerging design trends.', content: 'From AI-assisted design to bold typography...', authorName: 'HYPE Team', publishDate: daysAgo(10), status: 'Published', category: 'Design Trends', categorySlug: 'design-trends', tags: ['design trends', '2025', 'UI/UX'], views: 1250, likes: 89, comments: 12 },
        { id: 'blog_seed_2', title: 'How to Write a Perfect Design Brief', excerpt: 'A comprehensive guide to writing effective design briefs.', content: 'A great design project starts with a great brief...', authorName: 'Aditi Singh', publishDate: daysAgo(20), status: 'Published', category: 'Guides', categorySlug: 'guides', tags: ['design brief', 'tips', 'client guide'], views: 980, likes: 67, comments: 8 },
        { id: 'blog_seed_3', title: 'The Rise of Indian Design Studios', excerpt: 'Indian design studios are gaining global recognition.', content: 'From Bangalore to Mumbai, Indian design studios...', authorName: 'HYPE Team', publishDate: daysAgo(30), status: 'Published', category: 'Industry News', categorySlug: 'industry-news', tags: ['Indian design', 'industry', 'studios'], views: 750, likes: 45, comments: 5 },
      ]).onConflictDoNothing();
    }],
  ];

  for (const [name, fn] of steps) {
    try {
      await fn();
      console.log(`  ✅ ${name}`);
    } catch (err) {
      console.error(`  ❌ ${name}:`, err);
    }
  }

  // Print summary counts
  console.log('\n📊 Summary:');
  const tables = [
    ['users', schema.users],
    ['designer_profiles', schema.designerProfiles],
    ['site_settings', schema.siteSettings],
    ['service_categories', schema.serviceCategories],
    ['services', schema.services],
    ['service_tiers', schema.serviceTiers],
    ['orders', schema.orders],
    ['order_events', schema.orderEvents],
    ['order_milestones', schema.orderMilestones],
    ['transactions', schema.transactions],
    ['payout_requests', schema.payoutRequests],
    ['payment_methods', schema.paymentMethods],
    ['reviews', schema.reviews],
    ['disputes', schema.disputes],
    ['dispute_timeline_events', schema.disputeTimelineEvents],
    ['reports', schema.reports],
    ['notifications', schema.notifications],
    ['conversations', schema.conversations],
    ['messages', schema.messages],
    ['chat_files', schema.chatFiles],
    ['cart_items', schema.cartItems],
    ['audit_logs', schema.auditLogs],
    ['blog_posts', schema.blogPosts],
    ['portfolio_items', schema.portfolioItems],
  ] as const;

  for (const [name, table] of tables) {
    try {
      const rows = await db.select({ id: (table as any).id }).from(table as any);
      console.log(`  ${name}: ${rows.length} rows`);
    } catch {
      console.log(`  ${name}: (error counting)`);
    }
  }

  console.log('\n🎉 Seed complete!');
}

seed().catch((err) => {
  console.error('Seed failed:', err);
  process.exit(1);
});
