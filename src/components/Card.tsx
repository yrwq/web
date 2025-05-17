import clsx from "clsx";

export function Card({
  children,
  className,
  title,
  icon,
}: {
  children: React.ReactNode;
  className?: string;
  title: string;
  icon: React.ReactNode;
}) {
  return (
    <div
      className={clsx(
        className,
        "p-2 bg-surface border-overlay border hover:border-muted shadow-md shadow-overlay text-foreground transition-all duration-500 ease-in-out rounded-md",
      )}
    >
      <h1 className="p-2 gap-2 text-foreground flex items-center">
        {icon}
        {title}
      </h1>
      {children}
    </div>
  );
}
