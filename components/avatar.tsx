const sizeClasses = {
  sm: "h-8 w-8 text-xs",
  md: "h-12 w-12 text-sm",
  lg: "h-20 w-20 text-xl",
} as const;

type AvatarProps = {
  src?: string | null;
  name?: string | null;
  email?: string | null;
  size?: "sm" | "md" | "lg";
};

export default function Avatar({ src, name, email, size = "md" }: AvatarProps) {
  const initials = (name?.[0] ?? email?.[0] ?? "?").toUpperCase();
  const classes = sizeClasses[size];

  if (src) {
    return (
      <img
        src={src}
        alt={name ?? email ?? "Avatar"}
        className={`${classes} rounded-full object-cover`}
      />
    );
  }

  return (
    <div
      className={`${classes} flex items-center justify-center rounded-full bg-zinc-200 font-medium text-zinc-600`}
    >
      {initials}
    </div>
  );
}
