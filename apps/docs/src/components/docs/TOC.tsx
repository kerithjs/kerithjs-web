import useActiveHeading from "@/hooks/useActiveHeading";
import type { Heading } from "@/utils/mdUtils";
import { motion } from "framer-motion";

interface TOCProps {
  headings: Heading[];
}

export default function TOC({ headings }: TOCProps) {
  const activeId = useActiveHeading(headings.map((h) => h.id));

  const handleClick = (e: React.MouseEvent<HTMLAnchorElement>, id: string) => {
    e.preventDefault();
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: "smooth" });
    }
    window.history.pushState(null, "", `#${id}`);
  };

  if (headings.length === 0) return null;

  return (
    <nav className="space-y-5">
      <h4 className="font-berkeley-mono text-caption uppercase tracking-wider text-fog">
        On this page
      </h4>

      <ul className="relative space-y-1">
        {/* Riel continuo de fondo — le da estructura a toda la lista, no solo al item activo */}
        <div className="absolute left-0 top-0 bottom-0 w-px bg-graphite" />

        {headings.map((heading) => (
          <li
            key={heading.id}
            className="relative"
            style={{ paddingLeft: heading.level === 3 ? "1rem" : "0" }}
          >
            {activeId === heading.id && (
              <motion.div
                layoutId="active-toc"
                className="absolute left-0 top-0 bottom-0 w-px bg-paper"
                transition={{ type: "spring", stiffness: 350, damping: 30 }}
              />
            )}
            <motion.a
              href={`#${heading.id}`}
              onClick={(e) => handleClick(e, heading.id)}
              whileHover={{ x: 2 }}
              whileTap={{ scale: 0.98 }}
              className={`block py-1.5 pl-6 text-caption leading-snug font-inter-variable transition-colors ${
                activeId === heading.id
                  ? "text-paper font-medium"
                  : heading.level === 3
                    ? "text-ash hover:text-mist"
                    : "text-fog hover:text-mist"
              }`}
            >
              {heading.title}
            </motion.a>
          </li>
        ))}
      </ul>
    </nav>
  );
}
