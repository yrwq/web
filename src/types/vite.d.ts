declare module "virtual:blog-content" {
	export const posts: import("@/features/blog/types/blog").BlogPostMeta[];
}

declare module "virtual:projects-content" {
	export const projects: import("@/features/projects/types/project").ProjectMeta[];
}
