"use client";

import { motion } from "framer-motion";
import { staggerItem, hoverLift } from "@/lib/motion";
import { EmailIcon, PhoneIcon, FacebookIcon, TwitterIcon, LinkedInIcon } from "@/components/icons";

// Same contact details already live in Footer.tsx — kept as the single
// source of truth rather than re-typed here, so this section can never
// drift out of sync with the footer.
const CONTACT_METHODS = [
  { Icon: EmailIcon, label: "Email", value: "hello@aurexgh.com", href: "mailto:hello@aurexgh.com" },
  { Icon: PhoneIcon, label: "Phone", value: "0246 11 22 30", href: "tel:0246112230" },
];

const SOCIAL_ICONS = [
  { Icon: FacebookIcon, label: "Facebook" },
  { Icon: TwitterIcon, label: "Twitter" },
  { Icon: LinkedInIcon, label: "LinkedIn" },
];

export default function ContactInfo() {
  return (
    <motion.div variants={staggerItem} className="flex flex-1 flex-col gap-6">
      <div className="flex flex-col gap-3">
        <h3 className="font-jakarta text-xl font-semibold text-cream sm:text-2xl">
          Contact Information
        </h3>
        <p className="font-sans text-sm leading-6 text-cream-dim sm:text-base">
          Prefer to reach us directly? Our wealth management team typically
          responds within one business day.
        </p>
      </div>

      <div className="flex flex-col gap-4">
        {CONTACT_METHODS.map(({ Icon, label, value, href }) => (
          <motion.a
            key={label}
            {...hoverLift}
            href={href}
            className="flex items-center gap-4 border border-gold/20 bg-panel/40 p-5 backdrop-blur-2xl"
          >
            <span className="flex size-11 shrink-0 items-center justify-center border border-gold/20 bg-ink-light/50 text-gold-muted light:bg-[#fdfaf2]/50">
              <Icon className="size-5" />
            </span>
            <span className="flex flex-col gap-0.5">
              <span className="font-jakarta text-xs font-medium uppercase tracking-[1.4px] text-cream-dim">
                {label}
              </span>
              <span className="font-jakarta text-base font-medium text-cream sm:text-lg">
                {value}
              </span>
            </span>
          </motion.a>
        ))}
      </div>

      <div className="flex items-center gap-4 border border-grid-line bg-ink-light/20 p-5">
        <span className="font-sans text-sm text-neutral-200 light:text-[#1a1a1a]">Follow us</span>
        <div className="flex items-center gap-2.5">
          {SOCIAL_ICONS.map(({ Icon, label }) => (
            <a
              key={label}
              href="#"
              aria-label={label}
              className="flex size-9 shrink-0 items-center justify-center border border-[#2e2e2e] bg-gradient-to-b from-[#242424] to-[#242424]/0 light:from-white text-gold-muted transition-colors hover:border-gold/40"
            >
              <Icon className="size-4" />
            </a>
          ))}
        </div>
      </div>
    </motion.div>
  );
}
