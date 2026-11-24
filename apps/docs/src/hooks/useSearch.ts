import { useState, useEffect, useCallback } from "react";
import { KERITH_DOCS_CONFIG } from "@/config/docs-manifest";
import type { LucideIcon } from "lucide-react";

export interface SearchResult {
  title: string;
  section: string;
  path: string;
  icon?: LucideIcon;
  isChild?: boolean;
}

function buildIndex(): SearchResult[] {
  const results: SearchResult[] = [];
  for (const section of KERITH_DOCS_CONFIG.sections) {
    for (const page of section.pages) {
      results.push({
        title: page.title,
        section: section.label,
        path: `/docs/${page.file}`,
        icon: page.icon,
        isChild: false,
      });
      if (page.children) {
        for (const child of page.children) {
          results.push({
            title: child.label,
            section: page.title,
            path: child.path,
            icon: page.icon,
            isChild: true,
          });
        }
      }
    }
  }
  return results;
}

const SEARCH_INDEX = buildIndex();

export function useSearch() {
  const [isOpen, setIsOpen] = useState(false);
  const [query, setQuery] = useState("");

  const open = useCallback(() => setIsOpen(true), []);
  const close = useCallback(() => {
    setIsOpen(false);
    setQuery("");
  }, []);

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === "k") {
        e.preventDefault();
        setIsOpen((prev) => !prev);
      }
      if (e.key === "Escape") close();
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [close]);

  const results: SearchResult[] =
    query.trim().length === 0
      ? SEARCH_INDEX.slice(0, 8)
      : SEARCH_INDEX.filter(
          (item) =>
            item.title.toLowerCase().includes(query.toLowerCase()) ||
            item.section.toLowerCase().includes(query.toLowerCase())
        ).slice(0, 10);

  return { isOpen, open, close, query, setQuery, results };
}
