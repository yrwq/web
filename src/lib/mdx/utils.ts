import fs from "fs";
import path from "path";
import matter from "gray-matter";
import { compileMDX } from "next-mdx-remote/rsc";
import rehypePrettyCode from "rehype-pretty-code";

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
  theme: "github-dark",
  keepBackground: true,
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
  // Import custom components
  const Alert = (await import("@/components/mdx/Alert")).default;
  const Todo = (await import("@/components/mdx/Todo")).default;
  const CodeBlock = (await import("@/components/mdx/CodeBlock")).default;

  const { content: processedContent, frontmatter } = await compileMDX({
    source: content,
    components: {
      Alert,
      Todo,
      CodeBlock,
    },
    options: {
      parseFrontmatter: true,
      mdxOptions: {
        rehypePlugins: [[rehypePrettyCode, prettyCodeOptions]],
      },
    },
  });

  return { content: processedContent, frontmatter };
}
