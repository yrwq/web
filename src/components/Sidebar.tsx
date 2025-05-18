import Image from "next/image";
import { BoxedIcon } from "@/components/BoxedIcon";
import {
  HeartOutlined,
  DiscordFilled,
  GithubFilled,
  HomeOutlined,
} from "@ant-design/icons";
import { TextGenerateEffect } from "@/components/TextGen";
import {
  Bookmark,
  Cog,
  Mail,
  MailPlus,
  Menu,
  Palette,
  SquarePen,
} from "lucide-react";
import Link from "next/link";
import { ThemeToggle } from "@/components/ThemeToggle";
import ThemeSelector from "@/components/ThemeSelector";

export function Sidebar() {
  return (
    <div className="p-8 flex relative min-h-screen max-w-[25%] min-w-[25%] flex-col bg-surface shadow-overlay shadow-xl rounded-r-2xl">
      <div className="relative flex">
        <h2 className="flex justify-center items-center">
          <Link href={"/"}>
            <BoxedIcon>
              <HeartOutlined />
            </BoxedIcon>
          </Link>
          yrwq
        </h2>
        <span className="absolute right-1 flex">
          <ThemeToggle />
          <a
            href="https://discord.com/users/925056171197464658"
            target="_blank"
          >
            <BoxedIcon>
              <DiscordFilled />
            </BoxedIcon>
          </a>
          <a href="https://github.com/yrwq" target="_blank">
            <BoxedIcon>
              <GithubFilled />
            </BoxedIcon>
          </a>
        </span>
      </div>
      <span className="mt-10 flex gap-8">
        <div className="w-52 drop-shadow-2xl rounded-xl saturate-150 shadow-pine dark:shadow-dark-pine">
          <Image
            alt="me"
            src={"/gun.jpg"}
            width={150}
            height={100}
            className="rounded-xl shadow-2xl drop-shadow-2xl shadow-muted"
          />
        </div>
        <span className="text-foreground dark:text-foreground">
          <TextGenerateEffect
            words={"hello, im yrwq"}
            className="text-2xl font-bold"
          />
          <TextGenerateEffect
            words={" a designer and engineer based in hungary. "}
            className=""
          />
        </span>
      </span>

      <div className="mt-8">
        <ThemeSelector />
      </div>

      <div className="my-10">
        <h2 className="flex items-center">
          <BoxedIcon>
            <Menu />
          </BoxedIcon>
          Navigation
        </h2>

        <Link
          href="/"
          className="mt-2 flex items-center text-foreground dark:text-foreground"
        >
          <BoxedIcon>
            <HomeOutlined />
          </BoxedIcon>
          Home
        </Link>

        <Link
          href="/blog"
          className="mt-2 flex items-center text-foreground dark:text-foreground"
        >
          <BoxedIcon>
            <SquarePen />
          </BoxedIcon>
          Posts
        </Link>

        <Link
          href="/blog"
          className="mt-2 flex items-center text-foreground dark:text-foreground"
        >
          <BoxedIcon>
            <Bookmark />
          </BoxedIcon>
          Bookmarks
        </Link>
      </div>

      <div className="flex">
        <h2 className="flex justify-center items-center">
          <BoxedIcon>
            <Mail />
          </BoxedIcon>
          Contact
        </h2>
      </div>
      <span className="mt-4 gap-1 flex flex-col">
        <Link
          href="https://github.com/yrwq"
          target="_blank"
          className="flex text-foreground dark:text-foreground items-center"
        >
          <BoxedIcon>
            <GithubFilled />
          </BoxedIcon>
          yrwq
        </Link>

        <Link
          href="mailto:yrwq_again@proton.me"
          target="_blank"
          className="flex text-foreground dark:text-foreground items-center"
        >
          <BoxedIcon>
            <MailPlus />
          </BoxedIcon>
          yrwq_again@proton.me
        </Link>

        <Link
          href="https://discord.com/users/925056171197464658"
          target="_blank"
          className="flex text-foreground dark:text-foreground items-center"
        >
          <BoxedIcon>
            <DiscordFilled />
          </BoxedIcon>
          yrwq_
        </Link>
      </span>
    </div>
  );
}
