import {
  Home,
  SquarePen,
  Music,
  BookmarkIcon,
  FolderGit,
  User,
  Heart,
  GithubIcon,
} from 'lucide-react'

import { title } from "@/lib/config"

export const LINKS = [
  {
    href: "/",
    label: title,
    icon: <Home size={16} />
  },
  {
    href: "/blog",
    label: "blog",
    icon: <SquarePen size={16} />
  },
  {
    href: "/music",
    label: "music",
    icon: <Music size={16} />
  },
  {
    href: "/bookmarks",
    label: "bookmarks",
    icon: <BookmarkIcon size={16} />
  },
  {
    href: "/projects",
    label: "projects",
    icon: <FolderGit size={16} />
  },
  {
    href: "/about",
    label: "about",
    icon: <User size={16} />
  },
  {
    href: "/donate",
    label: "donate",
    icon: <Heart size={16} />
  }
]


export const EXTLINKS = [
  {
    url: "https://git.yrwq.xyz",
    title: "git",
    icon: <GithubIcon size={16} />
  },
]
