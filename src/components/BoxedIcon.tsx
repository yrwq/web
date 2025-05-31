import clsx from "clsx";

export function BoxedIcon({
  children,
  className,
  noMargin = false,
  onClick,
  isActive = false,
}: {
  children: React.ReactNode;
  className?: string;
  noMargin?: boolean;
  onClick?: () => void;
  isActive?: boolean;
}) {
  return (
    <div
      className={clsx(
        "p-2 text-foreground transition-colors duration-500 ease-in-out rounded-md flex items-center justify-center text-xl",
        !noMargin && "mr-2",
        className || "w-10 h-10",
        isActive ? "bg-overlay" : "bg-surface"
      )}
      style={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
      }}
      onClick={onClick}
    >
      {children}
    </div>
  );
}
