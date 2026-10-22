/* eslint-disable @next/next/no-img-element */
import { cn } from "@/lib/utils";

/** "zarirul.islam" wordmark: dark text in light theme, white text in dark theme. */
export function Logo({ className }: { className?: string }) {
  return (
    <>
      <img src="/logo/zarirul-logo.svg" alt="Zarirul Islam" width={544} height={79} className={cn("w-auto dark:hidden", className)} />
      <img
        src="/logo/zarirul-logo-white.svg"
        alt="Zarirul Islam"
        width={544}
        height={79}
        className={cn("hidden w-auto dark:block", className)}
      />
    </>
  );
}

/** Square "z." mark. */
export function LogoMark({ className }: { className?: string }) {
  return <img src="/logo/zarirul-mark.svg" alt="" width={64} height={64} className={className} />;
}
