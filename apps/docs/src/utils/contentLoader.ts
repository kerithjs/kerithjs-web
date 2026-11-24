import { KERITH_DOCS_CONFIG } from '@/config/docs-manifest';

// Using Vite's import.meta.glob to dynamically load markdown files as raw text.
const contentModules = import.meta.glob('../content/**/*.md', { query: '?raw', import: 'default', eager: false });

/**
 * Loads the raw markdown content for a given slug.
 */
export async function getDocContent(slug: string): Promise<string | null> {
  // Find the page in the manifest
  let pageFile: string | null = null;
  
  for (const section of KERITH_DOCS_CONFIG.sections) {
    const page = section.pages.find(p => p.id === slug);
    if (page) {
      pageFile = page.file;
      break;
    }
  }

  if (!pageFile) {
    return null;
  }

  const path = `../content/${pageFile}.md`;
  const loader = contentModules[path];

  if (!loader) {
    console.warn(`File not found for slug "${slug}": ${path}`);
    return null;
  }

  try {
    const rawContent = await loader();
    if (typeof rawContent === 'string') return rawContent;
    if (rawContent && typeof rawContent === 'object' && 'default' in rawContent) {
      return rawContent.default as string;
    }
    return null;
  } catch (error) {
    console.error(`Error loading documentation for slug: ${slug}`, error);
    return null;
  }
}

/**
 * Returns a list of all available documentation slugs from the manifest.
 */
export function getAllDocSlugs(): string[] {
  const slugs: string[] = [];
  for (const section of KERITH_DOCS_CONFIG.sections) {
    for (const page of section.pages) {
      slugs.push(page.id);
    }
  }
  return slugs;
}
