import Link from "next/link";
import { createClient } from "../../lib/supabase/server";
import { SignOutButton } from "../../components/auth/SignOutButton";

export default async function AccountPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  return <main className="container space-y-6"><Link href="/">← Home</Link><section className="card space-y-4"><p className="eyebrow">Account</p><h1>{user ? "Signed in" : "Demo mode"}</h1>{user ? <><p className="muted">{user.email}</p><SignOutButton /></> : <><p className="muted">You can use the demo app without login. Sign in when you are ready to keep plans private.</p><Link href="/login" className="primary linkbutton">Sign in or create account</Link></>}</section></main>;
}
