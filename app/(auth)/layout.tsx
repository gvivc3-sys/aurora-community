export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="relative flex min-h-[calc(100vh-3.5rem)] items-center justify-center overflow-hidden px-4 py-12">
      <div className="hero-gradient absolute inset-0" />
      <div className="animate-float absolute -left-24 top-1/4 h-72 w-72 rounded-full bg-fuchsia-200/30 blur-[90px]" />
      <div
        className="animate-float absolute -right-24 bottom-1/4 h-72 w-72 rounded-full bg-fuchsia-200/25 blur-[90px]"
        style={{ animationDelay: "3s" }}
      />
      <div className="relative z-10 flex w-full justify-center">
        {children}
      </div>
    </div>
  );
}
