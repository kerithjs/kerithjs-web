import { Link, useLocation, useNavigate } from "react-router";

export default function NotFound() {
  const location = useLocation();
  const navigate = useNavigate();
  const path = location.pathname || "/404";

  return (
    <main className="relative flex min-h-screen flex-col items-center justify-center bg-void px-24 py-48 selection:bg-paper selection:text-void">
      <div className="w-full max-w-115">
        {/* Status Tag Header */}
        <div className="mb-24 flex items-center justify-between border-b border-graphite pb-12 font-berkeley-mono text-caption">
          <span className="uppercase tracking-wider text-fog">
            ERROR // <span className="text-coral-red">404</span>
          </span>
          <span className="inline-block h-6 w-6 bg-coral-red" />
        </div>

        {/* Command Box — sharp corners, hairline border, zero shadow */}
        <div className="mb-32 flex items-center justify-between rounded-none border border-graphite bg-carbon px-16 py-12 font-berkeley-mono text-body-sm">
          <div className="flex items-center gap-8 overflow-hidden">
            <span className="text-ash">$</span>
            <span className="text-bone">resolve</span>
            <span className="truncate text-fog">{path}</span>
          </div>
          <span className="ml-12 inline-flex shrink-0 items-center rounded-none bg-coral-red/10 px-6 font-berkeley-mono text-caption uppercase tracking-wider text-coral-red">
            [NOT FOUND]
          </span>
        </div>

        {/* Editorial Heading */}
        <h1 className="font-inter-variable text-subheading font-[510] tracking-subheading text-paper">
          This page doesn't exist.
        </h1>
        <p className="mt-8 font-inter-variable text-body-sm text-fog">
          The link may be broken or the resource was moved. Verify the command or route and try again.
        </p>

        {/* Action Buttons — one Acid Lime primary, one Ghost secondary */}
        <div className="mt-32 flex items-center gap-12">
          <Link
            to="/"
            className="inline-flex h-40 items-center justify-center rounded-none bg-acid-lime px-20 font-berkeley-mono text-caption font-bold uppercase tracking-wider text-void transition-colors duration-150 hover:bg-bone focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-acid-lime"
          >
            RETURN HOME
          </Link>
          <button
            type="button"
            onClick={() => navigate(-1)}
            className="inline-flex h-40 items-center justify-center rounded-none border border-graphite bg-transparent px-20 font-berkeley-mono text-caption uppercase tracking-wider text-mist transition-colors duration-150 hover:border-smoke hover:text-bone focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-graphite"
          >
            GO BACK
          </button>
        </div>
      </div>
    </main>
  );
}