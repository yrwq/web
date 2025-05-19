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
        "p-2 bg-overlay hover:bg-muted text-foreground transition-colors duration-500 ease-in-out rounded-md mr-2 w-10 h-10 flex items-center justify-center text-xl",
      )}
    >
      {children}
    </div>
  );
}
