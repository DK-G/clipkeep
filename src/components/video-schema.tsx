import { GalleryItem } from './gallery-section';
import { SITE_URL } from '@/lib/site-url';

interface VideoSchemaProps {
  items: GalleryItem[];
}

export function VideoSchema({ items }: VideoSchemaProps) {
  if (!items || items.length === 0) return null;

  const schema = {
    '@context': 'https://schema.org',
    '@type': 'ItemList',
    itemListElement: items.map((item, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      item: {
        '@type': 'VideoObject',
        name: `Video ${item.id} from ${new URL(item.source_url).hostname}`,
        description: 'Viral video extracted via ClipKeep.',
        thumbnailUrl: item.thumbnail_url,
        uploadDate: item.created_at || '2024-03-12T00:00:00Z',
        contentUrl: `${SITE_URL}/result/${item.id}`,
        embedUrl: `${SITE_URL}/result/${item.id}`,
      },
    })),
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  );
}
