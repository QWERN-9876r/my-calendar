'use client'

import { darkTheme, ligthTheme } from '@/theme'
import { ThemeProvider } from '@emotion/react'
import { AppRouterCacheProvider } from '@mui/material-nextjs/v13-appRouter'
import { SessionProvider } from 'next-auth/react'
import { type FunctionComponent, type ReactNode, createContext, useContext } from 'react'
import { LocalizationProvider } from '@mui/x-date-pickers'
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs'

export const ThemeContext = createContext('dark')

interface Props {
    children: ReactNode
}
export const Providers: FunctionComponent<Props> = ({ children }) => {
    return (
        <SessionProvider>
            <AppRouterCacheProvider options={{ key: 'css' }}>
                <ThemeContext.Provider value="light">
                    <ThemeProvider theme={darkTheme}>
                        <LocalizationProvider dateAdapter={AdapterDayjs}>{children}</LocalizationProvider>
                    </ThemeProvider>
                </ThemeContext.Provider>
            </AppRouterCacheProvider>
        </SessionProvider>
    )
}
