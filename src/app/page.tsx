"use client";

import { MagicMainCard } from "@/components/MagicMainCard";
import { GithubOutlined, LinuxOutlined } from "@ant-design/icons";
import {
  ChevronRight,
  Cog,
  Laptop,
  Monitor,
  PenSquare,
  Radio,
  SquareTerminalIcon,
} from "lucide-react";
import { BoxedIcon } from "@/components/BoxedIcon";
import { Status } from "@/components/Status";
import { GitHubCalendarWrapper } from "@/components/GitHubCalendarWrapper";

export default function Home() {
  return (
    <div className="container m-auto mx-10">
      <div className="grid grid-cols-1 md:grid-cols-5 gap-6">
        {/* GitHub Card - First row, spans 3 columns */}
        <MagicMainCard
          icon={<GithubOutlined />}
          title="GitHub"
          className="md:col-span-4 justify-center items-center max-h-52"
        >
          <div className="flex justify-center items-center p-4">
            <GitHubCalendarWrapper />
          </div>
        </MagicMainCard>

        {/* Status Card - First row, 1 column */}
        <MagicMainCard
          icon={<Radio />}
          title="Status"
          className="max-h-52 justify-center items-center"
        >
          <div className="">
            <Status />
          </div>
        </MagicMainCard>

        {/* Projects Card - Side by side with What I Use, equal width */}
        <MagicMainCard
          icon={<Monitor />}
          title="Projects"
          className="md:col-span-3 h-auto"
        >
          <div className="p-4 min-h-[200px]">{/* Content for projects */}</div>
        </MagicMainCard>

        {/* What I Use Card - Side by side with Projects, equal width */}
        <MagicMainCard
          icon={<Cog />}
          className="md:col-span-2 h-auto"
          title="What I Use"
        >
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 p-3 min-h-[200px]">
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
      </div>
    </div>
  );
}
