import { Shield } from "lucide-react";

export const metadata = {
  title: "Privacy Policy — Prompture",
  description:
    "How Prompture collects, uses, and protects your data when you save and insert prompts.",
};

const updated = "2025-10-13";

export default function PrivacyPage() {
  return (
    <main className="min-h-screen bg-background">
      <div className="mx-auto max-w-3xl px-6 py-14">
        {/* Header */}
        <header className="mb-8 flex items-start gap-3">
          <span className="inline-flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10 ring-1 ring-primary/20">
            <Shield className="h-5 w-5 text-primary" aria-hidden />
          </span>
          <div>
            <h1 className="text-2xl font-semibold tracking-tight">Privacy Policy</h1>
            <p className="mt-1 text-sm text-muted-foreground">
              <span className="font-medium">Effective date:</span> {updated}
            </p>
          </div>
        </header>

        {/* Card */}
        <article className="rounded-2xl border bg-card p-6 shadow-sm md:p-8">
          <p className="text-base leading-7 text-muted-foreground">
            Prompture lets you save and quickly insert your own prompts on supported
            sites. We collect only what’s needed for this single purpose.
          </p>

          <PolicySection title="What we collect">
            <ul className="list-disc space-y-2 pl-5">
              <li>
                <span className="font-medium">Prompt text</span> you choose to save.
              </li>
              <li>
                <span className="font-medium">Account identifier</span> (userId) to
                associate your library.
              </li>
              <li>
                <span className="font-medium">Authentication token</span> used solely
                to sign in and sync.
              </li>
              <li>
                <span className="font-medium">Optional context</span>: site hostname
                (e.g., <code>chatgpt.com</code>) and timestamp to help search/filter.
              </li>
              <li>
                <span className="font-medium">Local preferences</span> (hotkey/UI)
                stored via Chrome extension storage.
              </li>
            </ul>
          </PolicySection>

          <PolicySection title="How we use data">
            <ul className="list-disc space-y-2 pl-5">
              <li>Provide core features: save, sync, search, and insert prompts.</li>
              <li>Authenticate your account and keep your library in sync.</li>
              <li>No advertising or unrelated profiling of prompt content.</li>
            </ul>
          </PolicySection>

          <PolicySection title="Storage & processing">
            <ul className="list-disc space-y-2 pl-5">
              <li>
                <span className="font-medium">Locally</span> in your browser via
                Chrome extension storage (and sync, if enabled).
              </li>
              <li>
                <span className="font-medium">Backend</span> via Supabase over HTTPS.
              </li>
            </ul>
          </PolicySection>

          <PolicySection title="Sharing">
            <p>
              We do <span className="font-semibold">not sell</span> user data. We share
              data only with service providers acting as our processors (e.g.,
              Supabase, Google for Chrome sync) to run the product. They may not use
              your data for their own purposes.
            </p>
          </PolicySection>

          <PolicySection title="Permissions & page access">
            <p>
              The extension uses <code>activeTab</code>, <code>scripting</code>, and{" "}
              <code>storage</code>. On supported sites, it accesses only the{" "}
              <em>focused input/textarea</em> to insert or save your prompt. We do not
              request <code>&lt;all_urls&gt;</code> and do not read other tabs.
            </p>
          </PolicySection>

          <PolicySection title="Remote code">
            <p>
              All executable code is packaged with the extension. We fetch{" "}
              <em>data only</em> (e.g., your prompt library) from our API. We do not
              load or execute code from remote sources.
            </p>
          </PolicySection>

          <PolicySection title="Retention & deletion">
            <ul className="list-disc space-y-2 pl-5">
              <li>Your prompts and account data are retained while your account is active.</li>
              <li>Remove local data by uninstalling the extension or clearing Extension Storage.</li>
              <li>
                To delete server-side data (account + library), email{" "}
                <a
                  href="mailto:support@prompture.org"
                  className="text-primary underline-offset-4 hover:underline"
                >
                  support@prompture.org
                </a>
                ; we’ll confirm and delete within 30 days.
              </li>
            </ul>
          </PolicySection>

          <PolicySection title="Your rights & contact">
            <p>
              You may request access, correction, export, or deletion of your data. Contact{" "}
              <a
                href="mailto:support@prompture.org"
                className="text-primary underline-offset-4 hover:underline"
              >
                support@prompture.org
              </a>
              .
            </p>
          </PolicySection>

          <PolicySection title="Changes">
            <p>
              We may update this policy and will post changes here with a new effective date.
            </p>
          </PolicySection>
        </article>
      </div>
    </main>
  );
}

/** Simple section helper for consistent spacing & headings */
function PolicySection({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <section className="mt-8">
      <h2 className="text-lg font-semibold tracking-tight">{title}</h2>
      <div className="mt-3 text-base leading-7 text-muted-foreground">{children}</div>
    </section>
  );
}
