import { useEffect, useState, useRef } from "react";

export default function useActiveHeading(headingIds: string[]) {
  const [activeId, setActiveId] = useState<string>("");
  const isAtBottomRef = useRef(false);

  useEffect(() => {
    const scrollContainer = document.querySelector("main");

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting && !isAtBottomRef.current) {
            setActiveId(entry.target.id);
          }
        });
      },
      // Target headings when they are in the top 20% to 50% of the scroll container
      { root: scrollContainer, rootMargin: "-15% 0% -70% 0%" },
    );

    headingIds.forEach((id) => {
      const element = document.getElementById(id);
      if (element) observer.observe(element);
    });

    return () => observer.disconnect();
  }, [headingIds]);

  // Fallback for the very top and very bottom of the page — scoped to main scroll container
  useEffect(() => {
    const scrollContainer = document.querySelector("main");
    if (!scrollContainer) return;

    const handleScroll = () => {
      const { scrollTop, scrollHeight, clientHeight } = scrollContainer;
      
      // Check if at the very top (or close to it)
      if (scrollTop < 10 && headingIds.length > 0) {
        setActiveId(headingIds[0]);
        isAtBottomRef.current = false;
        return;
      }

      const isAtBottom = scrollTop + clientHeight >= scrollHeight - 20;
      isAtBottomRef.current = isAtBottom;

      if (isAtBottom && headingIds.length > 0) {
        setActiveId(headingIds[headingIds.length - 1]);
      }
    };

    scrollContainer.addEventListener("scroll", handleScroll);
    handleScroll();
    return () => scrollContainer.removeEventListener("scroll", handleScroll);
  }, [headingIds]);

  return activeId;
}
