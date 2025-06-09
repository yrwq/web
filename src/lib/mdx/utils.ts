import fs from "fs";
import path from "path";
import matter from "gray-matter";
import { compileMDX } from "next-mdx-remote/rsc";
import rehypePrettyCode from "rehype-pretty-code";
import { createHighlighter, bundledThemes } from 'shiki';

// Path to blog content
const blogDirectory = path.join(process.cwd(), "content/blog");

export interface BlogPostMeta {
  title: string;
  description?: string;
  date: string;
  tags?: string[];
  slug: string;
  published?: boolean;
  image?: string;
  author?: string;
}

export interface BlogPost extends BlogPostMeta {
  content: string;
}

// Retrieve all blog post slugs
export function getBlogPostSlugs(): string[] {
  try {
    const filenames = fs.readdirSync(blogDirectory);
    return filenames
      .filter((filename) => filename.endsWith(".mdx"))
      .map((filename) => filename.replace(/\.mdx$/, ""));
  } catch (error) {
    console.error("Error getting blog post slugs:", error);
    return [];
  }
}

// Get blog post content by slug
export function getBlogPostBySlug(slug: string): BlogPost | null {
  try {
    const fullPath = path.join(blogDirectory, `${slug}.mdx`);
    const fileContents = fs.readFileSync(fullPath, "utf8");
    const { data, content } = matter(fileContents);

    return {
      content,
      slug,
      title: data.title || slug,
      description: data.description || "",
      date: data.date
        ? new Date(data.date).toISOString()
        : new Date().toISOString(),
      tags: data.tags || [],
      published: data.published !== false, // Default to true if not specified
      image: data.image || "",
      author: data.author || "",
    };
  } catch (error) {
    console.error(`Error getting blog post by slug ${slug}:`, error);
    return null;
  }
}

// Get all blog posts
export function getAllBlogPosts(): BlogPostMeta[] {
  const slugs = getBlogPostSlugs();
  const posts = slugs
    .map((slug) => getBlogPostBySlug(slug))
    .filter(
      (post): post is BlogPost =>
        post !== null &&
        (process.env.NODE_ENV === "development" || post.published !== false),
    )
    .map(({ content, ...meta }) => meta);

  // Sort by date, newest first
  return posts.sort(
    (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime(),
  );
}

// Get the current theme from document class list
const getCurrentTheme = () => {
  if (typeof document === 'undefined') return 'github-dark';
  const htmlClasses = document.documentElement.classList;
  
  // Map custom theme classes to their corresponding theme names
  const themeMap: Record<string, string> = {
    'gruvbox-light': 'gruvbox-light-hard',
    'gruvbox-dark': 'gruvbox-dark-hard',
    'rose-pine-dawn': 'rose-pine-dawn',
    'rose-pine-moon': 'rose-pine-moon',
    'dark': 'github-dark',
    'light': 'github-light'
  };

  // Check for custom themes first
  for (const [className, themeName] of Object.entries(themeMap)) {
    if (htmlClasses.contains(className)) {
      return themeName;
    }
  }

  // Default to dark/light based on class
  return htmlClasses.contains('dark') ? 'github-dark' : 'github-light';
};

// Process MDX content
export async function processMdx(content: string, currentTheme?: string) {
  // Import custom components for direct use in MDX
  const Alert = (await import("@/components/mdx/Alert")).default;
  const Todo = (await import("@/components/mdx/Todo")).default;
  const CodeBlock = (await import("@/components/mdx/CodeBlock")).default;

  // Import the MDXComponents object for standard tag overrides
  const MDXComponents = (await import("@/components/mdx/MDXComponents")).default;

  const { content: processedContent, frontmatter } = await compileMDX({
    source: content,
    components: {
      // Include standard MDX component overrides
      ...MDXComponents,
      // Explicitly list custom components for direct use
      Alert,
      Todo,
      CodeBlock,
    },
    options: {
      parseFrontmatter: true,
      mdxOptions: {
        format: 'mdx',
        remarkPlugins: [
          (await import('remark-gfm')).default
        ],
        rehypePlugins: [
          [rehypePrettyCode, {
            theme: currentTheme || {
              light: 'github-light',
              dark: 'github-dark',
              'gruvbox-light': 'gruvbox-light-hard',
              'gruvbox-dark': 'gruvbox-dark-hard',
              'rose-pine-moon': 'rose-pine-moon',
              'rose-pine-dawn': 'rose-pine-dawn'
            },
            keepBackground: false,
            onVisitHighlightedLine(node: any) {
              if (!node.properties) {
                node.properties = {};
              }
              if (!node.properties.className) {
                node.properties.className = [];
              }
              node.properties.className.push('highlighted');
            },
            onVisitHighlightedWord(node: any) {
              if (!node.properties) {
                node.properties = {};
              }
              node.properties.className = ['word'];
            },
            onVisitElement: (node: any) => {
              // Remove className from code element generated by rehype-pretty-code
              if (node.tagName === 'code' && node.properties) {
                delete node.properties.className;
              }
            },
            onVisitToken: (node: any) => {
              // Remove the inline color style, but keep other inline styles (like variables)
              if (node.properties && node.properties.style) {
                // Get the style string
                let style = node.properties.style;

                // Remove the color property using a regex
                style = style.replace(/color: #[0-9a-fA-F]+;?/, '').trim();

                // Update the style attribute
                if (style) {
                  node.properties.style = style;
                } else {
                  // Remove the style attribute if it's empty
                  delete node.properties.style;
                }
              }
            },
            getHighlighter: async () => {
              const highlighter = await createHighlighter({
                themes: [
                  bundledThemes['github-light'],
                  bundledThemes['github-dark'],
                  bundledThemes['gruvbox-light-hard'],
                  bundledThemes['gruvbox-dark-hard'],
                  bundledThemes['rose-pine-moon'],
                  bundledThemes['rose-pine-dawn']
                ],
                langs: ['javascript', 'typescript', 'jsx', 'tsx', 'html', 'css', 'json', 'bash', 'markdown', 'mdx', 'python', 'rust', 'go', 'shell', 'yaml', 'toml', 'sql']
              });

              return highlighter;
            },
            showLineNumbers: true,
          }]
        ]
      },
    },
  });

  return { content: processedContent, frontmatter };
}
