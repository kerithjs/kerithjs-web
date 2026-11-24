import Sidebar from "@/components/docs/Sidebar";
import Navbar from "@/components/docs/Navbar";
import SearchModal from "@/components/docs/SearchModal";
import { useSearch } from "@/hooks/useSearch";
import { Outlet } from "react-router";

export default function DocsLayout() {
  const search = useSearch();

  return (
    <div className="flex h-screen overflow-hidden bg-void text-mist gap-2 p-2">
      {/* Sidebar: toca borde izq, top y bottom de pantalla → sin radio ni borde en esos lados */}
      <Sidebar />
      <div className="flex-1 flex flex-col min-w-0 h-full gap-2">
        {/* Navbar: toca borde top y der de pantalla → sin radio ni borde en esos lados */}
        <Navbar onSearchOpen={search.open} />
        <main className="flex-1 overflow-y-auto border border-graphite rounded-lg">
          <Outlet />
        </main>
      </div>

      <SearchModal
        isOpen={search.isOpen}
        onClose={search.close}
        query={search.query}
        setQuery={search.setQuery}
        results={search.results}
      />
    </div>
  );
}
