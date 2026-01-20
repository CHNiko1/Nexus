import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { getToken } from 'next-auth/jwt'

export async function middleware(request: NextRequest) {
  const token = await getToken({ req: request })
  const isAuth = !!token
  const isAuthPage =
    request.nextUrl.pathname.startsWith('/login') ||
    request.nextUrl.pathname.startsWith('/register')
  const isAdminPage = request.nextUrl.pathname.startsWith('/admin')

  if (isAuthPage) {
    if (isAuth) {
      return NextResponse.redirect(new URL('/', request.url))
    }
    return null
  }

  if (isAdminPage) {
    if (!isAuth) {
      return NextResponse.redirect(new URL('/login', request.url))
    }

    if (token.role !== 'ADMIN') {
      return NextResponse.redirect(new URL('/', request.url))
    }
  }

  if (request.nextUrl.pathname.startsWith('/account') && !isAuth) {
    return NextResponse.redirect(new URL('/login', request.url))
  }

  return null
}

export const config = {
  matcher: ['/admin/:path*', '/account/:path*', '/login', '/register'],
}
