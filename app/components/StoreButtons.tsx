import Image from "next/image";
import { APP_STORE_URL } from "@/app/lib/site";

export function StoreButtons() {
  return (
    <div className="flex flex-col items-start gap-3">
      <a href={APP_STORE_URL} aria-label="Download on the App Store" className="store-link">
        <Image src="/appstore-badge.svg" alt="Download on the App Store" width={158} height={52} priority />
      </a>
      {/* Android isn't out yet — restore this note (or a Play badge) when it is.
      <p className="text-sm text-[var(--text-3)]">Android version coming soon.</p> */}
    </div>
  );
}
