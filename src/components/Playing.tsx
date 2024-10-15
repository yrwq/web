import clsx from "clsx";
import SpotifyWebApi from "spotify-web-api-node";
import Image from "next/image";

export async function Playing({ className }: { className?: string }) {
  const api = new SpotifyWebApi({
    clientId: process.env.SPOTIFY_CLIENT_ID,
    clientSecret: process.env.SPOTIFY_CLIENT_SECRET,
    redirectUri: process.env.SPOTIFY_REDIRECT,
  });

  api.setRefreshToken(process.env.SPOTIFY_REFRESH_TOKEN);

  const data = await api.refreshAccessToken();
  api.setAccessToken(data.body["access_token"]);

  const recentTracks = await api.getMyRecentlyPlayedTracks({
    limit: 50,
  });

  const track = recentTracks.body.items[0].track;
  const artist = track.artists[0].name;
  const name = track.name;
  const cover = track.album.images[0].url;

  for (var i = 0; i < 49; i++) {
    console.log(recentTracks.body.items[i].track.name);
    // more statements
  }

  console.log(name);

  return (
    <div
      className={clsx(
        className,
        "flex flex-col gap-10 p-10 items-center justify-center",
      )}
    >
      <Image
        alt="cover"
        src={cover}
        height={220}
        width={220}
        className="rounded-lg shadow-2xl shadow-muted drop-shadow-2xl"
      />
      <span className="flex flex-col">
        <h1 className="flex gap-2 justify-center items-center">{artist}</h1>
        <h2 className="flex gap-2 justify-center items-center">{name}</h2>
      </span>
    </div>
  );
}
