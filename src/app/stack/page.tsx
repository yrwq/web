"use client";

import { BoxedIcon } from "@/components/BoxedIcon";
import { MagicMainCard } from "@/components/MagicMainCard";
import {
  Laptop,
  Terminal,
  Code,
  Globe,
  FileText,
  Brain,
  Bookmark,
  Container,
  Palette,
  Mail,
  Database,
  GitBranch,
  Zap,
  Shield,
  MonitorSpeaker,
  Smartphone,
  Cloud,
  Server,
  MessageCircle,
  Camera,
  Headphones,
  HardDrive,
  Wifi,
  Activity,
  Lock,
  Package,
} from "lucide-react";
import Link from "next/link";
import styles from "@/styles/home.module.css";

interface StackItemProps {
  title: string;
  description: string;
  url?: string;
  icon: React.ReactNode;
  category: string;
}

function StackItem({
  title,
  description,
  url,
  icon,
  category,
}: StackItemProps) {
  const content = (
    <div className="p-3 flex flex-col h-full hover:bg-overlay/20 rounded-md transition-colors duration-200">
      <div className="flex items-start mb-3">
        <BoxedIcon className="w-10 h-10 flex-shrink-0">{icon}</BoxedIcon>
        <div className="ml-3 flex-1">
          <h3 className="font-medium text-foreground text-sm">{title}</h3>
          <p className="text-xs text-muted-foreground mt-1">{category}</p>
        </div>
      </div>
      <p className="text-sm text-muted-foreground leading-relaxed">
        {description}
      </p>
    </div>
  );

  if (url) {
    return (
      <Link href={url} target="_blank" className="block h-full">
        {content}
      </Link>
    );
  }

  return content;
}

