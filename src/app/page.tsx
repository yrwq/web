import GitHubCalendar from "react-github-calendar";
import { Card } from "@/components/Card";
import { GithubOutlined, LinuxOutlined } from "@ant-design/icons";
import {
  ChevronRight,
  Cog,
  Laptop,
  Monitor,
  Music,
  PenSquare,
  Radio,
  SquareTerminalIcon,
} from "lucide-react";
import { BoxedIcon } from "@/components/BoxedIcon";
import { Status } from "@/components/Status";
import { Playing } from "@/components/Playing";

export default function Home() {
  const minimalTheme = {
    light: ["#f2e9e1", "#d7827e"],
    // for `dark` the default theme will be used
  };
  return (
    // main grid container
    <span className="grid justify-between grid-cols-6 grid-rows-4 max-h-[90vh] gap-8">
      {/* Top row */}
      {/* Status */}
      <Card icon={<Radio />} title="Status" className="col-span-2 h-56 w-full">
        <Status />
      </Card>
      {/* Status End */}

      {/* Github Card */}
      <Card
        icon={<GithubOutlined />}
        title="GitHub"
        className="col-span-4 h-56"
      >
        <span className="flex justify-center items-center p-4 h-40">
          <GitHubCalendar
            theme={minimalTheme}
            username="yrwq"
            hideColorLegend
            hideTotalCount
            hideMonthLabels
            blockMargin={2}
            blockSize={13}
          />
        </span>
      </Card>
      {/* Github Card end */}
      {/* top row end */}

      {/* Center row */}
      {/* Music */}
      <Card
        icon={<Music />}
        title="Recently played"
        className="col-span-2 w-full row-span-2 h-full"
      >
        <Playing />
      </Card>
      {/* Music end */}

      {/* Software & hardware */}
      <Card
        icon={<Cog />}
        className="col-span-2 row-span-1 h-64"
        title="What i use"
      >
        <span className="grid grid-cols-2">
          <div className="py-2 px-2 flex items-center">
            <BoxedIcon>
              <Laptop />
            </BoxedIcon>
            Macbook Pro 2021 13&quot;
          </div>
          <div className="py-2 px-2 flex items-center">
            <BoxedIcon>
              <LinuxOutlined />
            </BoxedIcon>
            Asahi Linux
          </div>
          <div className="py-2 px-2 flex items-center">
            <BoxedIcon>
              <ChevronRight />
            </BoxedIcon>
            zsh
          </div>
          <div className="py-2 px-2 flex items-center">
            <BoxedIcon>
              <SquareTerminalIcon />
            </BoxedIcon>
            Wezterm
          </div>
          <div className="py-2 px-2 flex items-center">
            <BoxedIcon>
              <Monitor />
            </BoxedIcon>
            Hyprland
          </div>
          <div className="py-2 px-2 flex items-center">
            <BoxedIcon>
              <PenSquare />
            </BoxedIcon>
            Neovim, Zed
          </div>
        </span>
      </Card>
      {/* software & hardware end */}
    </span>
  );
}
