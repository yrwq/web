import { BoxedIcon } from "@/components/BoxedIcon";
import { Hammer, Cog } from "lucide-react";
import Image from "next/image";

export default function NotFound() {
  return (
    <div className="flex-col items-center justify-center m-auto container">
      <div className="flex items-center justify-center my-10 container ">
        <Image
          src="/construction.png"
          alt="Under Construction"
          width={100}
          height={100}
          className="rounded-xl shadow-2xl drop-shadow-2xl shadow-muted"
        />
      </div>
      <div className="flex items-center justify-center m-auto container ">
        <BoxedIcon>
          <Hammer />
        </BoxedIcon>
        <BoxedIcon>
          <Cog />
        </BoxedIcon>
        <h1 className="mx-4">Under construction</h1>
        <BoxedIcon>
          <Cog />
        </BoxedIcon>
        <BoxedIcon>
          <Hammer />
        </BoxedIcon>
      </div>
    </div>
  );
}
