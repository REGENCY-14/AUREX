import BrandMark from "@/components/BrandMark";
import { FacebookIcon, TwitterIcon, LinkedInIcon, EmailIcon, PhoneIcon } from "@/components/icons";

// "Home"/"About"/"Contact" point at real, already-built parts of the
// site (root-relative so they work from any route); "Services"/"Process"
// don't have pages built yet, so they route to the coming-soon page
// instead of the dead "#" links these used to be.
const NAV_LINKS = [
  { label: "Home", href: "/" },
  { label: "Services", href: "/coming-soon" },
  { label: "Process", href: "/coming-soon" },
  { label: "About", href: "/#about" },
  { label: "Contact", href: "/#contact" },
];

const SOCIAL_ICONS = [
  { Icon: FacebookIcon, label: "Facebook" },
  { Icon: TwitterIcon, label: "Twitter" },
  { Icon: LinkedInIcon, label: "LinkedIn" },
];

export default function Footer() {
  return (
    <footer id="contact" className="w-full border-t border-grid-line px-6 py-10 sm:px-10 md:px-20 md:py-10">
      <div className="grid grid-cols-1 items-center gap-6 md:grid-cols-[1fr_auto_1fr]">
        <div className="flex items-center gap-2">
          <BrandMark variant="footer" />
          <span className="font-jakarta text-base font-medium text-white light:text-[#1a1a1a]">Aurex</span>
        </div>

        <nav
          aria-label="Footer"
          className="flex flex-wrap items-center justify-center gap-5 font-barlow text-base text-neutral-200 light:text-[#262626] md:justify-self-center"
        >
          {NAV_LINKS.map(({ label, href }) => (
            <a key={label} href={href} className="transition-colors hover:text-gold">
              {label}
            </a>
          ))}
        </nav>

        <div className="flex w-full items-center justify-between gap-5 border border-grid-line py-2.5 pl-5 pr-2.5 md:w-fit md:justify-self-end">
          <p className="whitespace-nowrap font-barlow text-base text-neutral-200 light:text-[#262626]">Stay Connected</p>
          <div className="flex shrink-0 items-center gap-2.5">
            {SOCIAL_ICONS.map(({ Icon, label }) => (
              <a
                key={label}
                href="#"
                aria-label={label}
                className="flex size-11 shrink-0 items-center justify-center border border-[#2e2e2e] bg-gradient-to-b from-[#242424] to-[#242424]/0 light:from-white text-gold-muted transition-colors hover:border-gold/40"
              >
                <Icon className="size-5" />
              </a>
            ))}
          </div>
        </div>
      </div>

      <div className="my-8 h-px w-full bg-grid-line" />

      <div className="flex flex-col items-start gap-6 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:gap-6">
          <a
            href="mailto:hello@aurexgh.com"
            className="flex items-center gap-1.5 border-b border-grid-line pb-3 font-barlow text-base text-neutral-200 light:text-[#262626] transition-colors hover:text-gold"
          >
            <EmailIcon className="size-5 shrink-0" />
            hello@aurexgh.com
          </a>
          <a
            href="tel:0246112230"
            className="flex items-center gap-1.5 border-b border-grid-line pb-3 font-barlow text-base text-neutral-200 light:text-[#262626] transition-colors hover:text-gold"
          >
            <PhoneIcon className="size-5 shrink-0" />
            0246 11 22 30
          </a>
        </div>

        <p className="font-barlow text-sm text-neutral-500 light:text-[#98989a]">
          © 2026 Aurex Investment. All rights reserved.
        </p>
      </div>
    </footer>
  );
}
