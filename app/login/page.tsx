import Link from "next/link";
import { AuthForm } from "../../components/auth/AuthForm";

export default function LoginPage() {
  return <main className="container space-y-6"><Link href="/">← Home</Link><AuthForm /></main>;
}
