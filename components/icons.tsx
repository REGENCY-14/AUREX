import type { SVGProps } from "react";

/**
 * Small monochrome vector icons reproduced exactly from the Figma design's
 * exported SVG assets (see public/brand/icon-*.svg for the originals).
 * `fill` is left as `currentColor` so each icon inherits its button/label's
 * text color instead of hardcoding the design's literal hex per instance.
 */

export function ArrowUpRightIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 16.6667 10" fill="none" xmlns="http://www.w3.org/2000/svg" {...props}>
      <path
        d="M1.16667 10L0 8.83333L6.16667 2.625L9.5 5.95833L13.8333 1.66667H11.6667V0H16.6667V5H15V2.83333L9.5 8.33333L6.16667 5L1.16667 10V10"
        fill="currentColor"
      />
    </svg>
  );
}

export function ArrowRightIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 12 10" fill="none" xmlns="http://www.w3.org/2000/svg" {...props}>
      <path d="M7 0L6.285 0.6965L10.075 4.5H0V5.5H10.075L6.285 9.2865L7 10L12 5L7 0Z" fill="currentColor" />
    </svg>
  );
}

export function AumIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 18 18" fill="none" xmlns="http://www.w3.org/2000/svg" {...props}>
      <path
        d="M0 18V16L2 14V18H0V18M4 18V12L6 10V10V18H4V18M8 18V10L10 12.025V18H8V18M12 18V12.025L14 10.025V18H12V18M16 18V8L18 6V18H16V18M0 12.825V10L7 3L11 7L18 0V2.825L11 9.825L7 5.825L0 12.825V12.825"
        fill="currentColor"
      />
    </svg>
  );
}

export function TrendUpIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 13.3333 13.3333" fill="none" xmlns="http://www.w3.org/2000/svg" {...props}>
      <path
        d="M5.83333 13.3333V3.1875L1.16667 7.85417L0 6.66667L6.66667 0L13.3333 6.66667L12.1667 7.85417L7.5 3.1875V13.3333H5.83333V13.3333"
        fill="currentColor"
      />
    </svg>
  );
}

/**
 * TrendDownIcon / TrendFlatIcon — not from Figma (there's no leaderboard
 * design there; this section was built from the user's own spec). Kept in
 * the same shape/viewBox family as TrendUpIcon (a plain vertical arrow)
 * rather than a diagonal one, and a simple centered bar for "held
 * position", so the three read as one consistent set on the Leaderboard
 * rank-change indicator.
 */
export function TrendDownIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 13.3333 13.3333" fill="none" xmlns="http://www.w3.org/2000/svg" {...props}>
      <path
        d="M7.5 0V10.1458L12.1667 5.47917L13.3333 6.66667L6.66667 13.3333L0 6.66667L1.16667 5.47917L5.83333 10.1458V0H7.5V0"
        fill="currentColor"
      />
    </svg>
  );
}

export function TrendFlatIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 13.3333 13.3333" fill="none" xmlns="http://www.w3.org/2000/svg" {...props}>
      <path d="M0 6.16667H13.3333V7.83333H0V6.16667V6.16667" fill="currentColor" />
    </svg>
  );
}

/**
 * "Why Aurex" feature icons — per Figma node 85:11775. Same reproduction
 * approach as the footer icons above: exact paths from the exported SVGs,
 * `currentColor` instead of the design's literal fill so each one can pick
 * up its card's muted gold treatment via a text-color/opacity class.
 */

