import { SiteHeader } from "@/components/layout/site-header";
import { SiteFooter } from "@/components/layout/site-footer";

/**
 * Layout cho toàn bộ trang client (marketing, tours, auth).
 * Admin (/admin/*) dùng riêng app/admin/layout.tsx, không dùng layout này.
 */
export default function SiteLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <SiteHeader />
      <div className="grow flex flex-col">{children}</div>
      <SiteFooter />
    </>
  );
}
