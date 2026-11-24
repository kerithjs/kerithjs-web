import { useEffect, useRef, useState } from "react";
import { Link } from "react-router";
import { Search, ArrowRight, Hash, FileText } from "lucide-react";
import { useSearch } from "@/hooks/useSearch";

interface SearchModalProps {
  isOpen: boolean;
  onClose: () => void;
  query: string;
  setQuery: (q: string) => void;
  results: ReturnType<typeof useSearch>["results"];
}

export default function SearchModal({
  isOpen,
  ...props
}: SearchModalProps) {
  if (!isOpen) return null;

  return <SearchModalContent isOpen={isOpen} {...props} />;
}

function SearchModalContent({
  isOpen,
  onClose,
  query,
  setQuery,
  results,
}: SearchModalProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [activeIndex, setActiveIndex] = useState(0);

  useEffect(() => {
    if (isOpen) {
      setTimeout(() => inputRef.current?.focus(), 50);
    }
  }, [isOpen]);

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (!isOpen) return;
      if (e.key === "ArrowDown") {
        e.preventDefault();
        setActiveIndex((prev) => Math.min(prev + 1, results.length - 1));
      }
      if (e.key === "ArrowUp") {
        e.preventDefault();
        setActiveIndex((prev) => Math.max(prev - 1, 0));
      }
      if (e.key === "Enter" && results[activeIndex]) {
        onClose();
        window.location.href = results[activeIndex].path;
      }
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [isOpen, activeIndex, results, onClose]);

  return (
    <div
      className="fixed inset-0 z-50 flex items-start justify-center pt-[20vh]"
      onClick={onClose}
    >
      {/* Backdrop */}
      <div className="absolute inset-0 bg-void/70 backdrop-blur-sm" />

      {/* Modal */}
      <div
        className="relative w-full max-w-2xl mx-4 bg-carbon border border-graphite rounded-xl shadow-2xl overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Input row */}
        <div className="flex items-center gap-4 px-5 py-4 border-b border-graphite">
          <Search size={18} className="text-fog shrink-0" />
          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={(e) => {
              setQuery(e.target.value);
              setActiveIndex(0);
            }}
            placeholder="Search documentation..."
            className="flex-1 bg-transparent text-paper text-base placeholder:text-fog/40 outline-none font-inter-variable"
          />
          {query && (
            <button
              onClick={() => {
                setQuery("");
                setActiveIndex(0);
              }}
              className="text-fog hover:text-mist text-xs font-medium transition-colors shrink-0"
            >
              Clear
            </button>
          )}
          <kbd className="hidden sm:flex items-center gap-1 px-2 py-1 text-[11px] font-medium text-fog bg-obsidian border border-graphite rounded shrink-0">
            Esc
          </kbd>
        </div>

        {/* Results */}
        <div className="py-2 max-h-[420px] overflow-y-auto scrollbar-hide">
          {results.length === 0 ? (
            <div className="px-5 py-10 text-center text-fog text-sm">
              No results for &ldquo;<span className="text-mist">{query}</span>&rdquo;
            </div>
          ) : (
            <>
              {!query && (
                <p className="px-5 pt-2 pb-2 text-[11px] font-semibold uppercase tracking-wider text-fog/50">
                  All pages
                </p>
              )}
              <ul>
                {results.map((result, idx) => (
                  <li key={result.path + result.title}>
                    <Link
                      to={result.path}
                      onClick={onClose}
                      className={`flex items-center gap-4 px-5 py-3.5 transition-colors group ${
                        idx === activeIndex
                          ? "bg-obsidian text-paper"
                          : "text-fog hover:bg-obsidian/60 hover:text-mist"
                      }`}
                      onMouseEnter={() => setActiveIndex(idx)}
                    >
                      <span className="shrink-0 text-fog/60">
                        {result.isChild ? (
                          <Hash size={15} />
                        ) : (
                          <FileText size={15} />
                        )}
                      </span>
                      <div className="flex-1 min-w-0">
                        <span className="text-sm font-medium truncate block leading-snug">
                          {result.title}
                        </span>
                        <span className="text-xs text-fog/60 truncate block mt-0.5">
                          {result.section}
                        </span>
                      </div>
                      <ArrowRight
                        size={14}
                        className={`shrink-0 transition-opacity ${
                          idx === activeIndex ? "opacity-60" : "opacity-0"
                        }`}
                      />
                    </Link>
                  </li>
                ))}
              </ul>
            </>
          )}
        </div>

        {/* Footer */}
        <div className="flex items-center gap-5 px-5 py-3 border-t border-graphite">
          <span className="flex items-center gap-1.5 text-[11px] text-fog/50">
            <kbd className="px-1.5 py-px bg-obsidian border border-graphite rounded text-[10px]">↑</kbd>
            <kbd className="px-1.5 py-px bg-obsidian border border-graphite rounded text-[10px]">↓</kbd>
            navigate
          </span>
          <span className="flex items-center gap-1.5 text-[11px] text-fog/50">
            <kbd className="px-1.5 py-px bg-obsidian border border-graphite rounded text-[10px]">↵</kbd>
            open
          </span>
          <span className="ml-auto text-[11px] text-fog/40">
            Ctrl K
          </span>
        </div>
      </div>
    </div>
  );
}
