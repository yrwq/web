import clsx from "clsx";

export function BoxedIcon({
  children,
  className,
  noMargin = false,
}: {
  children: React.ReactNode;
  className?: string;
  noMargin?: boolean;
}) {
  return (
    <div
      className={clsx(
        "p-2 bg-overlay hover:bg-muted text-foreground transition-colors duration-500 ease-in-out rounded-md flex items-center justify-center text-xl",
        !noMargin && "mr-2",
        className || "w-10 h-10"
      )}
    >
      {children}
    </div>
  );
}