export function ExclusivityIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 27 24" fill="none" xmlns="http://www.w3.org/2000/svg" {...props}>
      <path
        d="M3 24C2.175 24 1.46875 23.7062 0.88125 23.1187C0.29375 22.5312 0 21.825 0 21C0 20.175 0.29375 19.4688 0.88125 18.8813C1.46875 18.2938 2.175 18 3 18C3.825 18 4.53125 18.2938 5.11875 18.8813C5.70625 19.4688 6 20.175 6 21C6 21.825 5.70625 22.5312 5.11875 23.1187C4.53125 23.7062 3.825 24 3 24V24M3 15C2.175 15 1.46875 14.7062 0.88125 14.1187C0.29375 13.5312 0 12.825 0 12C0 11.175 0.29375 10.4688 0.88125 9.88125C1.46875 9.29375 2.175 9 3 9C3.825 9 4.53125 9.29375 5.11875 9.88125C5.70625 10.4688 6 11.175 6 12C6 12.825 5.70625 13.5312 5.11875 14.1187C4.53125 14.7062 3.825 15 3 15V15M3 6C2.175 6 1.46875 5.70625 0.88125 5.11875C0.29375 4.53125 0 3.825 0 3C0 2.175 0.29375 1.46875 0.88125 0.88125C1.46875 0.29375 2.175 0 3 0C3.825 0 4.53125 0.29375 5.11875 0.88125C5.70625 1.46875 6 2.175 6 3C6 3.825 5.70625 4.53125 5.11875 5.11875C4.53125 5.70625 3.825 6 3 6V6M12 6C11.175 6 10.4688 5.70625 9.88125 5.11875C9.29375 4.53125 9 3.825 9 3C9 2.175 9.29375 1.46875 9.88125 0.88125C10.4688 0.29375 11.175 0 12 0C12.825 0 13.5312 0.29375 14.1187 0.88125C14.7062 1.46875 15 2.175 15 3C15 3.825 14.7062 4.53125 14.1187 5.11875C13.5312 5.70625 12.825 6 12 6V6M21 6C20.175 6 19.4688 5.70625 18.8813 5.11875C18.2938 4.53125 18 3.825 18 3C18 2.175 18.2938 1.46875 18.8813 0.88125C19.4688 0.29375 20.175 0 21 0C21.825 0 22.5312 0.29375 23.1187 0.88125C23.7062 1.46875 24 2.175 24 3C24 3.825 23.7062 4.53125 23.1187 5.11875C22.5312 5.70625 21.825 6 21 6V6M12 15C11.175 15 10.4688 14.7062 9.88125 14.1187C9.29375 13.5312 9 12.825 9 12C9 11.175 9.29375 10.4688 9.88125 9.88125C10.4688 9.29375 11.175 9 12 9C12.825 9 13.5312 9.29375 14.1187 9.88125C14.7062 10.4688 15 11.175 15 12C15 12.825 14.7062 13.5312 14.1187 14.1187C13.5312 14.7062 12.825 15 12 15V15M13.5 24V19.3875L21.7875 11.1375C22.0125 10.9125 22.2625 10.75 22.5375 10.65C22.8125 10.55 23.0875 10.5 23.3625 10.5C23.6625 10.5 23.95 10.5562 24.225 10.6687C24.5 10.7812 24.75 10.95 24.975 11.175L26.3625 12.5625C26.5625 12.7875 26.7187 13.0375 26.8312 13.3125C26.9437 13.5875 27 13.8625 27 14.1375C27 14.4125 26.95 14.6937 26.85 14.9812C26.75 15.2687 26.5875 15.525 26.3625 15.75L18.1125 24H13.5V24M15.75 21.75H17.175L21.7125 17.175L20.325 15.7875L15.75 20.325V21.75V21.75"
        fill="currentColor"
      />
    </svg>
  );
}

export function SecurityIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 30" fill="none" xmlns="http://www.w3.org/2000/svg" {...props}>
      <path
        d="M10.425 20.325L18.9 11.85L16.7625 9.7125L10.425 16.05L7.275 12.9L5.1375 15.0375L10.425 20.325V20.325M12 30C8.525 29.125 5.65625 27.1312 3.39375 24.0187C1.13125 20.9062 0 17.45 0 13.65V4.5L12 0L24 4.5V13.65C24 17.45 22.8688 20.9062 20.6063 24.0187C18.3438 27.1312 15.475 29.125 12 30V30M12 26.85C14.6 26.025 16.75 24.375 18.45 21.9C20.15 19.425 21 16.675 21 13.65V6.5625L12 3.1875L3 6.5625V13.65C3 16.675 3.85 19.425 5.55 21.9C7.25 24.375 9.4 26.025 12 26.85V26.85"
        fill="currentColor"
      />
    </svg>
  );
}

