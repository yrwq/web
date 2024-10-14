import clsx from "clsx";

export function BoxedIcon({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div
      className={clsx(
        className,
        "p-2 bg-rose/20 hover:bg-rose/40 text-foreground transition-colors duration-500 ease-in-out rounded-md mr-2 w-10 h-10 flex items-center justify-center text-xl",
      )}
    >
      {children}
    </div>
  );
}
