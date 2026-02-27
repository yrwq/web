declare module "virtual:blog-content" {
	export const posts: import("./src/features/blog/types/blog").BlogPostMeta[];
}

declare module "virtual:projects-content" {
	export const projects: import("./src/features/projects/types/project").ProjectMeta[];
}
