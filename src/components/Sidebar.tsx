import Image from "next/image";
import { BoxedIcon } from "@/components/BoxedIcon";
import { HeartOutlined, DiscordFilled, GithubFilled } from "@ant-design/icons";
import Link from "next/link";

export function Sidebar() {
  return (
    <div className="p-8 flex relative min-h-screen max-w-[25%] min-w-[25%] flex-col border-r border-border bg-overlay shadow-gold shadow-lg rounded-r-2xl">
      <div className="relative flex">
        <h2 className="flex justify-center items-center">
          <Link href={"/"}>
            <BoxedIcon>
              <HeartOutlined />
            </BoxedIcon>
          </Link>
          About me
        </h2>
        <span className="absolute right-1 flex">
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
        <Image
          alt="me"
          src={"/lostcat.png"}
          width={100}
          height={100}
          className="rounded-xl"
        />
        <span>
          hello, im yrwq <br />
          a designer and engineer based in hungary. <br />
          read more about me in my blog{" "}
          <a href="/blog" className="inline-flex">
            posts
          </a>
        </span>
      </span>
      <div className="flex mt-10">
        <h2>  Contact</h2>
      </div>
      <span className="mt-4 flex flex-col">
        <span>  yrwq_</span>
        <span> 󰇮 yrwq_again@proton.me</span>
      </span>

      <span className="mt-4">
        If you want to chat feel free to contact me on discord
      </span>
    </div>
  );
}
