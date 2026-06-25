import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Privacy Policy — Aurora Circle",
};

const CONTACT_EMAIL = "hello@myaurora.io";
const SITE_NAME = "Aurora Circle";
const SITE_URL = "https://myaurora.io";

export default function PrivacyPage() {
  return (
    <div className="min-h-[calc(100vh-3.5rem)] bg-warm-50">
      <div className="mx-auto max-w-2xl px-4 py-16 sm:px-6 sm:py-24">
        <Link
          href="/"
          className="font-mono text-xs uppercase tracking-[0.3em] text-warm-400 hover:text-warm-700"
        >
          ← Aurora
        </Link>

        <h1 className="mt-8 text-3xl font-light tracking-tight text-warm-900">
          Privacy Policy
        </h1>
        <p className="mt-2 text-sm text-warm-400">Last updated: June 2025</p>

        <div className="prose prose-sm prose-zinc mt-10 max-w-none [&_h2]:mt-8 [&_h2]:text-base [&_h2]:font-medium [&_h2]:text-warm-900 [&_p]:text-warm-600 [&_p]:leading-relaxed [&_ul]:text-warm-600">

          <p>
            {SITE_NAME} (&ldquo;we&rdquo;, &ldquo;us&rdquo;, &ldquo;our&rdquo;) is committed to
            protecting your personal information. This policy explains what we collect, how we use
            it, and your rights.
          </p>

          <h2>Information we collect</h2>
          <p>When you create an account or use {SITE_NAME}, we may collect:</p>
          <ul>
            <li>Your email address and display name</li>
            <li>Profile information you choose to provide (bio, avatar, birthday)</li>
            <li>Content you post, comment on, or send within the community</li>
            <li>Payment information processed securely through Stripe (we never store card details)</li>
            <li>Your Telegram user ID if you choose to connect your account</li>
            <li>Usage data such as pages visited and features used</li>
          </ul>

          <h2>How we use your information</h2>
          <ul>
            <li>To provide and maintain your account and membership</li>
            <li>To process payments and manage your subscription</li>
            <li>To send you transactional emails (welcome, billing, membership updates)</li>
            <li>To enable community features such as posts, comments, and messaging</li>
            <li>To improve the platform and understand how it is used</li>
          </ul>

          <h2>Sharing your information</h2>
          <p>
            We do not sell your personal information. We share data only with trusted service
            providers that help us operate the platform:
          </p>
          <ul>
            <li><strong>Supabase</strong> — database and authentication</li>
            <li><strong>Stripe</strong> — payment processing</li>
            <li><strong>Resend</strong> — transactional email delivery</li>
            <li><strong>Telegram</strong> — private group access (only if you connect your account)</li>
          </ul>

          <h2>Data retention</h2>
          <p>
            We retain your data for as long as your account is active. If you close your account,
            you may request deletion of your personal information by emailing us.
          </p>

          <h2>Your rights</h2>
          <p>You have the right to:</p>
          <ul>
            <li>Access the personal information we hold about you</li>
            <li>Request correction of inaccurate data</li>
            <li>Request deletion of your account and associated data</li>
            <li>Withdraw consent at any time by canceling your membership</li>
          </ul>

          <h2>Cookies</h2>
          <p>
            We use cookies solely to maintain your login session. We do not use tracking or
            advertising cookies.
          </p>

          <h2>Security</h2>
          <p>
            All data is transmitted over HTTPS. Passwords are never stored — authentication is
            handled securely by Supabase. Payment details are handled entirely by Stripe and
            never touch our servers.
          </p>

          <h2>Contact</h2>
          <p>
            For any privacy-related questions or requests, please email us at{" "}
            <a href={`mailto:${CONTACT_EMAIL}`} className="text-warm-800 underline">
              {CONTACT_EMAIL}
            </a>
            .
          </p>
        </div>

        <div className="mt-16 border-t border-warm-200 pt-8">
          <p className="text-xs text-warm-400">
            &copy; {new Date().getFullYear()} {SITE_NAME} &middot;{" "}
            <Link href="/" className="hover:text-warm-700">
              {SITE_URL}
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
