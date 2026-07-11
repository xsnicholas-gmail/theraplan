import { redirect } from "next/navigation";

export default async function WorkoutRedirectPage({ params }: { params: Promise<{ sessionId: string }> }) {
  const { sessionId } = await params;
  redirect(`/session/${sessionId}`);
}
