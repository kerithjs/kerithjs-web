import { ChevronRight, Search, Sun, Moon } from "lucide-react";
import { useLocation, Link } from "react-router";
import { KERITH_DOCS_CONFIG } from "@/config/docs-manifest";
import useTheme from "@/hooks/useTheme";

interface NavbarProps {
  onSearchOpen?: () => void;
}

export default function Navbar({ onSearchOpen }: NavbarProps) {
  const location = useLocation();
  const { theme, toggleTheme } = useTheme();
  const pathSegments = location.pathname.split("/").filter(Boolean);

  const breadcrumbs = pathSegments.map((segment, index) => {
    const path = `/${pathSegments.slice(0, index + 1).join("/")}`;
    const isLast = index === pathSegments.length - 1;

    let label =
      segment.charAt(0).toUpperCase() + segment.slice(1).replace(/-/g, " ");

    if (segment === "docs") {
      label = "Home";
    } else {
      for (const section of KERITH_DOCS_CONFIG.sections) {
        if (section.id === segment) {
          label = section.label;
          break;
        }
        const page = section.pages.find((p) => p.id === segment);
        if (page) {
          label = page.title;
          break;
        }
      }
    }
    return { label, path, isLast };
  });

  return (
    <header className="h-[62px] px-5 border border-graphite rounded-b-lg bg-void/80 backdrop-blur-md z-10 flex items-center justify-between gap-6">
      {/* Breadcrumb */}
      <div className="flex items-center gap-2 text-sm font-medium min-w-0">
        {breadcrumbs.map((crumb) => (
          <div key={crumb.path} className="flex items-center gap-2 min-w-0">
            <ChevronRight size={14} className="text-paper shrink-0" />
            {crumb.isLast ? (
              <span className="text-paper truncate">{crumb.label}</span>
            ) : (
              <Link
                to={crumb.path}
                className="text-mist hover:text-paper transition-colors truncate"
              >
                {crumb.label}
              </Link>
            )}
          </div>
        ))}
      </div>

      {/* Right actions */}
      <div className="flex items-center gap-2 shrink-0">
        {/* Theme toggle */}
        <button
          type="button"
          onClick={toggleTheme}
          aria-label={theme === "dark" ? "Switch to light mode" : "Switch to dark mode"}
          className="p-2 rounded-md border border-graphite bg-obsidian/60 hover:border-smoke hover:bg-obsidian transition-all text-fog hover:text-mist"
        >
          {theme === "dark" ? <Sun size={14} /> : <Moon size={14} />}
        </button>

        {/* Search trigger */}
        <button
          type="button"
          onClick={onSearchOpen}
          className="flex items-center gap-2.5 px-3 py-1.5 rounded-md border border-graphite bg-obsidian/60 hover:border-smoke hover:bg-obsidian transition-all text-fog hover:text-mist"
        >
          <Search size={13} className="shrink-0" />
          <span className="text-sm hidden sm:block">Search docs...</span>
          <div className="hidden sm:flex items-center gap-0.5 ml-2">
            <kbd className="px-1.5 py-px text-[10px] font-medium bg-carbon border border-graphite rounded text-fog/60">
              Ctrl
            </kbd>
            <kbd className="px-1.5 py-px text-[10px] font-medium bg-carbon border border-graphite rounded text-fog/60">
              K
            </kbd>
          </div>
        </button>
      </div>
    </header>
  );
}
