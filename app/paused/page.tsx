import GateForm from "@/components/gate-form";

export default function PausedPage() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-6">
      <div className="w-full max-w-md text-center">
        <h1 className="font-display text-2xl font-bold tracking-tight text-fuchsia-600">
          Aurora
        </h1>
        <p className="mx-auto mt-8 max-w-sm font-display text-2xl leading-snug tracking-tight text-warm-900 sm:text-3xl">
          We&apos;re postponing the launch, if you purchased membership you
          will be refunded! Thank you 🙏
        </p>

        <GateForm />
      </div>
    </div>
  );
}
