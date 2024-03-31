import { Inter } from 'next/font/google'
import { Providers } from './components/providers/providers'
import { Footer } from './components/footer/footer'
import { getDictionary } from './app/[lang]/dictionaries'

const inter = Inter({ subsets: ['latin'] })

export async function MainLayout({
    children,
    params: { lang },
}: {
    children: React.ReactNode
    params: { lang: 'ru' | 'en' }
}) {
    const dict = await getDictionary(lang)

    return (
        <html lang={lang}>
            <head>
                <meta name="viewport" content="initial-scale=1, width=device-width" />
            </head>
            <body className={`${inter.className} dark`}>
                <Providers>
                    {children}
                    <div style={{ marginBottom: 56 }}></div>
                    <Footer dict={dict} lang={lang} />
                </Providers>
            </body>
        </html>
    )
}