export function TransparencyIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 33 24" fill="none" xmlns="http://www.w3.org/2000/svg" {...props}>
      <path
        d="M19.5 13.5C18.25 13.5 17.1875 13.0625 16.3125 12.1875C15.4375 11.3125 15 10.25 15 9C15 7.75 15.4375 6.6875 16.3125 5.8125C17.1875 4.9375 18.25 4.5 19.5 4.5C20.75 4.5 21.8125 4.9375 22.6875 5.8125C23.5625 6.6875 24 7.75 24 9C24 10.25 23.5625 11.3125 22.6875 12.1875C21.8125 13.0625 20.75 13.5 19.5 13.5V13.5M9 18C8.175 18 7.46875 17.7062 6.88125 17.1187C6.29375 16.5312 6 15.825 6 15V3C6 2.175 6.29375 1.46875 6.88125 0.88125C7.46875 0.29375 8.175 0 9 0H30C30.825 0 31.5313 0.29375 32.1188 0.88125C32.7063 1.46875 33 2.175 33 3V15C33 15.825 32.7063 16.5312 32.1188 17.1187C31.5313 17.7062 30.825 18 30 18H9V18M12 15H27C27 14.175 27.2938 13.4688 27.8813 12.8813C28.4688 12.2938 29.175 12 30 12V6C29.175 6 28.4688 5.70625 27.8813 5.11875C27.2938 4.53125 27 3.825 27 3H12C12 3.825 11.7062 4.53125 11.1187 5.11875C10.5312 5.70625 9.825 6 9 6V12C9.825 12 10.5312 12.2938 11.1187 12.8813C11.7062 13.4688 12 14.175 12 15V15M28.5 24H3C2.175 24 1.46875 23.7062 0.88125 23.1187C0.29375 22.5312 0 21.825 0 21V4.5H3V21V21V21H28.5V24V24M9 15V15V15V15V3V3V3V3V3V3V15V15V15V15"
        fill="currentColor"
      />
    </svg>
  );
}

export function GrowthIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 27 27" fill="none" xmlns="http://www.w3.org/2000/svg" {...props}>
      <path
        d="M0 27V24L3 21V27H0V27M6 27V18L9 15V15V27H6V27M12 27V15L15 18.0375V27H12V27M18 27V18.0375L21 15.0375V27H18V27M24 27V12L27 9V27H24V27M0 19.2375V15L10.5 4.5L16.5 10.5L27 0V4.2375L16.5 14.7375L10.5 8.7375L0 19.2375V19.2375"
        fill="currentColor"
      />
    </svg>
  );
}

/**
 * Generic document icon — not from Figma; introduced for the Investor
 * Application's ID Upload step (a document-type file's fallback preview),
 * and reused by its Review & Submit step (confirming a file is attached
 * without re-rendering the document itself) rather than each defining its
 * own copy.
 */
export function DocumentIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" {...props}>
      <path
        d="M6 2.5h8l4 4v14a1 1 0 0 1-1 1H6a1 1 0 0 1-1-1v-17a1 1 0 0 1 1-1Z"
        stroke="currentColor"
        strokeWidth="1.4"
        strokeLinejoin="round"
      />
      <path d="M14 2.5v4h4M8 13h8M8 16.5h8M8 9.5h3" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" />
    </svg>
  );
}

/** FAQ accordion chevron — per Figma node 85:11702. */
export function ChevronDownIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 12 7.4" fill="none" xmlns="http://www.w3.org/2000/svg" {...props}>
      <path d="M6 7.4L0 1.4L1.4 0L6 4.6L10.6 0L12 1.4L6 7.4V7.4" fill="currentColor" />
    </svg>
  );
}

/**
 * Footer icons — reproduced inline rather than referenced as <img> files.
 * The exported public/brand/icon-{social-1,social-2,social-3,email,phone}.svg
 * assets all carry `preserveAspectRatio="none"`, so any container that isn't
 * exactly square (e.g. a flex item getting shrunk unevenly on narrow
 * viewports) visibly stretches them. Inline components default to
 * aspect-preserving behavior, which fixes that regardless of container size.
 */

export function FacebookIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg" {...props}>
      <path
        d="M20 10C20 4.47715 15.5229 0 10 0C4.47715 0 0 4.47715 0 10C0 14.9912 3.65684 19.1283 8.4375 19.8785V12.8906H5.89844V10H8.4375V7.79688C8.4375 5.29063 9.93047 3.90625 12.2146 3.90625C13.3084 3.90625 14.4531 4.10156 14.4531 4.10156V6.5625H13.1922C11.95 6.5625 11.5625 7.3334 11.5625 8.125V10H14.3359L13.8926 12.8906H11.5625V19.8785C16.3432 19.1283 20 14.9912 20 10Z"
        fill="currentColor"
      />
    </svg>
  );
}

