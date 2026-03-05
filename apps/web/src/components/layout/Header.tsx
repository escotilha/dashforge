"use client";

import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";

export function Header({ userEmail }: { userEmail?: string }) {
  const router = useRouter();

  async function handleSignOut() {
    const supabase = createClient();
    await supabase.auth.signOut();
    router.push("/login");
    router.refresh();
  }

  return (
    <header className="flex h-14 items-center justify-between border-b border-border px-6">
      <div />
      <div className="flex items-center gap-4">
        {userEmail && (
          <span className="text-sm text-muted-foreground">{userEmail}</span>
        )}
        <button
          onClick={handleSignOut}
          className="text-sm text-muted-foreground hover:text-foreground"
        >
          Sign out
        </button>
      </div>
    </header>
  );
}
