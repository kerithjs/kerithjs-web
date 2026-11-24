import {
  GraduationCap,
  Download,
  Layers,
  Cpu,
  CheckCircle2,
  Flag,
  ArrowUpRight,
  Terminal,
} from "lucide-react";
import GithubIcon from "@/components/icons/Github";
import { Link } from "react-router";

interface CardProps {
  icon: React.ComponentType<{ size?: number; className?: string }>;
  title: string;
  description: string;
  path?: string;
}

const DocCard = ({ icon: Icon, title, description, path }: CardProps) => {
  const CardContent = (
    <div className="bg-obsidian rounded-lg border border-graphite hover:border-smoke transition-all duration-200 group cursor-pointer h-full flex flex-col p-5 gap-8">
      <div className="w-9 h-9 rounded-md flex items-center justify-center text-fog group-hover:text-mist transition-colors duration-200">
        <Icon size={18} />
      </div>
      <div className="flex flex-col gap-1.5 mt-auto">
        <div className="h-px w-full bg-graphite mb-3" />
        <h3 className="text-paper text-body-sm font-medium leading-snug">
          {title}
        </h3>
        <p className="text-fog text-sm font-normal leading-relaxed">
          {description}
        </p>
      </div>
    </div>
  );

  if (path) {
    return (
      <Link to={path} className="block h-full">
        {CardContent}
      </Link>
    );
  }

  return CardContent;
};

export default function DocsHome() {
  const popularDocs = [
    {
      icon: GraduationCap,
      title: "Quick Start",
      description:
        "Get up and running with Kerith in minutes with our comprehensive guide",
      path: "/docs/overview",
    },
    {
      icon: Download,
      title: "Bootstrap Lifecycle",
      description:
        "Understand the 8 internal steps Kerith takes during application startup",
      path: "/docs/bootstrap-cycle",
    },
    {
      icon: Layers,
      title: "Module Identifiers",
      description:
        "Learn how to use Module(), Service(), and Repository() to structure your code",
      path: "/docs/module-identifiers",
    },
    {
      icon: Terminal,
      title: "CLI Reference",
      description:
        "Master the Kerith CLI with commands for checking, creating, and syncing",
      path: "/docs/cli",
    },
  ];

  const basicDocs = [
    {
      icon: Cpu,
      title: "NITS System",
      description:
        "Deep dive into the Kerith Internal Tracking System for module identity",
      path: "/docs/nits",
    },
    {
      icon: CheckCircle2,
      title: "Configuration",
      description:
        "Learn how to customize Kerith via kerith.config.ts and options",
      path: "/docs/configuration",
    },
    {
      icon: Flag,
      title: "Error Handling",
      description:
        "Reference for KerithError codes and troubleshooting common issues",
      path: "/docs/errors",
    },
    {
      icon: ArrowUpRight,
      title: "Registry API",
      description:
        "Programmatically access and inspect the module registry at runtime",
      path: "/docs/registry",
    },
  ];

  return (
    <div className="max-w-5xl mx-auto px-10 py-12 pt-48">
      <section className="mb-14 pb-10 border-b border-graphite">
        <div className="flex items-start justify-between gap-4 mb-4">
          <h1 className="text-4xl font-bold text-paper tracking-tight leading-tight">
            Kerith Docs
          </h1>
          <a
            href="https://github.com"
            target="_blank"
            rel="noreferrer"
            className="flex items-center gap-2 px-3 py-1.5 rounded-md border border-graphite text-fog hover:text-paper hover:border-smoke transition-colors shrink-0 text-sm font-medium mt-1"
          >
            <GithubIcon size={14} />
            <span>GitHub</span>
          </a>
        </div>
        <p className="text-base text-ash max-w-xl leading-relaxed">
          The modular framework for Express. Built for Node.js ≥ 20.6.0.
        </p>
      </section>

      <section className="mb-12">
        <h2 className="text-xs font-semibold text-fog/60 uppercase tracking-widest mb-5">
          Popular
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3">
          {popularDocs.map((doc, idx) => (
            <DocCard key={idx} {...doc} />
          ))}
        </div>
      </section>

      <section>
        <h2 className="text-xs font-semibold text-fog/60 uppercase tracking-widest mb-5">
          Kerith basics
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3">
          {basicDocs.map((doc, idx) => (
            <DocCard key={idx} {...doc} />
          ))}
        </div>
      </section>
    </div>
  );
}
