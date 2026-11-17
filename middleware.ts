import { type NextRequest, NextResponse } from "next/server";

const CANONICAL_HOST = "www.alloftech.site";
const CANONICAL_HOSTS = new Set(["alloftech.site", CANONICAL_HOST]);

export function middleware(request: NextRequest) {
  const forwardedHost = request.headers.get("x-forwarded-host")?.split(",")[0]?.trim();
  const host = (forwardedHost || request.headers.get("host") || request.nextUrl.host)
    .split(":")[0]
    .toLowerCase();
  const forwardedProto = request.headers.get("x-forwarded-proto")?.split(",")[0]?.trim();
  const isPublicHost = CANONICAL_HOSTS.has(host);

  if (
    isPublicHost &&
    (host !== CANONICAL_HOST || forwardedProto === "http" || request.nextUrl.protocol === "http:")
  ) {
    const canonical = request.nextUrl.clone();
    canonical.protocol = "https:";
    canonical.host = CANONICAL_HOST;
    return NextResponse.redirect(canonical, 308);
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico).*)"],
};
