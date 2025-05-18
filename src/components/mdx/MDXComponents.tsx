import Image from "next/image";
import Link from "next/link";
import Alert from "./Alert";
import CodeBlock from "./CodeBlock";

interface MDXComponentsProps {
  [key: string]: React.ComponentType<any>;
}

export const MDXComponents: MDXComponentsProps = {
  // Override default elements
  h1: (props) => (
    <h1
      className="text-3xl font-bold tracking-tight mt-10 mb-4 text-slate-900"
      {...props}
    />
  ),
  h2: (props) => (
    <h2
      className="text-2xl font-semibold tracking-tight mt-10 mb-4 text-slate-900"
      {...props}
    />
  ),
  h3: (props) => (
    <h3
      className="text-xl font-semibold tracking-tight mt-8 mb-3 text-slate-900"
      {...props}
    />
  ),
  h4: (props) => (
    <h4
      className="text-lg font-semibold tracking-tight mt-8 mb-3 text-slate-900"
      {...props}
    />
  ),
  p: (props) => (
    <p className="leading-7 [&:not(:first-child)]:mt-6" {...props} />
  ),
  a: ({ href, ...props }) => (
    <Link
      href={href as string}
      className="font-medium text-blue-600 hover:text-blue-800 hover:underline transition-colors"
      {...props}
    />
  ),
  ul: (props) => <ul className="my-6 ml-6 list-disc [&>li]:mt-2" {...props} />,
  ol: (props) => (
    <ol className="my-6 ml-6 list-decimal [&>li]:mt-2" {...props} />
  ),
  li: (props) => <li className="leading-7" {...props} />,
  blockquote: (props) => (
    <blockquote
      className="mt-6 border-l-2 border-slate-300 pl-6 italic text-slate-800"
      {...props}
    />
  ),
  img: ({ src, alt, ...props }) => (
    <Image
      src={src as string}
      alt={alt as string}
      width={800}
      height={500}
      className="rounded-lg my-8 mx-auto"
      {...props}
    />
  ),
  hr: () => <hr className="my-8 border-slate-200" />,
  table: (props) => (
    <div className="my-6 w-full overflow-x-auto">
      <table className="w-full table-auto border-collapse text-sm" {...props} />
    </div>
  ),
  th: (props) => (
    <th
      className="border border-slate-200 px-4 py-2 text-left font-bold"
      {...props}
    />
  ),
  td: (props) => (
    <td className="border border-slate-200 px-4 py-2 text-left" {...props} />
  ),
  tr: (props) => <tr className="even:bg-slate-50" {...props} />,
  pre: CodeBlock,
  code: (props) => (
    <code
      className="rounded bg-slate-100 px-1 py-0.5 text-sm font-mono text-slate-800"
      {...props}
    />
  ),

  // Custom components
  Alert,
};

export default MDXComponents;
