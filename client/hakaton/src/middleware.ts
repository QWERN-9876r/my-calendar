export { default } from 'next-auth/middleware'
import { match } from '@formatjs/intl-localematcher'
import Negotiator from 'negotiator'
import { NextRequest } from 'next/server'
import { Api } from './api/main'

export async function middleware(request: NextRequest) {
    return Response.redirect(request.nextUrl)
}

export const config = {
    matcher: [
        // '/profile',
        // Skip all internal paths (_next)
        // '/((?!_next).*)',
        // Optional: only run on root (/) URL
        // '/'
    ],
}
