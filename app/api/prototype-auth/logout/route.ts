import { cookies } from "next/headers";
import { NextResponse } from "next/server";
import { PROTOTYPE_AUTH_COOKIE } from "@/lib/prototype-auth";

export async function GET(request: Request) {
  const jar = await cookies();
  jar.delete(PROTOTYPE_AUTH_COOKIE);
  return NextResponse.redirect(new URL("/prototype-login", request.url));
}
