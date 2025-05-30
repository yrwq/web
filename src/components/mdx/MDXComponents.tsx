import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import Alert from './Alert';
import Todo from './Todo';
import CodeBlock from './CodeBlock';
import { cn } from '@/lib/utils';

export const MDXComponents = {
  // Override default elements
  h1: (props: React.HTMLAttributes<HTMLHeadingElement>) => (
    <h1
      className="text-3xl font-bold tracking-tight mt-10 mb-4 text-foreground"
      {...props}
    />
  ),
  h2: (props: React.HTMLAttributes<HTMLHeadingElement>) => (
    <h2
      className="text-2xl font-semibold tracking-tight mt-10 mb-4 text-foreground"
      {...props}
    />
  ),
  h3: (props: React.HTMLAttributes<HTMLHeadingElement>) => (
    <h3
      className="text-xl font-semibold tracking-tight mt-8 mb-3 text-foreground"
      {...props}
    />
  ),
  h4: (props: React.HTMLAttributes<HTMLHeadingElement>) => (
    <h4
      className="text-lg font-semibold tracking-tight mt-8 mb-3 text-foreground"
      {...props}
    />
  ),
  p: (props: React.HTMLAttributes<HTMLParagraphElement>) => (
    <p className="leading-7 [&:not(:first-child)]:mt-6 text-foreground" {...props} />
  ),
  a: ({ href, ...props }: React.AnchorHTMLAttributes<HTMLAnchorElement>) => (
    <Link
      href={href as string}
      className="font-medium text-blue hover:text-blue/80 hover:underline transition-colors"
      {...props}
    />
  ),
  ul: (props: React.HTMLAttributes<HTMLUListElement>) => (
    <ul className="my-6 ml-6 list-disc [&>li]:mt-2 text-foreground" {...props} />
  ),
  ol: (props: React.HTMLAttributes<HTMLOListElement>) => (
    <ol className="my-6 ml-6 list-decimal [&>li]:mt-2 text-foreground" {...props} />
  ),
  li: (props: React.HTMLAttributes<HTMLLIElement>) => (
    <li className="leading-7 text-foreground" {...props} />
  ),
  blockquote: (props: React.BlockquoteHTMLAttributes<HTMLQuoteElement>) => (
    <blockquote
      className="mt-6 border-l-2 border-muted pl-6 italic text-foreground"
      {...props}
    />
  ),
  img: ({ src, alt, ...props }: React.ImgHTMLAttributes<HTMLImageElement>) => (
    <Image
      src={src as string}
      alt={alt as string}
      width={800}
      height={500}
      className="rounded-lg my-8 mx-auto"
      {...(props as any)}
    />
  ),
  hr: () => <hr className="my-8 border-muted" />,
  table: (props: React.TableHTMLAttributes<HTMLTableElement>) => (
    <div className="my-6 w-full overflow-x-auto">
      <table className="w-full table-auto border-collapse text-sm text-foreground" {...props} />
    </div>
  ),
  th: (props: React.ThHTMLAttributes<HTMLTableHeaderCellElement>) => (
    <th
      className="border border-muted px-4 py-2 text-left font-bold text-foreground"
      {...props}
    />
  ),
  td: (props: React.TdHTMLAttributes<HTMLTableDataCellElement>) => (
    <td className="border border-muted px-4 py-2 text-left text-foreground" {...props} />
  ),
  tr: (props: React.HTMLAttributes<HTMLTableRowElement>) => (
    <tr className="even:bg-highlight-low" {...props} />
  ),
  pre: ({ children, className: preClassName, ...props }: React.HTMLAttributes<HTMLPreElement>) => {
    // rehype-pretty-code wraps the highlighted code in a <code> tag inside the <pre>
    // We need to get the className from the code tag to extract the language
    const codeElement = React.Children.only(children) as React.ReactElement;
    const codeClassName = codeElement?.props?.className;

    // Extract language from className if available (from the code tag)
    const languageMatch = codeClassName?.match(/language-(\w+)/);
    const language = languageMatch ? languageMatch[1] : undefined;

    console.log('MDXComponents pre override:', { codeClassName, language });

    return (
      <CodeBlock language={language} className={preClassName} {...props}>
        {children}
      </CodeBlock>
    );
  },
  code: (props: React.HTMLAttributes<HTMLElement>) => {
    const { className, children } = props;
    // For inline code, we don't use the CodeBlock component with header and line numbers
    return (
      <code
        className="bg-highlight-low text-foreground px-1.5 py-0.5 rounded-md text-sm"
        {...props}
      >
        {children}
      </code>
    );
  },

  // Custom components
  Alert,
  Todo,
  strong: (props: React.HTMLAttributes<HTMLElement>) => <strong className="font-bold text-foreground" {...props} />,
};

export default MDXComponents;
