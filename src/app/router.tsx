import { createBrowserRouter, Navigate } from "react-router-dom";
import { RootLayout } from "./RootLayout";
import { BlogIndexPage } from "./routes/blog/BlogIndexPage";
import { BlogPostPage } from "./routes/blog/BlogPostPage";
import { MePage } from "./routes/MePage";
import { NotFoundPage } from "./routes/NotFoundPage";
import { ProjectDetailPage } from "./routes/projects/ProjectDetailPage";
import { ProjectsPage } from "./routes/projects/ProjectsPage";

export const router = createBrowserRouter([
	{
		path: "/",
		element: <RootLayout />,
		children: [
			{
				index: true,
				element: <Navigate to="/me" replace />,
			},
			{
				path: "me",
				element: <MePage />,
			},
			{
				path: "blog",
				element: <BlogIndexPage />,
			},
			{
				path: "blog/:slug",
				element: <BlogPostPage />,
			},
			{
				path: "projects",
				element: <ProjectsPage />,
			},
			{
				path: "projects/:slug",
				element: <ProjectDetailPage />,
			},
			{
				path: "*",
				element: <NotFoundPage />,
			},
		],
	},
]);
