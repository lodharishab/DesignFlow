
export interface DesignerProfile {
  id: string; // e.g., 'des001'
  slug: string; // e.g., 'priya-sharma'
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
  // New rating fields
  profileCompletenessScore?: number; // e.g., 0-100
  adminRanking?: number; // e.g., 1-5 (admin set initial rank, 5 is best)
  clientRatingAverage?: number | null; // e.g., 1-5, null if no ratings yet
  clientRatingCount?: number; // Number of client ratings
  overallRanking?: number; // Derived score, initially can be based on adminRanking
  badges?: ('Top Rated' | 'Rising Talent' | 'On-Time Delivery' | 'Verified')[];
}

export const designersData: DesignerProfile[] = [
  {
    id: 'des001',
    slug: 'priya-sharma',
    name: 'Priya Sharma',
    email: 'priya.sharma@example.in',
    avatarUrl: 'https://placehold.co/150x150.png',
    imageHint: 'indian woman designer smiling',
    bio: 'Priya is a creative visionary from Mumbai with over 7 years of experience specializing in brand identity, web UI/UX, and illustrative design. She believes in crafting designs that tell a story and connect deeply with the audience, especially within the vibrant Indian market. Her approach is collaborative and client-focused.',
    specialties: ['Logo Design', 'Web UI/UX', 'Branding', 'Illustration', 'Icon Design'],
    location: 'Mumbai, India',
    memberSince: new Date(2022, 5, 10),
    website: 'https://example.com/priyasharma',
    socialLinks: [
        { platform: 'Behance', url: '#' },
        { platform: 'Instagram', url: '#' },
    ],
    profileCompletenessScore: 95,
    adminRanking: 5,
    clientRatingAverage: 4.8,
    clientRatingCount: 23,
    overallRanking: 5,
    badges: ['Top Rated', 'On-Time Delivery', 'Verified'],
  },
  {
    id: 'des002',
    slug: 'rohan-kapoor',
    name: 'Rohan Kapoor',
    email: 'rohan.kapoor@example.in',
    avatarUrl: 'https://placehold.co/150x150.png',
    imageHint: 'indian man software developer',
    bio: 'Rohan, based in Bangalore, is a meticulous and detail-oriented designer with a knack for creating intuitive app interfaces and sustainable packaging solutions. He enjoys tackling complex challenges and transforming them into elegant and functional designs for both Indian and international clients. Proficient in Figma, Adobe XD, and Cinema 4D.',
    specialties: ['App Design', 'Packaging Design', 'UI/UX', '3D Modeling', 'Print Design'],
    location: 'Bangalore, India',
    memberSince: new Date(2021, 8, 15),
    socialLinks: [
        { platform: 'Dribbble', url: '#' },
        { platform: 'LinkedIn', url: '#' },
    ],
    profileCompletenessScore: 90,
    adminRanking: 4,
    clientRatingAverage: 4.7,
    clientRatingCount: 18,
    overallRanking: 4,
    badges: ['On-Time Delivery', 'Verified'],
  },
  {
    id: 'des003',
    slug: 'aisha-khan',
    name: 'Aisha Khan',
    email: 'aisha.khan@example.in',
    avatarUrl: 'https://placehold.co/150x150.png',
    imageHint: 'indian woman graphic artist',
    bio: 'Aisha, from Delhi, brings energy and innovation to every project, specializing in motion graphics, social media campaigns, and compelling brand narratives for the Indian youth market. She has a strong background in digital marketing and understands how to create visuals that convert. Her work is dynamic and always on-trend.',
    specialties: ['Social Media Graphics', 'Motion Graphics', 'Video Editing', 'Branding', 'Content Creation'],
    location: 'Delhi, India',
    memberSince: new Date(2023, 1, 20),
    socialLinks: [
        { platform: 'Instagram', url: '#' },
        { platform: 'YouTube', url: '#' },
    ],
    profileCompletenessScore: 88,
    adminRanking: 4,
    clientRatingAverage: 4.9,
    clientRatingCount: 30,
    overallRanking: 4,
    badges: ['Top Rated', 'Verified'],
  },
   {
    id: 'des004',
    slug: 'vikram-singh',
    name: 'Vikram Singh',
    email: 'vikram.singh@example.in',
    avatarUrl: 'https://placehold.co/150x150.png',
    imageHint: 'indian man architect thinking',
    bio: 'Vikram, working out of Jaipur, is a master of print design and presentation aesthetics. With an eye for typography and layout, he creates impactful print materials and pitch decks that captivate audiences. He has worked with numerous corporate clients to elevate their visual communication, blending modern design with Indian aesthetics.',
    specialties: ['Print Design', 'Presentation Design', 'Typography', 'Layout Design', 'Corporate Branding'],
    location: 'Jaipur, India',
    memberSince: new Date(2020, 10, 5),
    website: 'https://example.com/vikramdesign',
    profileCompletenessScore: 92,
    adminRanking: 5,
    clientRatingAverage: 4.6,
    clientRatingCount: 15,
    overallRanking: 5,
    badges: ['On-Time Delivery', 'Verified'],
  },
  {
    id: 'des005',
    slug: 'sunita-reddy',
    name: 'Sunita Reddy',
    email: 'sunita.reddy@example.in',
    avatarUrl: 'https://placehold.co/150x150.png',
    imageHint: 'indian woman entrepreneur',
    bio: 'Sunita is a Hyderabad-based UI/UX designer passionate about creating user-centered experiences for startups. She excels in translating complex requirements into simple and beautiful interfaces. Her portfolio includes work for various tech startups in the healthcare and education sectors.',
    specialties: ['Web UI/UX', 'App Design', 'User Research', 'Prototyping', 'Figma'],
    location: 'Hyderabad, India',
    memberSince: new Date(2022, 2, 18),
    socialLinks: [
        { platform: 'LinkedIn', url: '#' },
    ],
    profileCompletenessScore: 85,
    adminRanking: 3,
    clientRatingAverage: null, // No client ratings yet
    clientRatingCount: 0,
    overallRanking: 3,
    badges: ['Verified', 'Rising Talent'],
  },
  {
    id: 'des006',
    slug: 'arjun-mehta',
    name: 'Arjun Mehta',
    email: 'arjun.mehta@example.in',
    avatarUrl: 'https://placehold.co/150x150.png',
    imageHint: 'indian man photographer',
    bio: 'Arjun, from Pune, focuses on illustration and branding, with a special love for traditional Indian art forms adapted for modern brands. He creates unique visuals that tell compelling stories and evoke emotion. His work often features intricate details and vibrant colors.',
    specialties: ['Illustration', 'Branding', 'Logo Design', 'Digital Art', 'Cultural Design'],
    location: 'Pune, India',
    memberSince: new Date(2021, 11, 30),
    website: 'https://example.com/arjunmehtaart',
    profileCompletenessScore: 80,
    adminRanking: 4,
    clientRatingAverage: 4.5,
    clientRatingCount: 12,
    overallRanking: 4,
    badges: ['Verified'],
  },
  {
    id: 'des007',
    slug: 'neha-joshi',
    name: 'Neha Joshi',
    email: 'neha.joshi@example.in',
    avatarUrl: 'https://placehold.co/150x150.png',
    imageHint: 'indian woman fashion designer',
    bio: 'Based in Chennai, Neha is an expert in packaging design and print materials, helping brands make a strong first impression. She has a keen understanding of materials and printing processes, ensuring designs are not only beautiful but also practical and sustainable.',
    specialties: ['Packaging Design', 'Print Design', 'Brand Identity', 'Sustainable Design', 'Label Design'],
    location: 'Chennai, India',
    memberSince: new Date(2023, 4, 5),
    profileCompletenessScore: 75,
    adminRanking: 3,
    clientRatingAverage: 4.2,
    clientRatingCount: 8,
    overallRanking: 3,
    badges: ['Verified'],
  }
];
