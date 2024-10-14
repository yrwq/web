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
        "p-2 bg-overlay border-rose/50 border shadow-md shadow-love/25 text-foreground m-10 transition-colors duration-500 ease-in-out rounded-md",
      )}
    >
      <h2 className="p-2 gap-2 text-foreground flex items-center">
        {icon}
        {title}
      </h2>
      {children}
    </div>
  );
}
