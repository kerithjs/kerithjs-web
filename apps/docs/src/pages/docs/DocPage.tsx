import { useEffect, useState } from "react";
import { useParams, useNavigate, useLocation } from "react-router";
import DocContent from "@/components/docs/DocContent";
import DocLoading from "@/components/docs/DocLoading";
import TOC from "@/components/docs/TOC";
import { getDocContent } from "@/utils/contentLoader";
import { extractHeadings, type Heading } from "@/utils/mdUtils";
import { KERITH_DOCS_CONFIG } from "@/config/docs-manifest";

export default function DocPage() {
  const { slug } = useParams<{ slug: string }>();
  const navigate = useNavigate();
  const location = useLocation();
  const [content, setContent] = useState<string | null>(null);
  const [headings, setHeadings] = useState<Heading[]>([]);
  const [loading, setLoading] = useState(true);

  // Load markdown content when the slug changes
  useEffect(() => {
    async function loadContent() {
      if (!slug) return;

      setLoading(true);
      const rawContent = await getDocContent(slug);

      if (rawContent) {
        setContent(rawContent);
        setHeadings(extractHeadings(rawContent));
        setLoading(false);
      } else {
        setLoading(false);
        navigate("/docs/404", { replace: true });
      }
    }

    loadContent();
  }, [slug, navigate]);

  // Scroll to hash anchor after content renders.
  // Scoped to <main> since the layout uses overflow-y-auto on main, not the window.
  useEffect(() => {
    if (loading || !content) return;

    const hash = location.hash.replace("#", "");
    const scrollContainer = document.querySelector("main");

    if (hash) {
      const timer = setTimeout(() => {
        const el = document.getElementById(hash);
        if (el) {
          el.scrollIntoView({ behavior: "smooth" });
        }
      }, 80);
      return () => clearTimeout(timer);
    } else {
      // No hash → scroll to top on clean page navigation
      if (scrollContainer) {
        scrollContainer.scrollTo(0, 0);
      }
    }
  }, [loading, content, location.hash]);

  // Update browser title from manifest
  useEffect(() => {
    if (slug) {
      for (const section of KERITH_DOCS_CONFIG.sections) {
        const page = section.pages.find((p) => p.id === slug);
        if (page) {
          document.title = `${page.title} | Kerith Docs`;
          break;
        }
      }
    }
    return () => {
      document.title = "Kerith Docs";
    };
  }, [slug]);

  if (loading) {
    return (
      <div className="flex max-w-275 mx-auto pt-20 pb-12 px-8 items-start justify-between gap-12 relative">
        <div className="flex-1 min-w-0 max-w-190">
          <DocLoading />
        </div>
      </div>
    );
  }

  if (!content) return null;

  return (
    <div className="flex w-full max-w-275 mx-auto pt-40 pb-12 px-8 items-start justify-between gap-14">
      <div className="flex-1 min-w-0 max-w-190">
        <DocContent content={content} />
      </div>

      <aside className="hidden lg:block w-60 xl:w-70 shrink-0 self-start sticky top-6">
        <div className="max-h-[calc(100vh-3rem)] overflow-y-auto overflow-x-hidden scrollbar-hide">
          <TOC headings={headings} />
        </div>
      </aside>
    </div>
  );
}
