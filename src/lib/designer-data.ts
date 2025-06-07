
"use client";

export interface DesignerProfile {
  id: string; // e.g., 'des001'
  slug: string; // e.g., 'alice-wonderland'
  name: string;
  avatarUrl: string;
  imageHint: string;
  bio: string;
  specialties: string[];
  location?: string;
  memberSince?: Date;
  website?: string;
  socialLinks?: { platform: string; url: string }[];
}

export const designersData: DesignerProfile[] = [
  {
    id: 'des001',
    slug: 'alice-wonderland',
    name: 'Alice Wonderland',
    avatarUrl: 'https://placehold.co/150x150.png',
    imageHint: 'woman avatar smiling',
    bio: 'Alice is a creative visionary with over 7 years of experience specializing in brand identity, web UI/UX, and illustrative design. She believes in crafting designs that tell a story and connect deeply with the audience. Her approach is collaborative and client-focused, ensuring every project is a masterpiece.',
    specialties: ['Logo Design', 'Web UI/UX', 'Branding', 'Illustration', 'Icon Design'],
    location: 'New York, USA',
    memberSince: new Date(2022, 5, 10),
    website: 'https://example.com/alice',
    socialLinks: [
        { platform: 'Behance', url: '#' },
        { platform: 'Dribbble', url: '#' },
    ]
  },
  {
    id: 'des002',
    slug: 'bob-the-builder',
    name: 'Bob The Builder',
    avatarUrl: 'https://placehold.co/150x150.png',
    imageHint: 'man avatar professional',
    bio: 'Bob is a meticulous and detail-oriented designer with a knack for creating intuitive app interfaces and sustainable packaging solutions. He enjoys tackling complex challenges and transforming them into elegant and functional designs. Bob is proficient in Figma, Adobe XD, and Cinema 4D.',
    specialties: ['App Design', 'Packaging Design', 'UI/UX', '3D Modeling', 'Print Design'],
    location: 'London, UK',
    memberSince: new Date(2021, 8, 15),
  },
  {
    id: 'des003',
    slug: 'carol-danvers',
    name: 'Carol Danvers',
    avatarUrl: 'https://placehold.co/150x150.png',
    imageHint: 'woman avatar confident',
    bio: 'Carol brings energy and innovation to every project, specializing in motion graphics, social media campaigns, and compelling brand narratives. She has a strong background in digital marketing and understands how to create visuals that convert. Her work is dynamic and always on-trend.',
    specialties: ['Social Media Graphics', 'Motion Graphics', 'Video Editing', 'Branding', 'Content Creation'],
    location: 'Los Angeles, USA',
    memberSince: new Date(2023, 1, 20),
    socialLinks: [
        { platform: 'Instagram', url: '#' },
    ]
  },
   {
    id: 'des004',
    slug: 'david-copperfield',
    name: 'David Copperfield',
    avatarUrl: 'https://placehold.co/150x150.png',
    imageHint: 'man avatar creative',
    bio: 'David is a master of print design and presentation aesthetics. With an eye for typography and layout, he creates impactful print materials and pitch decks that captivate audiences. He has worked with numerous corporate clients to elevate their visual communication.',
    specialties: ['Print Design', 'Presentation Design', 'Typography', 'Layout Design', 'Corporate Branding'],
    location: 'Toronto, Canada',
    memberSince: new Date(2020, 10, 5),
  },
];
