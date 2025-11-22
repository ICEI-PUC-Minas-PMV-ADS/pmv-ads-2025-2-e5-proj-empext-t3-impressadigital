//middleware.ts
import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { jwtVerify } from 'jose'

console.log("FRONTEND JWT_SECRET:Marcelly", JSON.stringify(process.env.JWT_SECRET));
console.log("FRONTEND JWT_SECRET:Marcelly", JSON.stringify(process.env.JWT_SECRET));
console.log("FRONTEND JWT_SECRET:Marcelly", JSON.stringify(process.env.JWT_SECRET));
console.log("FRONTEND JWT_SECRET:Marcelly", JSON.stringify(process.env.JWT_SECRET));
console.log("FRONTEND JWT_SECRET:Marcelly", JSON.stringify(process.env.JWT_SECRET));
console.log("FRONTEND JWT_SECRET:Marcelly", JSON.stringify(process.env.JWT_SECRET));
console.log("FRONTEND JWT_SECRET:Marcelly", JSON.stringify(process.env.JWT_SECRET));
console.log("FRONTEND JWT_SECRET:Marcelly", JSON.stringify(process.env.JWT_SECRET));
console.log("FRONTEND JWT_SECRET:Marcelly", JSON.stringify(process.env.JWT_SECRET));

const JWT_SECRET = process.env.JWT_SECRET
if (!JWT_SECRET) {
  throw new Error("❌ JWT_SECRET não definido no ambiente")
}
const SECRET_KEY = new TextEncoder().encode(JWT_SECRET)

export interface AuthUser {
  id: number
  email: string
  role: 'admin' | 'owner' | 'cliente' | string
  name: string
}

interface RouteConfig {
  auth: boolean
  roles: string[]
}

const protectedRoutes: Record<string, RouteConfig> = {
  '/perfil': { auth: true, roles: [] },
  '/dashboard': { auth: true, roles: ['admin', 'owner'] },
  '/dashboard/configs': { auth: true, roles: ['owner'] }
}

async function verifyToken(token: string): Promise<AuthUser | null> {
  try {
    const { payload } = await jwtVerify(token, SECRET_KEY)
    

    const user: AuthUser = {
      id: Number(payload.id) || Number(payload.userId) || Number(payload.sub) || 0,
      email: String(payload.email || ''),
      role: String(payload.role || payload.tipo || 'cliente'),
      name: String(payload.name || payload.nome || '')
    }

    if (!user.id || !user.email) {
      return null
    }

    return user
  } catch (error) {
    console.error('❌ Erro na verificação do token:', error)
    return null
  }
}

export async function middleware(request: NextRequest) {
  const tokenCookie = request.cookies.get('token')
  const token = tokenCookie?.value
  const { pathname } = request.nextUrl

  let routeConfig: RouteConfig | undefined
  
  if (pathname.startsWith('/dashboard/configs')) {
    routeConfig = protectedRoutes['/dashboard/configs']
  } else if (pathname.startsWith('/dashboard')) {
    routeConfig = protectedRoutes['/dashboard']
  } else if (pathname.startsWith('/perfil')) {
    routeConfig = protectedRoutes['/perfil']
  }

  if (routeConfig && routeConfig.auth) {
    if (!token) {
      const loginUrl = new URL('/login', request.url)
      if (pathname.startsWith('/perfil')) {
        loginUrl.searchParams.set('showModal', 'true')
      }
      return NextResponse.redirect(loginUrl)
    }

    const user = await verifyToken(token)

    if (!user) {
      const response = NextResponse.redirect(new URL('/login', request.url))
      response.cookies.delete('token')
      return response
    }


    if (routeConfig.roles.length > 0 && !routeConfig.roles.includes(user.role)) {
      
      if (user.role === 'cliente') {
        const referer = request.headers.get('referer')
        console.log(`↩️ Redirecionando cliente para: ${referer || '/'}`)
        return NextResponse.redirect(referer || new URL('/', request.url))
      }
      
      return NextResponse.redirect(new URL('/dashboard/access_denied', request.url))
    }

  } 

  return NextResponse.next()
}

export const config = {
  matcher: [
    '/perfil/:path*',
    '/dashboard/:path*',
    '/dashboard/configs/:path*'
  ]
}