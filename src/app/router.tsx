import { createBrowserRouter, Navigate } from "react-router-dom";
import { RootLayout } from "./RootLayout";
import { BlogIndexPage } from "./routes/blog/BlogIndexPage";
import { BlogPostPage } from "./routes/blog/BlogPostPage";
import { CheatsheetIndexPage } from "./routes/cheatsheets/CheatsheetIndexPage";
import { CheatsheetPage } from "./routes/cheatsheets/CheatsheetPage";
import { NotFoundPage } from "./routes/NotFoundPage";

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
				path: "cheatsheets",
				element: <CheatsheetIndexPage />,
			},
			{
				path: "cheatsheets/:slug",
				element: <CheatsheetPage />,
			},
			{
				path: "*",
				element: <NotFoundPage />,
			},
		],
	},
]);
