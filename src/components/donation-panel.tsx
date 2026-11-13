import { useState } from "react";
import { CheckIcon, CopyIcon, MailIcon, SmartphoneIcon } from "lucide-react";
import type { Donation } from "@/lib/site";
import { cn } from "@/lib/utils";
import { mediaPath } from "@/lib/media";
import { CoverImage } from "@/components/business-image";
import { Container, Eyebrow, SectionHeading } from "@/components/shared";

function CopyRow({ label, value }: { label: string; value: string }) {
  const [copied, setCopied] = useState(false);
  const copy = async () => {
    try {
      await navigator.clipboard.writeText(value);
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    } catch {
      // Clipboard can be unavailable (e.g. insecure context); the value is still visible to copy by hand.
    }
  };
  return (
    <div className="flex items-center justify-between gap-4 border-t border-white/10 py-4 first:border-t-0 first:pt-0">
      <div className="min-w-0">
        <p className="font-mono text-[10px] tracking-[0.2em] text-white/50 uppercase">{label}</p>
        <p className="mt-1 text-base font-medium break-words sm:text-lg">{value}</p>
      </div>
      <button
        type="button"
        onClick={copy}
        aria-label={`Copy ${label.toLowerCase()}`}
        className="grid size-9 shrink-0 place-items-center rounded-full bg-white/10 transition hover:bg-white hover:text-ink"
      >
        {copied ? <CheckIcon className="size-4" /> : <CopyIcon className="size-4" />}
      </button>
    </div>
  );
}

// Flagship project and Mobile Money donation details (set `donation` on a business in src/lib/site.ts).
export function DonationPanel({ donation }: { donation: Donation }) {
  return (
    <section id="donate" className="scroll-mt-16 md:scroll-mt-32 bg-ink py-12 text-white sm:py-20">
      <Container className="grid gap-8 lg:grid-cols-2 lg:gap-12">
        <div>
          <Eyebrow>Big project</Eyebrow>
          <h2 className="mt-3 text-3xl font-light tracking-tight sm:text-4xl lg:text-5xl">{donation.project}</h2>
          <p className="mt-6 text-lg font-light text-white/80 sm:text-xl">{donation.intro}</p>
          <p className="mt-4 text-sm text-white/70 sm:text-base">{donation.appeal}</p>
          <p className="mt-6 inline-block rounded-full bg-white/10 px-4 py-2 font-mono text-xs tracking-wider">{donation.hashtag}</p>
        </div>

        <div className="h-fit rounded-3xl border border-white/15 bg-white/5 p-6 sm:p-8">
          <div className="flex items-center gap-3">
            <span className="grid size-10 place-items-center rounded-full bg-white text-ink">
              <SmartphoneIcon className="size-5" />
            </span>
            <div>
              <h3 className="font-medium">Donate with Mobile Money</h3>
              <p className="text-xs text-white/60">Every 1 Cedi counts.</p>
            </div>
          </div>
          <div className="mt-6">
            <CopyRow label="Account name" value={donation.momoAccountName} />
            <CopyRow label="MoMo number" value={donation.momoNumber} />
            <CopyRow label="Merchant ID" value={donation.merchantId} />
          </div>
          <p className="mt-2 text-xs text-white/60">
            Check that the recipient name shows <strong className="text-white">{donation.momoAccountName}</strong> before
            confirming.
          </p>
          <a
            href={`mailto:${donation.email}`}
            className="mt-6 flex items-center gap-2 border-t border-white/10 pt-4 text-sm text-white/80 transition hover:text-white"
          >
            <MailIcon className="size-4 shrink-0" />
            <span className="break-all">{donation.email}</span>
          </a>
        </div>
      </Container>
    </section>
  );
}

// "About the project" text followed by a photo gallery; renders nothing if neither is set.
export function ProjectStory({ donation, folder }: { donation: Donation; folder?: string }) {
  const { about, gallery } = donation;
  if (!about?.length && !gallery?.length) return null;
  return (
    <section className="border-t py-12 sm:py-20">
      <Container>
        {about && about.length > 0 && (
          <div className="grid gap-6 lg:grid-cols-3 lg:gap-12">
            <div>
              <Eyebrow>About the project</Eyebrow>
              <h2 className="mt-3 text-2xl font-light tracking-tight sm:text-3xl lg:text-4xl">{donation.project}</h2>
            </div>
            <div className="space-y-4 text-base text-muted-foreground sm:text-lg lg:col-span-2">
              {about.map((para) => (
                <p key={para}>{para}</p>
              ))}
            </div>
          </div>
        )}

        {gallery && gallery.length > 0 && (
          <div className={cn(about?.length && "mt-12 sm:mt-20")}>
            <SectionHeading eyebrow="Gallery" title="From the project" intro="Photos from the schools and communities we work with." />
            {/* Bento grid: the first photo is featured at double size */}
            <ul className="mt-8 grid auto-rows-[9rem] grid-cols-2 gap-3 sm:auto-rows-[12rem] sm:gap-4 lg:grid-cols-4">
              {gallery.map((item, i) => (
                <li
                  key={item.image ?? i}
                  className={cn(
                    "group relative isolate overflow-hidden rounded-2xl",
                    i === 0 && "col-span-2 row-span-2",
                  )}
                >
                  <CoverImage
                    src={item.image}
                    slot={folder && mediaPath(folder, `project-${i + 1}`)}
                    alt={item.caption ?? `${donation.project} photo ${i + 1}`}
                    overlay={item.caption ? "from-black/70 via-transparent to-transparent" : "from-transparent to-transparent"}
                    variant={i === 0 ? "center" : "compact"}
                  />
                  {item.caption && <p className="absolute inset-x-0 bottom-0 p-4 text-sm text-white">{item.caption}</p>}
                </li>
              ))}
            </ul>
          </div>
        )}
      </Container>
    </section>
  );
}
