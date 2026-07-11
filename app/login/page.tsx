import Link from "next/link";
import { AuthForm } from "../../components/auth/AuthForm";

export default async function LoginPage({ searchParams }: { searchParams: Promise<{ error?: string }> }) {
  const params = await searchParams;
  return <main className="container space-y-6"><Link href="/">← Home</Link><AuthForm callbackError={params.error} /></main>;
}
