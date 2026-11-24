import { useState, useEffect } from "react";
import { NavLink, Link, useLocation } from "react-router";
import { ChevronRight } from "lucide-react";
import { Logo } from "@/components/icons/LogoR";
import GithubIcon from "@/components/icons/Github";
import { KERITH_DOCS_CONFIG } from "@/config/docs-manifest";

function NavItem({ item }: { item: any }) {
  const { label, to, icon: Icon, subItems } = item;
  const location = useLocation();

  // Auto-expand if any subitem matches current path
  const isParentActive = subItems?.some(
    (s: any) => location.pathname === s.to || location.pathname + location.hash === s.to
  );
  const [isOpen, setIsOpen] = useState(isParentActive ?? false);

  useEffect(() => {
    if (isParentActive) setIsOpen(true);
  }, [isParentActive]);

  if (subItems) {
    return (
      <div className="flex flex-col">
        <button
          onClick={() => setIsOpen(!isOpen)}
          className={`group flex w-full items-center gap-2.5 px-2 py-1.5 rounded-md text-sm font-medium transition-colors cursor-pointer ${
            isParentActive
              ? "bg-obsidian text-paper"
              : "text-fog hover:bg-obsidian/60 hover:text-mist"
          }`}
        >
          {Icon && (
            <Icon
              size={14}
              className={`shrink-0 transition-colors ${
                isParentActive ? "text-paper" : "text-fog/70 group-hover:text-mist"
              }`}
            />
          )}
          <span className="truncate">{label}</span>
          <ChevronRight
            size={14}
            className={`ml-auto shrink-0 transition-transform ${
              isParentActive ? "text-fog/60" : "text-fog/40 group-hover:text-mist"
            } ${isOpen ? "rotate-90" : ""}`}
          />
        </button>
        {isOpen && (
          <div className="flex flex-col mt-1 mb-1 border-l border-graphite ml-3.75 pl-3 space-y-0.5">
            {subItems.map((subItem: any) => {
              const isActive =
                location.pathname + location.hash === subItem.to ||
                location.pathname === subItem.to;
              return (
                <Link
                  key={subItem.to}
                  to={subItem.to}
                  className={`block px-2 py-1.5 rounded-md text-sm font-medium transition-colors ${
                    isActive
                      ? "text-paper bg-obsidian"
                      : "text-fog/80 hover:text-mist hover:bg-obsidian/50"
                  }`}
                >
                  {subItem.label}
                </Link>
              );
            })}
          </div>
        )}
      </div>
    );
  }

  return (
    <NavLink
      to={to}
      className={({ isActive }) =>
        `group flex items-center gap-2.5 px-2 py-1.5 rounded-md text-sm font-medium transition-colors ${
          isActive
            ? "bg-obsidian text-paper"
            : "text-fog hover:bg-obsidian/60 hover:text-mist"
        }`
      }
    >
      {({ isActive }) => (
        <>
          {Icon && (
            <Icon
              size={14}
              className={`shrink-0 transition-colors ${
                isActive ? "text-paper" : "text-fog/70 group-hover:text-mist"
              }`}
            />
          )}
          <span className="truncate">{label}</span>
        </>
      )}
    </NavLink>
  );
}

export default function Sidebar() {
  return (
    <aside className="w-70 h-full bg-void border border-graphite rounded-r-lg flex flex-col overflow-hidden">
      <div className="flex items-center justify-between p-5 border-b border-graphite rounded-tr-lg">
        <Link
          to="/docs"
          className="flex items-center gap-2 hover:opacity-80 transition-opacity"
        >
          <Logo size={22} className="text-paper" />
          <div className="h-6 w-0.5 bg-graphite" />
          <span className="font-semibold text-paper">Docs</span>
        </Link>
      </div>

      <nav className="flex-1 overflow-y-auto scrollbar-hide px-4 py-6">
        {KERITH_DOCS_CONFIG.sections.map(({ label: title, pages }, i) => (
          <section key={title} className={i === 0 ? "" : "mt-6"}>
            <h3 className="px-2 mb-2 text-[11px] font-semibold uppercase tracking-wider text-fog/50">
              {title}
            </h3>

            <div className="flex flex-col gap-0.5">
              {pages.map((page: any, idx: number) => (
                <NavItem
                  key={idx}
                  item={{
                    label: page.title,
                    to: `/docs/${page.file}`,
                    icon: page.icon,
                    subItems: page.children?.map((child: any) => ({
                      label: child.label,
                      to: child.path,
                    })),
                  }}
                />
              ))}
            </div>
          </section>
        ))}
      </nav>

      <div className="border-t border-graphite p-4">
        <a
          href="https://github.com"
          target="_blank"
          rel="noreferrer"
          className="flex items-center gap-2.5 px-2 py-1.5 rounded-md text-sm font-medium text-fog hover:text-mist hover:bg-obsidian/60 transition-colors"
        >
          <GithubIcon size={14} className="shrink-0" />
          GitHub
        </a>
      </div>
    </aside>
  );
}
