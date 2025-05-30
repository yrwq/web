import fs from "fs";
import path from "path";
import matter from "gray-matter";
import { compileMDX } from "next-mdx-remote/rsc";
import rehypePrettyCode from "rehype-pretty-code";
import { createHighlighter } from 'shiki';

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

const prettyCodeOptions = {
  theme: {
    light: 'github-light',
    dark: 'github-dark',
    'gruvbox-light-hard': 'github-light',
    'gruvbox-dark-hard': 'github-dark'
  },
  keepBackground: true,
  onVisitLine(node: any) {
    // Initialize properties if they don't exist
    if (!node.properties) {
      node.properties = {};
    }
    if (!node.properties.className) {
      node.properties.className = [];
    }

    // Add line numbers
    if (node.children.length === 0) {
      node.children = [{
        type: 'text',
        value: ' '
      }];
    }
    node.properties.className.push('line');
    node.properties['data-line'] = node.properties['data-line'] || '';
  },
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
  getHighlighter: async () => {
    const highlighter = await createHighlighter({
      themes: ['github-light', 'github-dark'],
      langs: ['javascript', 'typescript', 'jsx', 'tsx', 'html', 'css', 'json', 'bash', 'markdown', 'mdx', 'python', 'rust', 'go', 'shell', 'yaml', 'toml', 'sql']
    });
    return highlighter;
  }
};

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

// Process MDX content
export async function processMdx(content: string) {
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
            ...prettyCodeOptions,
            onVisitLine(node: any) {
              if (!node.properties) {
                node.properties = {};
              }
              if (!node.properties.className) {
                node.properties.className = [];
              }
              node.properties.className.push('line');
              node.properties['data-line'] = node.properties['data-line'] || '';
            },
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
            }
          }]
        ]
      },
    },
  });

  return { content: processedContent, frontmatter };
}
