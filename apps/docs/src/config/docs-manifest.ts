import { 
  BookOpen, 
  Zap, 
  Cpu, 
  Settings, 
  BarChart, 
  ShieldCheck, 
  Code, 
  Terminal,
  type LucideIcon 
} from "lucide-react";

export interface DocPageConfig {
  id: string;
  title: string;
  file: string;
  icon?: LucideIcon;
  children?: { label: string; path: string }[];
}

export interface DocSectionConfig {
  id: string;
  label: string;
  pages: DocPageConfig[];
}

export interface DocsConfig {
  version: string;
  sections: DocSectionConfig[];
}

export const KERITH_DOCS_CONFIG: DocsConfig = {
  version: "1.3.1",
  sections: [
    {
      id: "getting-started",
      label: "Getting Started",
      pages: [
        { 
          id: "overview", 
          title: "Overview", 
          file: "overview", 
          icon: BookOpen 
        },
        { 
          id: "installation-requirements", 
          title: "Installation & Requirements", 
          file: "installation-requirements", 
          icon: Zap 
        },
      ]
    },
    {
      id: "api-reference",
      label: "API Reference",
      pages: [
        { 
          id: "bootstrap-cycle", 
          title: "Bootstrap Cycle", 
          file: "bootstrap-cycle", 
          icon: Cpu 
        },
        { 
          id: "module-identifiers", 
          title: "Module Identifiers", 
          file: "module-identifiers", 
          icon: Zap,
          children: [
            { label: "Module()", path: "/docs/module-identifiers#41-module" },
            { label: "Controller()", path: "/docs/module-identifiers#42-controller" },
            { label: "Service()", path: "/docs/module-identifiers#43-service" },
            { label: "Repository()", path: "/docs/module-identifiers#44-repository" },
            { label: "Schema()", path: "/docs/module-identifiers#45-schema" },
          ]
        },
        { 
          id: "configuration", 
          title: "Configuration", 
          file: "configuration", 
          icon: Settings,
          children: [
            { label: "Configuration File", path: "/docs/configuration#51-config-file" },
            { label: "CreateAppOptions", path: "/docs/configuration#52-createappoptions" },
            { label: "Default Values", path: "/docs/configuration#53-defaults" },
          ]
        },
        { 
          id: "public-types", 
          title: "Public Types", 
          file: "public-types", 
          icon: BarChart,
          children: [
            { label: "KerithApp", path: "/docs/public-types#61-kerithapp" },
            { label: "RegisteredModule", path: "/docs/public-types#62-registeredmodule" },
            { label: "MountedRoute", path: "/docs/public-types#63-mountedroute" },
            { label: "KerithRegistry", path: "/docs/public-types#64-kerithregistry" },
            { label: "AdvancedRegistry", path: "/docs/public-types#65-advancedregistry" },
            { label: "Registry Entries", path: "/docs/public-types#66-registry-entries" },
            { label: "Logging", path: "/docs/public-types#67-logging" },
            { label: "NitsConfig", path: "/docs/public-types#68-nitsconfig" },
            { label: "GetAliasesOptions", path: "/docs/public-types#69-getaliasesoptions" },
          ]
        },
        { 
          id: "errors", 
          title: "Errors — KerithError", 
          file: "errors", 
          icon: ShieldCheck 
        },
        { 
          id: "module-aliases", 
          title: "Aliases — getAliases()", 
          file: "module-aliases", 
          icon: Settings 
        },
        { 
          id: "registry", 
          title: "Registry — getRegistry()", 
          file: "registry", 
          icon: BarChart 
        },
      ]
    },
    {
      id: "cli",
      label: "CLI",
      pages: [
        { 
          id: "cli", 
          title: "CLI Reference", 
          file: "cli", 
          icon: Code,
          children: [
            { label: "kerith check", path: "/docs/cli#101-kerith-check" },
            { label: "kerith create-module", path: "/docs/cli#102-kerith-create-module" },
            { label: "kerith sync-tsconfig", path: "/docs/cli#103-kerith-sync-tsconfig" },
          ]
        },
      ]
    },
    {
      id: "advanced",
      label: "Advanced",
      pages: [
        { 
          id: "nits", 
          title: "NITS — Identity", 
          file: "nits", 
          icon: Zap 
        },
        { 
          id: "detailed-bootstrap", 
          title: "Detailed Bootstrap", 
          file: "detailed-bootstrap", 
          icon: Terminal 
        },
        { 
          id: "usage-examples", 
          title: "Usage Examples", 
          file: "usage-examples", 
          icon: BookOpen 
        },
      ]
    }
  ]
};

/**
 * Returns a flat list of all documentation pages to easily find prev/next links.
 */
export const getFlatNavigation = (): DocPageConfig[] => {
  return KERITH_DOCS_CONFIG.sections.flatMap(section => section.pages);
};