export default function StackPage() {
  const hardwareItems: StackItemProps[] = [
    {
      title: 'MacBook Pro 13" 2020 M1',
      description: "Primary development machine.",
      icon: <Laptop />,
      category: "Hardware",
    },
    {
      title: "iPhone 12",
      description: "Primary device for mobile app testing.",
      icon: <Smartphone />,
      category: "Mobile",
    },
  ];

  const developmentTools: StackItemProps[] = [
    {
      title: "Ghostty Terminal",
      description: "Fast, feature-rich terminal emulator.",
      icon: <Terminal />,
      category: "Terminal",
    },
    {
      title: "Zed Editor",
      description:
        "High-performance code editor built for speed. Perfect for modern web development.",
      icon: <Code />,
      category: "Editor",
    },
  ];

  const toolsAndServices: StackItemProps[] = [
    {
      title: "OrbStack",
      description:
        "Manager for Docker, Kubernetes and Linux VMs in one place. Streamlines container and virtualization workflows.",
      url: "https://orbstack.dev/",
      icon: <Container />,
      category: "DevOps",
    },
    {
      title: "Brave Browser",
      description:
        "Privacy-focused browser with built-in ad blocking and enhanced security features for safer web browsing.",
      icon: <Globe />,
      category: "Browser",
    },
    {
      title: "Sketch",
      description:
        "Digital design toolkit for creating user interfaces, prototypes, and design systems.",
      icon: <Palette />,
      category: "Design",
    },
    {
      title: "MimeStream",
      description:
        "Native macOS email client that provides a clean, fast interface for managing Gmail accounts with advanced features.",
      icon: <Mail />,
      category: "Email",
    },
    {
      title: "Beekeeper Studio",
      description:
        "Modern database GUI client that supports multiple database types with an intuitive interface for queries and data management.",
      icon: <Database />,
      category: "Database",
    },
    {
      title: "Tower",
      description:
        "Powerful Git client for macOS that makes version control easy with visual diff tools, merge conflict resolution, and team collaboration.",
      icon: <GitBranch />,
      category: "Version Control",
    },
    {
      title: "Insomnia",
      description:
        "REST API client for testing and debugging APIs with support for GraphQL, gRPC, and comprehensive request organization.",
      icon: <Zap />,
      category: "API Testing",
    },
    {
      title: "Proxyman",
      description:
        "Native macOS app for capturing, inspecting, and manipulating HTTP/HTTPS traffic for debugging web applications and APIs.",
      icon: <Shield />,
      category: "Network Debugging",
    },
  ];

  const cloudAndServices: StackItemProps[] = [
    {
      title: "Vercel",
      description:
        "Frontend deployment platform that makes it easy to deploy and scale web applications with automatic HTTPS and global CDN.",
      url: "https://vercel.com/",
      icon: <Cloud />,
      category: "Hosting",
    },
    {
      title: "Supabase",
      description:
        "Open source Firebase alternative providing real-time databases, authentication, and edge functions for modern applications.",
      url: "https://supabase.com/",
      icon: <Database />,
      category: "Backend as a Service",
    },
  ];

  const systemUtilities: StackItemProps[] = [
    {
      title: "CleanMyMac X",
      description:
        "Mac optimization tool that cleans junk files, manages startup items, and maintains system performance for development work.",
      icon: <HardDrive />,
      category: "System Maintenance",
    },
    {
      title: "Homebrew",
      description:
        "Package manager for macOS that simplifies the installation of command-line tools and development dependencies.",
      icon: <Package />,
      category: "Package Management",
    },
  ];

  const productivityApps: StackItemProps[] = [
    {
      title: "Notion",
      description:
        "All-in-one workspace for notes, project management, and documentation. Great for organizing development projects.",
      icon: <FileText />,
      category: "Productivity",
    },
    {
      title: "Obsidian",
      description:
        "Knowledge management tool with powerful linking capabilities. Perfect for building a personal knowledge base.",
      icon: <Brain />,
      category: "Knowledge",
    },
    {
      title: "Raindrop",
      description:
        "Smart bookmark manager for collecting and organizing web resources, articles, and development references.",
      icon: <Bookmark />,
      category: "Bookmarks",
    },
  ];

  return (
    <div className="container max-w-6xl mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-foreground mb-4">
          My Development Stack
        </h1>
        <p className="text-muted-foreground text-lg">
          The tools and technologies I use for development, productivity, and
          daily workflows.
        </p>
      </div>

      <div className="space-y-12">
        {/* Hardware Section */}
        <section>
          <h2 className="text-xl font-semibold text-foreground mb-6 flex items-center">
            <Laptop className="mr-2" size={20} />
            Hardware
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {hardwareItems.map((item, index) => (
              <MagicMainCard
                key={index}
                icon={item.icon}
                title={item.title}
                className={`bento-card ${styles["hover-lift"]} min-h-[180px]`}
              >
                <div className="p-2">
                  <p className="text-sm text-muted-foreground leading-relaxed">
                    {item.description}
                  </p>
                </div>
              </MagicMainCard>
            ))}
          </div>
        </section>

        {/* Development Tools Section */}
        <section>
          <h2 className="text-xl font-semibold text-foreground mb-6 flex items-center">
            <Code className="mr-2" size={20} />
            Development Tools
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {developmentTools.map((item, index) => (
              <MagicMainCard
                key={index}
                icon={item.icon}
                title={item.title}
                className={`bento-card ${styles["hover-lift"]} min-h-[180px]`}
              >
                <div className="p-2">
                  <p className="text-sm text-muted-foreground leading-relaxed">
                    {item.description}
                  </p>
                </div>
              </MagicMainCard>
            ))}
          </div>
        </section>

        {/* Tools & Services Section */}
        <section>
          <h2 className="text-xl font-semibold text-foreground mb-6 flex items-center">
            <Container className="mr-2" size={20} />
            Development Tools
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {toolsAndServices.map((item, index) => (
              <MagicMainCard
                key={index}
                icon={item.icon}
                title={item.title}
                className={`bento-card ${styles["hover-lift"]} min-h-[180px] ${item.url ? "cursor-pointer" : ""}`}
              >
                <div className="p-2">
                  <p className="text-sm text-muted-foreground leading-relaxed mb-3">
                    {item.description}
                  </p>
                  {item.url && (
                    <Link
                      href={item.url}
                      target="_blank"
                      className="text-blue hover:text-red transition-colors duration-200 text-sm font-medium inline-flex items-center"
                    >
                      Learn more →
                    </Link>
                  )}
                </div>
              </MagicMainCard>
            ))}
          </div>
        </section>

        {/* Cloud & Services Section */}
        <section>
          <h2 className="text-xl font-semibold text-foreground mb-6 flex items-center">
            <Cloud className="mr-2" size={20} />
            Cloud & Services
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {cloudAndServices.map((item, index) => (
              <MagicMainCard
                key={index}
                icon={item.icon}
                title={item.title}
                className={`bento-card ${styles["hover-lift"]} min-h-[180px] ${item.url ? "cursor-pointer" : ""}`}
              >
                <div className="p-2">
                  <p className="text-sm text-muted-foreground leading-relaxed mb-3">
                    {item.description}
                  </p>
                  {item.url && (
                    <Link
                      href={item.url}
                      target="_blank"
                      className="text-blue hover:text-red transition-colors duration-200 text-sm font-medium inline-flex items-center"
                    >
                      Learn more →
                    </Link>
                  )}
                </div>
              </MagicMainCard>
            ))}
          </div>
        </section>

        {/* System Utilities Section */}
        <section>
          <h2 className="text-xl font-semibold text-foreground mb-6 flex items-center">
            <Activity className="mr-2" size={20} />
            System Utilities
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {systemUtilities.map((item, index) => (
              <MagicMainCard
                key={index}
                icon={item.icon}
                title={item.title}
                className={`bento-card ${styles["hover-lift"]} min-h-[180px]`}
              >
                <div className="p-2">
                  <p className="text-sm text-muted-foreground leading-relaxed">
                    {item.description}
                  </p>
                </div>
              </MagicMainCard>
            ))}
          </div>
        </section>

        {/* Productivity Apps Section */}
        <section>
          <h2 className="text-xl font-semibold text-foreground mb-6 flex items-center">
            <FileText className="mr-2" size={20} />
            Productivity & Knowledge
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {productivityApps.map((item, index) => (
              <MagicMainCard
                key={index}
                icon={item.icon}
                title={item.title}
                className={`bento-card ${styles["hover-lift"]} min-h-[180px]`}
              >
                <div className="p-2">
                  <p className="text-sm text-muted-foreground leading-relaxed">
                    {item.description}
                  </p>
                </div>
              </MagicMainCard>
            ))}
          </div>
        </section>
      </div>
    </div>
  );
}
