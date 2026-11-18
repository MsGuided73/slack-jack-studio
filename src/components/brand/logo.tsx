import { brand } from "@/config/brand";
import { cn } from "@/ui";

/** The picture files, in `public/brand/`. Both have a clear background, cut for dark pages. */
const MARK_SRC = "/brand/mark.png";
const WORDMARK_SRC = "/brand/wordmark.png";
/** The wordmark picture is 645 wide for every 96 of height. */
const WORDMARK_RATIO = 645 / 96;

/**
 * The SlackJack mark: the steel and green "SJ" emblem. `size` is its side in pixels
 * (20 in the nav, 18 inline).
 */
export function LogoMark({ size = 20, className, title }: { size?: number; className?: string; title?: string }) {
  return (
    // A fixed-size local picture: next/image would add nothing here.
    // eslint-disable-next-line @next/next/no-img-element
    <img
      src={MARK_SRC}
      width={size}
      height={size}
      alt={title ?? ""}
      aria-hidden={title ? undefined : true}
      draggable={false}
      className={cn("shrink-0 object-contain", className)}
    />
  );
}

/** The name as its own picture, for places that show the mark and the name together. */
export function Wordmark({ height = 16, className }: { height?: number; className?: string }) {
  return (
    // eslint-disable-next-line @next/next/no-img-element
    <img
      src={WORDMARK_SRC}
      width={Math.round(height * WORDMARK_RATIO)}
      height={height}
      alt={brand.name}
      draggable={false}
      className={cn("shrink-0 object-contain", className)}
    />
  );
}

/** The mark with the wordmark beside it, for footers and dialogs. */
export function Logo({ size = 20, className }: { size?: number; className?: string }) {
  return (
    <span className={cn("inline-flex items-center gap-2", className)}>
      <LogoMark size={size} />
      <Wordmark height={Math.round(size * 0.8)} />
    </span>
  );
}

/** A model maker's badge: the first letter of the maker's name. We ship no third-party logos. */
export function VendorGlyph({ vendor, className }: { vendor: string; className?: string }) {
  return (
    <span aria-hidden className={cn("font-display text-xs leading-4 font-bold text-text-primary uppercase", className)}>
      {vendor.trim().charAt(0) || "·"}
    </span>
  );
}