export function TwitterIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg" {...props}>
      <path
        d="M6.2918 18.125C13.8371 18.125 17.9652 11.8723 17.9652 6.45159C17.9652 6.27581 17.9613 6.09612 17.9535 5.92034C18.7566 5.33959 19.4496 4.62025 20 3.79612C19.2521 4.12887 18.458 4.34619 17.6449 4.44065C18.5011 3.92746 19.1421 3.12126 19.4492 2.17151C18.6438 2.64883 17.763 2.98555 16.8445 3.16721C16.2257 2.50967 15.4075 2.0743 14.5164 1.92841C13.6253 1.78252 12.711 1.93425 11.9148 2.36012C11.1186 2.78599 10.4848 3.46229 10.1115 4.28446C9.73825 5.10663 9.64619 6.02888 9.84961 6.90862C8.21874 6.82678 6.62328 6.40312 5.16665 5.66512C3.71002 4.92711 2.42474 3.89123 1.39414 2.62463C0.870333 3.52774 0.710047 4.59641 0.945859 5.61345C1.18167 6.63048 1.79589 7.51958 2.66367 8.10002C2.01219 8.07934 1.37498 7.90394 0.804688 7.58831V7.63909C0.804104 8.58683 1.13175 9.50553 1.73192 10.239C2.3321 10.9725 3.16777 11.4755 4.09687 11.6625C3.49338 11.8276 2.85999 11.8517 2.2457 11.7328C2.50788 12.5479 3.01798 13.2608 3.70481 13.772C4.39164 14.2832 5.22093 14.5672 6.07695 14.5844C4.62369 15.726 2.82848 16.3451 0.980469 16.3422C0.652739 16.3417 0.325333 16.3216 0 16.2821C1.87738 17.4865 4.06128 18.1262 6.2918 18.125Z"
        fill="currentColor"
      />
    </svg>
  );
}

export function LinkedInIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg" {...props}>
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M18.5195 0H1.47656C0.660156 0 0 0.644531 0 1.44141V18.5547C0 19.3516 0.660156 20 1.47656 20H18.5195C19.3359 20 20 19.3516 20 18.5586V1.44141C20 0.644531 19.3359 0 18.5195 0ZM5.93359 17.043H2.96484V7.49609H5.93359V17.043ZM4.44922 6.19531C3.49609 6.19531 2.72656 5.42578 2.72656 4.47656C2.72656 3.52734 3.49609 2.75781 4.44922 2.75781C5.39844 2.75781 6.16797 3.52734 6.16797 4.47656C6.16797 5.42187 5.39844 6.19531 4.44922 6.19531ZM17.043 17.043H14.0781V12.4023C14.0781 11.2969 14.0586 9.87109 12.5352 9.87109C10.9922 9.87109 10.7578 11.0781 10.7578 12.3242V17.043H7.79688V7.49609H10.6406V8.80078H10.6797C11.0742 8.05078 12.043 7.25781 13.4844 7.25781C16.4883 7.25781 17.043 9.23438 17.043 11.8047V17.043V17.043Z"
        fill="currentColor"
      />
    </svg>
  );
}

export function EmailIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg" {...props}>
      <path
        d="M1.25 7.22425V14.375C1.25 15.7557 2.36929 16.875 3.75 16.875H16.25C17.6307 16.875 18.75 15.7557 18.75 14.375V7.22425L11.3102 11.8026C10.5067 12.297 9.49327 12.297 8.68976 11.8026L1.25 7.22425Z"
        fill="currentColor"
      />
      <path
        d="M18.75 5.75652V5.625C18.75 4.24429 17.6307 3.125 16.25 3.125H3.75C2.36929 3.125 1.25 4.24429 1.25 5.625V5.75652L9.34488 10.738C9.74664 10.9852 10.2534 10.9852 10.6551 10.738L18.75 5.75652Z"
        fill="currentColor"
      />
    </svg>
  );
}

export function PhoneIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg" {...props}>
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M1.25 3.75C1.25 2.36929 2.36929 1.25 3.75 1.25H4.89302C5.61 1.25 6.23498 1.73796 6.40887 2.43354L7.33037 6.11952C7.48284 6.72942 7.25495 7.37129 6.75202 7.74849L5.674 8.557C5.56206 8.64096 5.53772 8.7639 5.56917 8.84974C6.51542 11.4329 8.5671 13.4846 11.1503 14.4308C11.2361 14.4623 11.359 14.4379 11.443 14.326L12.2515 13.248C12.6287 12.7451 13.2706 12.5172 13.8805 12.6696L17.5665 13.5911C18.262 13.765 18.75 14.39 18.75 15.107V16.25C18.75 17.6307 17.6307 18.75 16.25 18.75H14.375C7.12626 18.75 1.25 12.8737 1.25 5.625V3.75Z"
        fill="currentColor"
      />
    </svg>
  );
}
