import GitHubCalendar from "react-github-calendar";
import { Card } from "@/components/Card";
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

export default function Home() {
  const minimalTheme = {
    light: ["#f2e9e1", "#d7827e"],
    // for `dark` the default theme will be used
  };
  return (
    <div className="container mx-auto p-4">
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        {/* GitHub Card - First row, spans 3 columns */}
        <Card
          icon={<GithubOutlined />}
          title="GitHub"
          className="md:col-span-3 h-auto"
        >
          <div className="flex justify-center items-center p-4">
            <GitHubCalendar
              theme={minimalTheme}
              username="yrwq"
              hideColorLegend
              hideTotalCount
              hideMonthLabels
              blockMargin={2}
              blockSize={13}
            />
          </div>
        </Card>

        {/* Status Card - First row, 1 column */}
        <Card
          icon={<Radio />}
          title="Status"
          className="h-auto"
        >
          <div className="p-4">
            <Status />
          </div>
        </Card>

        {/* Projects Card - Side by side with What I Use, equal width */}
        <Card
          icon={<Monitor />}
          title="Projects"
          className="md:col-span-2 h-auto"
        >
          <div className="p-4 min-h-[200px]">
            {/* Content for projects */}
          </div>
        </Card>

        {/* What I Use Card - Side by side with Projects, equal width */}
        <Card
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
        </Card>
      </div>
    </div>
  );
}