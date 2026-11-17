import { Footer } from "@/components/layout/Footer";
import { ForumHeader } from "@/components/sections/discussion-forum/ForumHeader";
import { getAccessToken } from "@/lib/auth/server-session";
import { loadForumSidebar } from "@/lib/forum/sidebar";

/**
 * Discussion Forum chrome: forum-only dark header, light cream content and
 * the main website footer (`SiteFrame` skips the website header here).
 */
export default async function DiscussionForumLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  const [accessToken, sidebar] = await Promise.all([
    getAccessToken(),
    loadForumSidebar(),
  ]);

  return (
    <>
      <div className="flex min-h-dvh flex-col bg-section-cream text-neutral-900">
        <ForumHeader
          isLoggedIn={Boolean(accessToken)}
          sidebarGroups={sidebar.groups}
          totalGroups={sidebar.total}
        />
        <main className="flex-1">{children}</main>
      </div>
      <Footer />
    </>
  );
}
