
'use server';
import type { ObjectId } from 'mongodb'; // Assuming you might use MongoDB later
import { isDbEnabled, connectToDatabase } from './mongodb';
import type { Collection } from 'mongodb';

// Define the structure of a blog post
export interface BlogPost {
  _id?: string | ObjectId; // Optional MongoDB ID
  id: string; // Unique slug for URL
  title: string;
  excerpt: string;
  content: string; // Can be Markdown or HTML
  authorName: string;
  authorId?: string; // Optional author ID link
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

// Mock data for blog posts
const MOCK_BLOG_POSTS: BlogPost[] = [
  {
    _id: 'mock_id_1',
    id: 'first-post-welcome-to-designflow',
    title: 'Welcome to DesignFlow: Your Creative Hub in India!',
    excerpt: 'Discover how DesignFlow is revolutionizing the way clients and designers collaborate in India. Learn about our mission and vision.',
    content: `
<p>Welcome to the official DesignFlow blog! We are thrilled to launch this platform, dedicated to connecting talented Indian designers with clients seeking high-quality, creative solutions.</p>
<p>Our mission is simple: to make the process of finding, hiring, and working with designers seamless, transparent, and enjoyable for everyone involved. Whether you're a startup in Bangalore looking for a cutting-edge logo, a small business in Jaipur needing beautiful print materials, or a large enterprise requiring comprehensive UI/UX design, DesignFlow is here to help.</p>
<h3 class="font-headline text-xl mt-4 mb-2">What to Expect</h3>
<ul class="list-disc list-inside space-y-1">
  <li>Insights into the Indian design industry.</li>
  <li>Tips for clients on writing effective design briefs.</li>
  <li>Showcases of amazing work from our talented designers.</li>
  <li>Updates on new features and services on DesignFlow.</li>
</ul>
<p class="mt-4">Stay tuned for more exciting content!</p>
    `,
    authorName: 'The DesignFlow Team',
    authorAvatarUrl: 'https://placehold.co/40x40.png',
    authorAvatarHint: 'team logo',
    publishDate: new Date('2024-07-20T10:00:00Z'),
    status: 'Published',
    featuredImageUrl: 'https://placehold.co/800x450.png',
    featuredImageHint: 'creative design abstract',
    category: 'Announcements',
    categorySlug: 'announcements',
    tags: ['welcome', 'designflow', 'indian design'],
    views: 1250,
    likes: 150,
    comments: 22,
  },
  {
    _id: 'mock_id_2',
    id: 'top-5-logo-design-trends-in-india-2024',
    title: 'Top 5 Logo Design Trends in India for 2024',
    excerpt: 'Explore the latest logo design trends captivating the Indian market, from vibrant colors to minimalist aesthetics incorporating local motifs.',
    content: `
<p>The Indian design landscape is constantly evolving. In 2024, we're seeing some exciting trends in logo design that blend global aesthetics with unique local flavors. Here are five trends to watch out for:</p>
<h3 class="font-headline text-xl mt-4 mb-2">1. Hyper-Local Motifs</h3>
<p>Incorporating elements from regional art forms, architecture, and culture to create a distinct Indian identity.</p>
<h3 class="font-headline text-xl mt-4 mb-2">2. Vivid Color Palettes</h3>
<p>Moving beyond muted tones to embrace the vibrant and diverse colors that represent India.</p>
<h3 class="font-headline text-xl mt-4 mb-2">3. Storytelling through Symbols</h3>
<p>Logos that subtly narrate a brand's story or heritage using meaningful Indian symbols.</p>
<h3 class="font-headline text-xl mt-4 mb-2">4. Animated & Adaptive Logos</h3>
<p>Designs that can morph and animate for digital platforms, offering a dynamic brand experience.</p>
<h3 class="font-headline text-xl mt-4 mb-2">5. Sustainable & Eco-Conscious Branding</h3>
<p>Logos and branding that reflect a commitment to environmental responsibility, resonating with the growing eco-awareness in India.</p>
    `,
    authorName: 'Aisha Khan', // Example designer
    authorAvatarUrl: 'https://placehold.co/40x40.png',
    authorAvatarHint: 'indian woman graphic artist',
    publishDate: new Date('2024-07-22T14:30:00Z'),
    status: 'Published',
    featuredImageUrl: 'https://placehold.co/800x450.png',
    featuredImageHint: 'logo design trends collage',
    category: 'Design Trends',
    categorySlug: 'design-trends',
    tags: ['logo design', 'branding', 'indian trends', '2024 trends'],
    views: 2500,
    likes: 320,
    comments: 45,
  },
  {
    _id: 'mock_id_3',
    id: 'how-to-write-a-killer-design-brief-for-indian-designers',
    title: 'How to Write a Killer Design Brief for Indian Designers',
    excerpt: 'A clear brief is the foundation of any successful design project. Learn how to communicate your vision effectively to designers in India.',
    content: `
<p>A well-crafted design brief is your roadmap to getting the design you envision. When working with talented Indian designers, here are key elements to include:</p>
<h3 class="font-headline text-xl mt-4 mb-2">1. Company Overview</h3>
<p>Briefly describe your business, its mission, and what makes it unique in the Indian market.</p>
<h3 class="font-headline text-xl mt-4 mb-2">2. Project Goals</h3>
<p>What do you want this design to achieve? Increase brand awareness? Drive sales? Clearly state your objectives.</p>
<h3 class="font-headline text-xl mt-4 mb-2">3. Target Audience in India</h3>
<p>Who are you trying to reach? Be specific about demographics, psychographics, and cultural nuances relevant to India.</p>
<h3 class="font-headline text-xl mt-4 mb-2">4. Scope & Deliverables</h3>
<p>What exactly do you need? List all required assets (e.g., logo files, social media templates, print-ready PDFs).</p>
<h3 class="font-headline text-xl mt-4 mb-2">5. Style & Tone</h3>
<p>Provide examples of designs you like (and dislike). Describe the desired aesthetic (e.g., modern, traditional Indian, minimalist, vibrant).</p>
<p class="mt-4">By providing these details, you empower your designer to create something truly exceptional that aligns with your vision and resonates with your Indian audience.</p>
    `,
    authorName: 'Priya Sharma', // Example designer
    authorAvatarUrl: 'https://placehold.co/40x40.png',
    authorAvatarHint: 'indian woman designer',
    publishDate: new Date('2024-07-18T09:00:00Z'),
    status: 'Draft',
    featuredImageUrl: 'https://placehold.co/800x450.png',
    featuredImageHint: 'design brief document',
    category: 'Client Tips',
    categorySlug: 'client-tips',
    tags: ['design brief', 'client guide', 'collaboration', 'project management'],
    views: 500,
    likes: 45,
    comments: 5,
  },
];

async function getBlogCollection(): Promise<Collection<BlogPost> | null> {
  if (!isDbEnabled()) return null;
  try {
    const { db } = await connectToDatabase();
    return db.collection<BlogPost>('blogPosts');
  } catch (error) {
    console.error("Failed to get blog collection:", error);
    return null;
  }
}

// Simulate fetching all blog posts
export async function getAllBlogPosts(): Promise<BlogPost[]> {
  const collection = await getBlogCollection();
  if (!collection) {
    console.log("DB not enabled. Returning mock blog posts.");
    return MOCK_BLOG_POSTS.sort((a, b) => b.publishDate.getTime() - a.publishDate.getTime());
  }

  try {
    const posts = await collection.find({}).sort({ publishDate: -1 }).toArray();
    return posts.map(p => ({ ...p, _id: p._id.toString() }));
  } catch(e) {
    console.error("Error fetching blog posts from DB, returning mock data:", e);
    return MOCK_BLOG_POSTS.sort((a, b) => b.publishDate.getTime() - a.publishDate.getTime());
  }
}

// Simulate fetching a single blog post by its slug (id)
export async function getBlogPostBySlug(slug: string): Promise<BlogPost | null> {
    const collection = await getBlogCollection();
    if (!collection) {
        console.log("DB not enabled. Searching mock blog posts.");
        const post = MOCK_BLOG_POSTS.find(p => p.id === slug);
        return post || null;
    }
  
    try {
        const post = await collection.findOne({ id: slug });
        if (!post) return null;
        return { ...post, _id: post._id.toString() };
    } catch (e) {
        console.error(`Error fetching post ${slug} from DB, returning mock data:`, e);
        const post = MOCK_BLOG_POSTS.find(p => p.id === slug);
        return post || null;
    }
}

// Simulate creating a blog post (for admin functionality)
export async function createBlogPost(postData: Omit<BlogPost, '_id' | 'publishDate'> & { publishDateString?: string }): Promise<BlogPost | null> {
  const collection = await getBlogCollection();
  const newPostData: Omit<BlogPost, '_id'> = {
    ...postData,
    publishDate: postData.publishDateString ? new Date(postData.publishDateString) : new Date(),
    views: 0,
    likes: 0,
    comments: 0,
  };

  if (!collection) {
    console.log("DB not enabled. Simulating blog post creation.");
    const newPost: BlogPost = {
        _id: new ObjectId().toHexString(),
        ...newPostData
    }
    MOCK_BLOG_POSTS.unshift(newPost);
    return newPost;
  }
  
  try {
      const result = await collection.insertOne(newPostData);
      return { _id: result.insertedId.toString(), ...newPostData };
  } catch (error) {
    console.error('Error creating blog post:', error);
    return null;
  }
}

// Simulate updating a blog post
export async function updateBlogPost(postId: string, postData: Partial<Omit<BlogPost, '_id' | 'id' | 'publishDate'>> & { publishDateString?: string }): Promise<BlogPost | null> {
  const collection = await getBlogCollection();
  const updatedFields: Partial<BlogPost> = { ...postData };
  if (postData.publishDateString) {
    updatedFields.publishDate = new Date(postData.publishDateString);
    delete updatedFields.publishDateString;
  }

  if (!collection) {
    console.log("DB not enabled. Simulating blog post update.");
    const postIndex = MOCK_BLOG_POSTS.findIndex(p => p.id === postId);
    if (postIndex === -1) return null;
    MOCK_BLOG_POSTS[postIndex] = { ...MOCK_BLOG_POSTS[postIndex], ...updatedFields };
    return MOCK_BLOG_POSTS[postIndex];
  }

  try {
    const result = await collection.findOneAndUpdate(
        { id: postId },
        { $set: updatedFields },
        { returnDocument: 'after' }
    );
    if (!result) return null;
    return { ...result, _id: result._id.toString() };
  } catch (error) {
    console.error('Error updating blog post:', error);
    return null;
  }
}

// Simulate deleting a blog post
export async function deleteBlogPost(postId: string): Promise<boolean> {
  const collection = await getBlogCollection();
  if (!collection) {
    console.log("DB not enabled. Simulating blog post deletion.");
    const initialLength = MOCK_BLOG_POSTS.length;
    const indexToRemove = MOCK_BLOG_POSTS.findIndex(p => p.id === postId);
    if (indexToRemove > -1) {
      MOCK_BLOG_POSTS.splice(indexToRemove, 1);
      return MOCK_BLOG_POSTS.length < initialLength;
    }
    return false;
  }

  try {
    const result = await collection.deleteOne({ id: postId });
    return result.deletedCount === 1;
  } catch (error) {
    console.error('Error deleting blog post:', error);
    return false;
  }
}

    