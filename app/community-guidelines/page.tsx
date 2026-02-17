import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { acceptTerms } from "@/lib/actions/terms";

export default async function CommunityGuidelinesPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  return (
    <div className="min-h-[calc(100vh-3.5rem)] bg-warm-50">
      <div className="mx-auto max-w-2xl px-4 py-16 sm:px-6 sm:py-24">
        <div className="text-center">
          <p className="font-mono text-xs uppercase tracking-[0.3em] text-warm-500">
            Welcome
          </p>
          <h1 className="mt-4 text-3xl font-light tracking-tight text-warm-900 sm:text-4xl">
            Community <span className="font-medium">Guidelines</span>
          </h1>
          <p className="mx-auto mt-4 max-w-md text-warm-600">
            Before you enter, please review and accept our community guidelines.
            These help us maintain a safe and supportive space for everyone.
          </p>
        </div>

        <div className="mx-auto mt-12 max-w-sm rounded-2xl border border-warm-200 bg-white p-8 shadow-sm">
          <ul className="space-y-4">
            {[
              {
                title: "Be truthful about who you are",
                description:
                  "Use your real identity. Authenticity builds trust within our community.",
              },
              {
                title: "Be positive and constructive",
                description:
                  "Lift others up. Share feedback with kindness and good intentions.",
              },
              {
                title: "Respect other members\u2019 privacy",
                description:
                  "What\u2019s shared in the community stays in the community. Never share others\u2019 personal information.",
              },
              {
                title: "Violations may result in removal",
                description:
                  "We reserve the right to remove any member who does not uphold these values.",
              },
            ].map((guideline) => (
              <li key={guideline.title} className="flex items-start gap-3">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                  className="mt-0.5 h-4 w-4 shrink-0 text-warm-700"
                >
                  <path
                    fillRule="evenodd"
                    d="M16.704 4.153a.75.75 0 0 1 .143 1.052l-8 10.5a.75.75 0 0 1-1.127.075l-4.5-4.5a.75.75 0 0 1 1.06-1.06l3.894 3.893 7.48-9.817a.75.75 0 0 1 1.05-.143Z"
                    clipRule="evenodd"
                  />
                </svg>
                <div>
                  <p className="text-sm font-medium text-warm-900">
                    {guideline.title}
                  </p>
                  <p className="mt-0.5 text-sm text-warm-600">
                    {guideline.description}
                  </p>
                </div>
              </li>
            ))}
          </ul>

          <form action={acceptTerms} className="mt-8">
            <button
              type="submit"
              className="w-full rounded-full bg-gradient-to-r from-warm-800 to-warm-900 px-4 py-3 text-sm font-medium text-warm-50 shadow-md transition-all hover:from-warm-700 hover:to-warm-800 hover:shadow-lg active:scale-[0.98]"
            >
              I Agree &amp; Enter
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
