import GithubSlugger from 'github-slugger';

export interface Heading {
  id: string;
  title: string;
  level: number;
}

// Matches the {#custom-id} suffix used by remark-heading-id
const EXPLICIT_ID_REGEX = /\s*\{#([\w-]+)\}\s*$/;

/**
 * Strips markdown inline code backticks from a heading title for clean display.
 */
function cleanTitle(raw: string): string {
  // Remove {#id} suffix first, then strip backtick pairs for readability
  return raw
    .replace(EXPLICIT_ID_REGEX, '')
    .replace(/`([^`]+)`/g, '$1')
    .trim();
}

/**
 * Extracts h2 and h3 headings from a markdown string.
 * Respects explicit {#id} anchors (remark-heading-id syntax) and falls back
 * to github-slugger for headings without one.
 */
export function extractHeadings(markdown: string): Heading[] {
  const slugger = new GithubSlugger();
  const headingRegex = /^(#{2,3})\s+(.+)$/gm;
  const headings: Heading[] = [];
  let match;

  while ((match = headingRegex.exec(markdown)) !== null) {
    const level = match[1].length;
    const rawTitle = match[2].trim();

    // Check for an explicit {#id}
    const idMatch = EXPLICIT_ID_REGEX.exec(rawTitle);
    const id = idMatch ? idMatch[1] : slugger.slug(rawTitle);
    const title = cleanTitle(rawTitle);

    headings.push({ id, title, level });
  }

  return headings;
}
