import createMiddleware from "next-intl/middleware";
import { routing } from "./i18n/routing";
import { type NextFetchEvent, type NextRequest, NextResponse } from "next/server";
import { createServerClient } from "@supabase/ssr";

// next-intl 的中间件运行时只读取 request，但接受并忽略第二个 event 参数；
// 这里用宽化的函数类型标注，既能把真实的 NextFetchEvent 原样透传（不做 as never 伪造），
// 又能通过 TypeScript 检查。
const intlMiddleware: (request: NextRequest, event: NextFetchEvent) => NextResponse = createMiddleware(routing);

export default async function middleware(request: NextRequest, event: NextFetchEvent) {
  const { pathname } = request.nextUrl;
  // /admin 与 /portal 不走 i18n 前缀路由，仅在此刷新 Supabase 会话 cookie
  if (pathname === "/admin" || pathname.startsWith("/admin/") || pathname === "/portal" || pathname.startsWith("/portal/")) {
    const response = NextResponse.next({ request });
    const supabase = createServerClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
      {
        cookies: {
          getAll: () => request.cookies.getAll(),
          setAll: (cookiesToSet) =>
            cookiesToSet.forEach(({ name, value, options }) => response.cookies.set(name, value, options)),
        },
      }
    );
    await supabase.auth.getUser(); // 触发 token 刷新并写回 cookie
    return response;
  }
  return intlMiddleware(request, event);
}

export const config = {
  matcher: ["/((?!api|_next|_vercel|.*\\..*).*)"],
};
