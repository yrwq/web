import { createBrowserRouter, Navigate } from "react-router-dom";
import { RootLayout } from "./RootLayout";
import { BlogIndexPage } from "./routes/blog/BlogIndexPage";
import { BlogPostPage } from "./routes/blog/BlogPostPage";

export const router = createBrowserRouter([
	{
		path: "/",
		element: <RootLayout />,
		children: [
			{
				index: true,
				element: <Navigate to="/blog" replace />,
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
				path: "*",
				element: <div>Page not found</div>,
			},
		],
	},
]);
