import type { AuthOptions, User } from 'next-auth'
import Credentials from 'next-auth/providers/credentials'
import GoogleProvider from 'next-auth/providers/google'
import YandexProvider from 'next-auth/providers/yandex'

export const authConfig: AuthOptions = {
    providers: [
        GoogleProvider({
            clientId: process.env.GOOGLE_CLIENT_ID!,
            clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
        }),
        YandexProvider({
            clientId: process.env.YANDEX_CLIENT_ID!,
            clientSecret: process.env.YANDEX_CLIENT_SECRET!,
        }),
        Credentials({
            credentials: {
                id: {},
                email: {},
                name: {},
                key: {},
            },
            async authorize(credentials) {
                return credentials as User
            },
        }),
    ],
    pages: {
        signIn: '/signIn',
    },
    callbacks: {
        // async jwt({ token, user, trigger, session }) {
        //     if (trigger === 'update') {
        //         return { ...token, ...session.user }
        //     }
        //     return { ...token, ...user }
        // },
        // // @ts-ignore
        // async session({ token, user, trigger, session }) {
        //     if (trigger === 'update') {
        //         return { data: { ...token, ...session.user } }
        //     }
        //     return { ...token, ...user }
        // },
    },
}
