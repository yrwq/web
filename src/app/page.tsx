import GitHubCalendar from "react-github-calendar";
import { Card } from "@/components/Card";
import { GithubOutlined } from "@ant-design/icons";

export default function Home() {
  const minimalTheme = {
    light: ["#faf4ed", "#d7827e"],
    // for `dark` the default theme will be used
  };
  return (
    <span>
      <Card icon={<GithubOutlined />} title="GitHub">
        <GitHubCalendar
          theme={minimalTheme}
          username="yrwq"
          hideColorLegend
          hideTotalCount
          hideMonthLabels
          blockMargin={2}
        />
      </Card>
    </span>
  );
}
