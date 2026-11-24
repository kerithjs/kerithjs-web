import ReactMarkdown, { type Components } from "react-markdown";
import remarkGfm from "remark-gfm";
import rehypeRaw from "rehype-raw";
import remarkHeadingId from "remark-heading-id";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { vscDarkPlus, prism } from "react-syntax-highlighter/dist/esm/styles/prism";
import useTheme from "@/hooks/useTheme";

interface DocContentProps {
  content: string;
}

function omitNode<T extends { node?: unknown }>(props: T): Omit<T, "node"> {
  const elementProps = { ...props };
  delete elementProps.node;
  return elementProps;
}

export default function DocContent({ content }: DocContentProps) {
  const { theme } = useTheme();

  const markdownComponents: Components = {
    h1: (props) => (
      <h1
        className="text-4xl font-semibold text-paper mt-12 mb-6 tracking-tight leading-tight font-inter-variable scroll-mt-20"
        {...omitNode(props)}
      />
    ),
    h2: (props) => (
      <h2
        className="text-2xl font-semibold text-paper mt-10 mb-4 tracking-tight border-b border-graphite pb-2 font-inter-variable scroll-mt-20"
        {...omitNode(props)}
      />
    ),
    h3: (props) => (
      <h3
        className="text-xl font-medium text-paper mt-8 mb-3 font-inter-variable scroll-mt-20"
        {...omitNode(props)}
      />
    ),
    p: (props) => (
      <p
        className="text-base text-mist mb-4 leading-relaxed font-inter-variable"
        {...omitNode(props)}
      />
    ),
    a: (props) => (
      <a
        className="text-mist hover:text-paper underline decoration-graphite hover:decoration-paper transition-colors"
        {...omitNode(props)}
      />
    ),
    ul: (props) => (
      <ul
        className="list-disc list-outside ml-6 mb-4 text-base text-mist space-y-2"
        {...omitNode(props)}
      />
    ),
    ol: (props) => (
      <ol
        className="list-decimal list-outside ml-6 mb-4 text-base text-mist space-y-2"
        {...omitNode(props)}
      />
    ),
    li: (props) => <li {...omitNode(props)} />,
    code: (props) => {
      const { className, children, ...elementProps } = omitNode(props);
      const match = /language-(\w+)/.exec(className || "");
      const language = match ? match[1] : "";
      const isBlock = Boolean(match);

      if (!isBlock) {
        return (
          <code
            className="font-berkeley-mono text-caption text-mist bg-carbon px-1.5 py-0.5 rounded-none border border-graphite"
            {...elementProps}
          >
            {children}
          </code>
        );
      }

      return (
        <div className="my-6 border border-graphite overflow-hidden">
          <SyntaxHighlighter
            style={
              (theme === "dark" ? vscDarkPlus : prism) as {
                [key: string]: React.CSSProperties;
              }
            }
            language={language}
            PreTag="div"
            customStyle={{
              margin: 0,
              padding: "1rem",
              backgroundColor: "transparent",
              fontSize: "0.8125rem",
              lineHeight: "1.6",
              fontFamily: "'Berkeley Mono', 'Geist Mono', monospace",
            }}
          >
            {String(children).replace(/\n$/, "")}
          </SyntaxHighlighter>
        </div>
      );
    },
    pre: (props) => <>{omitNode(props).children}</>,
    blockquote: (props) => (
      <blockquote
        className="border-l border-smoke pl-4 italic text-fog mb-4"
        {...omitNode(props)}
      />
    ),
    table: (props) => (
      <div className="overflow-x-auto mb-6">
        <table className="w-full text-left border-collapse" {...omitNode(props)} />
      </div>
    ),
    th: (props) => (
      <th
        className="border-b border-graphite py-2 px-4 font-semibold text-paper text-body-sm"
        {...omitNode(props)}
      />
    ),
    td: (props) => (
      <td
        className="border-b border-graphite py-2 px-4 text-mist text-body-sm"
        {...omitNode(props)}
      />
    ),
  };

  return (
    <article className="max-w-none">
      <ReactMarkdown
        remarkPlugins={[remarkGfm, [remarkHeadingId, { defaults: true }]]}
        rehypePlugins={[rehypeRaw]}
        components={markdownComponents}
      >
        {content}
      </ReactMarkdown>
    </article>
  );
}
