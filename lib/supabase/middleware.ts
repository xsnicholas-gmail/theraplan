import { NextResponse, type NextRequest } from "next/server";

export async function updateSession(request: NextRequest) {
  // v1 is intentionally demo-first with no login wall. Avoid importing the
  // Supabase SSR client in edge middleware until the lock-down sprint adds
  // authenticated routes; this keeps production builds free of edge-runtime
  // warnings from Node-only dependencies.
  return NextResponse.next({ request });
}
