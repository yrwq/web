'use server';

import { getAllBlogPosts } from "@/lib/mdx/utils";

export async function getPosts() {
  return getAllBlogPosts();
} 