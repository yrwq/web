import { cn } from '@/lib/utils'
import Image from "next/image"

function milliToMinSec(millis) {
  var minutes = Math.floor(millis / 60000);
  var seconds = ((millis % 60000) / 1000).toFixed(0);
  return minutes + ":" + (seconds < 10 ? '0' : '') + seconds;
}

export const MusicItem = ({ title, cover_url, duration, play_count, stream_url, ...rest }) => {
  return (
    <div className="flex m-2 min-w-full bg-zinc-900 rounded-md">
      <Image src={cover_url} width={80} height={20} className=""/>
      <div className="flex flex-col p-4 justify-items-start">
        <b>
          {title}
        </b>
        <span className="font-thin text-secondary-foreground">
          {milliToMinSec(duration)}
        </span>
      </div>
    </div>
  )
}
