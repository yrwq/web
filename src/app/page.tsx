"use client";

import { MagicMainCard } from "@/components/MagicMainCard";
import { GithubOutlined, LinuxOutlined, CodeOutlined } from "@ant-design/icons";
import {
  ChevronRight,
  Cog,
  Laptop,
  Monitor,
  PenSquare,
  Radio,
  SquareTerminalIcon,
  Music,
  BookOpen,
  Code,
  Coffee,
  MessageSquare,
  Terminal,
  Globe,
} from "lucide-react";
import { BoxedIcon } from "@/components/BoxedIcon";
import { Status } from "@/components/Status";
import { GitHubCalendarWrapper } from "@/components/GitHubCalendarWrapper";
import Link from "next/link";
import styles from "./home.module.css";
import { useState, useEffect, useRef } from "react";

export default function Home() {
  // Track mouse position for spotlight effect
  const containerRef = useRef<HTMLDivElement>(null);
  const [cards, setCards] = useState<HTMLElement[]>([]);

  useEffect(() => {
    if (containerRef.current) {
      setCards(
        Array.from(containerRef.current.querySelectorAll(".bento-card")),
      );
    }

    const handleMouseMove = (e: MouseEvent) => {
      cards.forEach((card) => {
        const rect = card.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;

        card.style.setProperty("--mouse-x", `${x}px`);
        card.style.setProperty("--mouse-y", `${y}px`);
      });
    };

    window.addEventListener("mousemove", handleMouseMove);

    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
    };
  }, [cards]);

  return (
    <div className="container mx-auto px-4 py-8">
      <div
        ref={containerRef}
        className={`${styles["bento-grid"]} grid grid-cols-12 auto-rows-[120px] gap-4`}
      >
        {/* Profile Card - Larger tile */}
        <MagicMainCard
          icon={<Coffee />}
          title="yrwq"
          className={`col-span-12 md:col-span-8 row-span-2 bento-card ${styles["hover-lift"]}`}
        >
          <div className="p-4 flex flex-col h-full">
            <p className="text-lg mb-4">
              Designer and engineer based in Hungary. Working with web
              technologies and open source software.
            </p>
            <div className="flex gap-4 mt-auto">
              <Link
                href="https://github.com/yrwq"
                className="text-blue hover:text-red transition-all duration-300"
              >
                GitHub
              </Link>
              <Link
                href="/blog"
                className="text-blue hover:text-red transition-all duration-300"
              >
                Blog
              </Link>
              <Link
                href="#"
                className="text-blue hover:text-red transition-all duration-300"
              >
                Projects
              </Link>
            </div>
          </div>
        </MagicMainCard>

        {/* Status Card */}
        <MagicMainCard
          icon={<Radio />}
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
          className={`col-span-12 row-span-2 bento-card ${styles["hover-lift"]}`}
        >
          <div className="flex justify-center items-center p-2">
            <GitHubCalendarWrapper />
          </div>
        </MagicMainCard>

        {/* Stack Card */}
        <MagicMainCard
          icon={<Code />}
          title="Stack"
          className={`col-span-6 md:col-span-3 row-span-2 bento-card ${styles["hover-lift"]}`}
        >
          <div className="p-2 text-sm">
            <div className="flex items-center mb-2">
              <span className="bg-blue w-2 h-2 rounded-full mr-2"></span>
              <span>React / Next.js</span>
            </div>
            <div className="flex items-center mb-2">
              <span className="bg-green w-2 h-2 rounded-full mr-2"></span>
              <span>Tailwind CSS</span>
            </div>
            <div className="flex items-center mb-2">
              <span className="bg-yellow w-2 h-2 rounded-full mr-2"></span>
              <span>TypeScript</span>
            </div>
            <div className="flex items-center">
              <span className="bg-purple w-2 h-2 rounded-full mr-2"></span>
              <span>Node.js</span>
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
          className={`col-span-12 md:col-span-6 row-span-3 bento-card ${styles["hover-lift"]}`}
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
                <LinuxOutlined />
              </BoxedIcon>
              <span className="ml-2">Asahi Linux</span>
            </div>
            <div className="p-2 flex items-center">
              <BoxedIcon>
                <ChevronRight />
              </BoxedIcon>
              <span className="ml-2">zsh</span>
            </div>
            <div className="p-2 flex items-center">
              <BoxedIcon>
                <SquareTerminalIcon />
              </BoxedIcon>
              <span className="ml-2">Wezterm</span>
            </div>
            <div className="p-2 flex items-center">
              <BoxedIcon>
                <Monitor />
              </BoxedIcon>
              <span className="ml-2">Hyprland</span>
            </div>
            <div className="p-2 flex items-center">
              <BoxedIcon>
                <PenSquare />
              </BoxedIcon>
              <span className="ml-2">Neovim, Zed</span>
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
            <div className="p-2 flex flex-col">
              <div className="flex items-center">
                <BoxedIcon>
                  <Globe />
                </BoxedIcon>
                <span className="ml-2 font-medium">Personal Website</span>
              </div>
              <p className="text-xs mt-1 text-muted-foreground">
                Next.js, Tailwind, TypeScript
              </p>
            </div>
            <div className="p-2 flex flex-col">
              <div className="flex items-center">
                <BoxedIcon>
                  <Terminal />
                </BoxedIcon>
                <span className="ml-2 font-medium">dotfiles</span>
              </div>
              <p className="text-xs mt-1 text-muted-foreground">
                Shell configuration files
              </p>
            </div>
            <div className="p-2 flex flex-col">
              <div className="flex items-center">
                <BoxedIcon>
                  <CodeOutlined />
                </BoxedIcon>
                <span className="ml-2 font-medium">nvim-config</span>
              </div>
              <p className="text-xs mt-1 text-muted-foreground">
                Neovim configuration
              </p>
            </div>
            <div className="p-2 flex flex-col">
              <div className="flex items-center">
                <BoxedIcon>
                  <MessageSquare />
                </BoxedIcon>
                <span className="ml-2 font-medium">Chat App</span>
              </div>
              <p className="text-xs mt-1 text-muted-foreground">
                React, Firebase, Tailwind
              </p>
            </div>
          </div>
        </MagicMainCard>

        {/* Music Card */}
        <MagicMainCard
          icon={<Music />}
          title="Now Playing"
          className={`col-span-6 md:col-span-3 row-span-1 bento-card ${styles["hover-lift"]}`}
        >
          <div className="p-2 text-sm">
            <p className="line-clamp-1">Discovering new music...</p>
          </div>
        </MagicMainCard>

        {/* Contact Card */}
        <MagicMainCard
          icon={<MessageSquare />}
          title="Contact"
          className={`col-span-6 md:col-span-3 row-span-1 bento-card ${styles["hover-lift"]}`}
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
      </div>
    </div>
  );
}
