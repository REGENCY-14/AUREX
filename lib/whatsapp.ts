/**
 * Stubbed WhatsApp hand-off for the Investor Dashboard's "Invest" action —
 * per the confirmed flow, there's no in-platform payment; clicking Invest
 * on an open slot opens a WhatsApp chat with Admin instead, who handles
 * the rest of that conversation manually. Swapping in the real admin
 * number later means changing only this file.
 */

// Placeholder — not a real AUREX number yet. E.164 digits only, no "+" or
// spaces, matching wa.me's own expected format.
const ADMIN_WHATSAPP_NUMBER = "233000000000";

/** Builds a wa.me deep link pre-filled with a message identifying which
 *  slot the investor tapped "Invest" on, so Admin doesn't have to ask. */
export function getSlotWhatsAppLink(slotDescription: string): string {
  const message = `Hi AUREX, I'd like to invest in: ${slotDescription}.`;
  return `https://wa.me/${ADMIN_WHATSAPP_NUMBER}?text=${encodeURIComponent(message)}`;
}
