import { Link } from "react-router";

export default function DocsNotFound() {
  return (
    <div className="flex flex-col items-center justify-center min-h-[50vh] text-center p-8">
      <div className="flex flex-col gap-4 border border-graphite bg-carbon p-8 rounded-none max-w-md w-full">
        <div className="border-b border-graphite pb-4 mb-2">
           <span className="font-berkeley-mono text-caption uppercase tracking-wider text-fog">
             ERROR // <span className="text-coral-red">404</span>
           </span>
        </div>
        <h2 className="text-2xl font-semibold text-paper">
          Page Not Found
        </h2>
        <p className="text-base text-fog mb-6">
          The documentation page you are looking for does not exist or has been moved.
        </p>
        <Link
          to="/docs"
          className="inline-flex h-10 items-center justify-center rounded-none border border-graphite bg-transparent px-5 font-berkeley-mono text-caption uppercase tracking-wider text-mist transition-colors duration-150 hover:border-smoke hover:text-bone focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-graphite"
        >
          RETURN TO CONSOLE
        </Link>
      </div>
    </div>
  );
}
