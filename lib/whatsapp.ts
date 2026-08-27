/**
 * Stubbed WhatsApp hand-offs to Admin — used wherever this platform's
 * confirmed flow is "no in-platform action, just open a WhatsApp chat with
 * Admin": the Investor Dashboard's "Invest" action, and the Business Owner
 * Dashboard's "request a change to my listing" note (Admin owns all edits
 * to a listing, so there's no in-dashboard edit form to route to instead).
 * Swapping in the real admin number later means changing only this file.
 */

// AUREX Admin's WhatsApp contact number (+233 20 565 5675). E.164 digits
// only, no "+" or spaces, matching wa.me's own expected format.
const ADMIN_WHATSAPP_NUMBER = "233205655675";

/** Builds a wa.me deep link pre-filled with a message identifying which
 *  slot the investor tapped "Invest" on, so Admin doesn't have to ask. */
export function getSlotWhatsAppLink(slotDescription: string): string {
  const message = `Hi AUREX, I'd like to invest in: ${slotDescription}.`;
  return `https://wa.me/${ADMIN_WHATSAPP_NUMBER}?text=${encodeURIComponent(message)}`;
}

/** Builds a wa.me deep link for a business owner asking Admin to change
 *  something about their listing, pre-filled with which business it's
 *  about. */
export function getListingChangeRequestWhatsAppLink(businessName: string): string {
  const message = `Hi AUREX, I'd like to request a change to my business listing: ${businessName}.`;
  return `https://wa.me/${ADMIN_WHATSAPP_NUMBER}?text=${encodeURIComponent(message)}`;
}
