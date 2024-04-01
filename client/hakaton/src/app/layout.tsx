import { Providers } from '@/components/providers'
import { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './global.css'
import { Header } from '@/components/header/header'
import { ForTheme } from '@/components/forTheme'

const inter = Inter({ subsets: ['latin'] })
export const metadata: Metadata = {
    title: 'Главная - Мой календарь',
    description: 'Мой календарь',
}

export default async function MainLayout({ children }: { children: React.ReactNode; params: { lang: 'ru' | 'en' } }) {
    return (
        <html lang="ru">
            <head>
                <meta name="viewport" content="initial-scale=1, width=device-width" />
                <link rel="icon" href="/favicon.ico" sizes="any" />
            </head>
            <body className={inter.className}>
                <Providers>
                    <ForTheme />
                    <Header />
                    {children}
                </Providers>
            </body>
        </html>
    )
}
