import Image from "next/image";
import { APP_STORE_URL } from "@/app/lib/site";

// App Store is live; Android isn't out yet — shown as a text note.
export function StoreButtons() {
  return (
    <div className="flex flex-col items-start gap-3">
      <a href={APP_STORE_URL} aria-label="Download on the App Store" className="store-link">
        <Image src="/appstore-badge.svg" alt="Download on the App Store" width={158} height={52} priority />
      </a>
      <p className="text-sm text-[var(--text-3)]">Android version coming soon.</p>
    </div>
  );
}
