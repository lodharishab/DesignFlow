import type { MetadataRoute } from 'next';
import { getAllBlogPosts } from '@/lib/blog-db';
import { getAllServices } from '@/lib/services-db';
import { getAllDesigners } from '@/lib/designer-db';
import { getAllPortfolioItems } from '@/lib/portfolio-db';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || `https://${process.env.REPLIT_DEV_DOMAIN || 'localhost:5000'}`;

  // Static pages
  const staticPages: MetadataRoute.Sitemap = [
    { url: baseUrl, lastModified: new Date(), changeFrequency: 'daily', priority: 1.0 },
    { url: `${baseUrl}/about`, lastModified: new Date(), changeFrequency: 'monthly', priority: 0.7 },
    { url: `${baseUrl}/design-services`, lastModified: new Date(), changeFrequency: 'weekly', priority: 0.9 },
    { url: `${baseUrl}/services`, lastModified: new Date(), changeFrequency: 'weekly', priority: 0.9 },
    { url: `${baseUrl}/portfolio`, lastModified: new Date(), changeFrequency: 'weekly', priority: 0.8 },
    { url: `${baseUrl}/blog`, lastModified: new Date(), changeFrequency: 'daily', priority: 0.8 },
    { url: `${baseUrl}/how-it-works`, lastModified: new Date(), changeFrequency: 'monthly', priority: 0.6 },
    { url: `${baseUrl}/faq`, lastModified: new Date(), changeFrequency: 'monthly', priority: 0.5 },
    { url: `${baseUrl}/contact-support`, lastModified: new Date(), changeFrequency: 'monthly', priority: 0.5 },
    { url: `${baseUrl}/terms-of-service`, lastModified: new Date(), changeFrequency: 'yearly', priority: 0.3 },
    { url: `${baseUrl}/privacy-policy`, lastModified: new Date(), changeFrequency: 'yearly', priority: 0.3 },
    { url: `${baseUrl}/refund-policy`, lastModified: new Date(), changeFrequency: 'yearly', priority: 0.3 },
  ];

  // Dynamic pages
  let blogPages: MetadataRoute.Sitemap = [];
  let servicePages: MetadataRoute.Sitemap = [];
  let designerPages: MetadataRoute.Sitemap = [];
  let portfolioPages: MetadataRoute.Sitemap = [];

  try {
    const [blogPosts, services, designers, portfolioItems] = await Promise.all([
      getAllBlogPosts(),
      getAllServices(),
      getAllDesigners(),
      getAllPortfolioItems(),
    ]);

    blogPages = blogPosts
      .filter(p => p.status === 'Published')
      .map(post => ({
        url: `${baseUrl}/blog/${post.slug}`,
        lastModified: post.publishDate ? new Date(post.publishDate) : new Date(),
        changeFrequency: 'weekly' as const,
        priority: 0.7,
      }));

    servicePages = services.map(service => ({
      url: `${baseUrl}/services/${service.id}`,
      lastModified: new Date(),
      changeFrequency: 'weekly' as const,
      priority: 0.8,
    }));

    designerPages = designers
      .filter(d => d.status === 'Active' || !d.status)
      .map(designer => ({
        url: `${baseUrl}/designers/${designer.slug}`,
        lastModified: new Date(),
        changeFrequency: 'weekly' as const,
        priority: 0.6,
      }));

    portfolioPages = portfolioItems.map(item => ({
      url: `${baseUrl}/portfolio/${item.id}`,
      lastModified: new Date(),
      changeFrequency: 'monthly' as const,
      priority: 0.5,
    }));
  } catch (error) {
    console.error('Error generating sitemap:', error);
  }

  return [...staticPages, ...blogPages, ...servicePages, ...designerPages, ...portfolioPages];
}
