"use client";

import { BoxedIcon } from "@/components/BoxedIcon";
import { GitHubCalendarWrapper } from "@/components/GitHubCalendarWrapper";
import { MagicMainCard } from "@/components/MagicMainCard";
import { Status } from "@/components/Status";
import {
  CodeOutlined,
  DiscordFilled,
  GithubOutlined,
  LinuxOutlined,
} from "@ant-design/icons";
import {
  BookOpen,
  ChevronRight,
  Code,
  Coffee,
  Cog,
  Globe,
  Laptop,
  MessageSquare,
  Monitor,
  Music,
  PenSquare,
  Shell,
  SquareChevronRight,
  SquareTerminalIcon,
  Terminal,
} from "lucide-react";
import Link from "next/link";
import { useRef, useState } from "react";
import styles from "./home.module.css";

export function ProjectItem({
  title,
  url,
  tags,
  icon,
}: {
  title: string;
  tags: string;
  url: string;
  icon: React.ReactNode;
}) {
  return (
    <Link
      href={url}
      target="_blank"
      className="p-2 flex flex-col text-foreground"
    >
      <h1 className="flex items-center">
        <BoxedIcon>{icon}</BoxedIcon>
        <span className="ml-2 font-medium">{title}</span>
      </h1>
      <p className="text-xs mt-1 text-muted-foreground">{tags}</p>
    </Link>
  );
}

export default function Home() {
  // Track mouse position for spotlight effect
  const containerRef = useRef<HTMLDivElement>(null);
  const [cards, setCards] = useState<HTMLElement[]>([]);

  return (
    <div className="container mx-auto px-4 py-8">
      <div
        ref={containerRef}
        className={`${styles["bento-grid"]} grid grid-cols-12 auto-rows-[100px] gap-4`}
      >
        {/* Profile Card - Larger tile */}
        <MagicMainCard
          icon={<Coffee />}
          title="yrwq"
          className={`col-span-12 md:col-span-8 row-span-2 bento-card ${styles["hover-lift"]}`}
        >
          <div className="p-4 flex flex-col h-full">
            <p className="mb-4">
              Designer and engineer based in Hungary. Working with web
              technologies, cli apps and open source software. Feel free to
              contact me!
            </p>
          </div>
        </MagicMainCard>

        {/* Status Card */}
        <MagicMainCard
          icon={<DiscordFilled />}
          title="Status"
          className={`col-span-12 md:col-span-4 row-span-2 bento-card ${styles["hover-lift"]}`}
        >
          <div className="p-2">
            <Status />
          </div>
        </MagicMainCard>

        {/* GitHub Card */}
        <MagicMainCard
          icon={<GithubOutlined />}
          title="GitHub"
          className={`col-span-9 row-span-2 bento-card ${styles["hover-lift"]}`}
        >
          <div className="flex justify-center items-center p-2">
            <GitHubCalendarWrapper />
          </div>
        </MagicMainCard>

        {/* Contact Card */}
        <MagicMainCard
          icon={<MessageSquare />}
          title="Contact"
          className={`col-span-3 row-span-2 bento-card ${styles["hover-lift"]}`}
        >
          <div className="p-2 text-sm">
            <Link
              href="mailto:yrwq_again@proton.me"
              className="text-blue hover:text-red transition-all duration-300"
            >
              yrwq_again@proton.me
            </Link>
          </div>
        </MagicMainCard>

        {/* Stack Card */}
        <MagicMainCard
          icon={<Code />}
          title="Stack"
          className={`col-span-6 md:col-span-3 row-span-2 bento-card ${styles["hover-lift"]}`}
        >
          <div className="p-2 text-sm">
            <div className="flex items-center">
              <span className="bg-blue w-2 h-2 rounded-full mr-2"></span>
              <span>React / Next.js</span>
            </div>
          </div>
          <div className="p-2 text-sm">
            <div className="flex items-center">
              <span className="bg-orange w-2 h-2 rounded-full mr-2"></span>
              <span>Rust</span>
            </div>
          </div>
          <div className="p-2 text-sm">
            <div className="flex items-center">
              <span className="bg-rose-400 w-2 h-2 rounded-full mr-2"></span>
              <span>Swift</span>
            </div>
          </div>
        </MagicMainCard>

        {/* Blog Card */}
        <MagicMainCard
          icon={<BookOpen />}
          title="Latest Post"
          className={`col-span-6 md:col-span-3 row-span-2 bento-card ${styles["hover-lift"]}`}
        >
          <div className="p-2 flex flex-col h-full">
            <p className="text-sm line-clamp-2">
              Check out my latest thoughts on web development and design...
            </p>
            <Link
              href="/blog"
              className="mt-auto text-blue hover:text-red transition-all duration-300 text-sm"
            >
              Read Blog →
            </Link>
          </div>
        </MagicMainCard>

        {/* What I Use Card */}
        <MagicMainCard
          icon={<Cog />}
          title="What I Use"
          className={`col-span-12 md:col-span-6 row-span-2 bento-card ${styles["hover-lift"]}`}
        >
          <div
            className={`grid grid-cols-1 sm:grid-cols-2 gap-3 p-3 ${styles["bento-scroll"]}`}
          >
            <div className="p-2 flex items-center">
              <BoxedIcon>
                <Laptop />
              </BoxedIcon>
              <span className="ml-2">Macbook Pro 2021 13&quot;</span>
            </div>
            <div className="p-2 flex items-center">
              <BoxedIcon>
                <SquareTerminalIcon />
              </BoxedIcon>
              <span className="ml-2">Ghostty</span>
            </div>
            <div className="p-2 flex items-center">
              <BoxedIcon>
                <Monitor />
              </BoxedIcon>
              <span className="ml-2">Yabai + Skhd</span>
            </div>
            <div className="p-2 flex items-center">
              <BoxedIcon>
                <PenSquare />
              </BoxedIcon>
              <span className="ml-2">Zed, Neovim</span>
            </div>
          </div>
        </MagicMainCard>

        {/* Projects Card */}
        <MagicMainCard
          icon={<Terminal />}
          title="Projects"
          className={`col-span-12 md:col-span-6 row-span-3 bento-card ${styles["hover-lift"]}`}
        >
          <div
            className={`grid grid-cols-1 sm:grid-cols-2 gap-3 p-3 ${styles["bento-scroll"]}`}
          >
            <ProjectItem
              title="website"
              url="https://github.com/yrwq/web"
              tags="Next.js, Tailwind, TypeScript"
              icon={<Globe />}
            />
            <ProjectItem
              title="dotfiles"
              url="https://github.com/yrwq/dotfiles"
              tags="workflow config files"
              icon={<Terminal />}
            />
            <ProjectItem
              title="termstart"
              url="https://github.com/yrwq/termstart"
              tags="JS, (rewrite wip on wasm branch)"
              icon={<SquareChevronRight />}
            />
          </div>
        </MagicMainCard>

        {/* Music Card */}
        <MagicMainCard
          icon={<Music />}
          title="Now Playing"
          className={`col-span-6 md:col-span-3 row-span-1 bento-card ${styles["hover-lift"]}`}
        >
          <div className="p-2 text-sm">
            <h1 className="text-red">TODO</h1>
          </div>
        </MagicMainCard>
      </div>
    </div>
  );
}
