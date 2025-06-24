"use client";
import clsx from "clsx";
import { Circle } from "lucide-react";
import React, { useEffect, useState } from "react";

export function Status({ className }: { className?: string }) {
  const url = "https://api.lanyard.rest/v1/users/925056171197464658";

  const [data, setData] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      const res = await fetch(url);
      const result = await res.json();
      setData(result);
    };

    fetchData();
  }, []);

  if (!data)
    return (
      <div className="flex h-32 items-center justify-center text-gray">
        <h2>
          <span className={`flex gap-3`}>
            <Circle />
            loading
          </span>
        </h2>
      </div>
    );

  const fin = JSON.stringify(data.data.discord_status, null, 2);

  let stat = "offline";
  let col = "text-gray";

  if (fin.includes("dnd")) {
    stat = "dnd";
    col = "text-red";
  } else if (fin.includes("online")) {
    stat = "online";
    col = "text-green";
  } else if (fin.includes("idle")) {
    stat = "idle";
    col = "text-yellow";
  } else if (fin.includes("offline")) {
    stat = "offline";
    col = "text-gray";
  }

  return (
    <div className={clsx(className, "flex h-32 items-center justify-center")}>
      <h2 className="flex gap-2 justify-center items-center">
        <span className={`${col} flex gap-3`}>
          <Circle />
        </span>
        {stat}
      </h2>
    </div>
  );
}
