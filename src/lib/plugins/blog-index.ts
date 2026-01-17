import type { Plugin } from 'vite';
import fs from 'fs/promises';
import path from 'path';
import yaml from 'js-yaml';
import readingTime from 'reading-time';
import type { BlogPostMeta } from '../../features/blog/types/blog';

function parseFrontmatter(content: string) {
  const normalized = content.replace(/^\uFEFF/, '');
  const match = normalized.match(/^---\r?\n([\s\S]*?)\r?\n---/);

  if (!match) {
    return { data: {}, content: normalized };
  }

  try {
    const data = yaml.load(match[1]);
    const body = normalized.slice(match[0].length).trim();
    return { data: data as Record<string, any>, content: body };
  } catch (e) {
    console.error('Failed to parse frontmatter:', e);
    return { data: {}, content: normalized };
  }
}

export function blogIndexPlugin(): Plugin {
  const virtualModuleId = 'virtual:blog-content';
  const resolvedVirtualModuleId = '\0' + virtualModuleId;
  const contentDir = path.resolve(process.cwd(), 'src/content/blog');

  return {
    name: 'vite-plugin-blog-index',
    resolveId(id) {
      if (id === virtualModuleId) {
        return resolvedVirtualModuleId;
      }
    },
    async load(id) {
      if (id === resolvedVirtualModuleId) {
        const posts: BlogPostMeta[] = [];

        try {
          const files = await fs.readdir(contentDir);
          const mdxFiles = files.filter(f => f.endsWith('.mdx'));

          for (const file of mdxFiles) {
            const filePath = path.join(contentDir, file);
            const fileContent = await fs.readFile(filePath, 'utf-8');
            const { data, content } = parseFrontmatter(fileContent);

            if (!data.title) {
               console.warn(`Skipping ${file}: Missing title`);
               continue;
            }

            const slug = file.replace(/\.mdx$/, '');
            const stats = readingTime(content);

            posts.push({
              slug,
              title: data.title,
              date: data.date ? new Date(data.date).toISOString() : new Date().toISOString(),
              description: data.description || '',
              tags: data.tags || [],
              draft: data.draft || false,
              readingTime: stats.text,
              ...data,
            });
          }

          posts.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

        } catch (error) {
           console.error('Error indexing blog posts:', error);
        }

        return `export const posts = ${JSON.stringify(posts)}`;
      }
    },
    async handleHotUpdate({ file, server }) {
      if (file.startsWith(contentDir) && file.endsWith('.mdx')) {
        const mod = server.moduleGraph.getModuleById(resolvedVirtualModuleId);
        if (mod) {
          server.moduleGraph.invalidateModule(mod);
          server.ws.send({
            type: 'full-reload',
            path: '*'
          });
        }
      }
    }
  };
}
