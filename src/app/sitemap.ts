import { MetadataRoute } from 'next';
import { getKaryaPublikList } from '@/lib/data/publik';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://parabot.id';
  const karyaList = await getKaryaPublikList();

  const karyaUrls: MetadataRoute.Sitemap = karyaList.map((karya) => ({
    url: `${baseUrl}/karya/${karya.slug}`,
    lastModified: new Date(karya.diperbarui_pada),
    changeFrequency: 'weekly',
    priority: 0.8,
  }));

  return [
    {
      url: baseUrl,
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 1.0,
    },
    {
      url: `${baseUrl}/tentang`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.5,
    },
    ...karyaUrls,
  ];
}
