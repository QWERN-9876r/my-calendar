'use client'

import { darkTheme, ligthTheme } from '@/theme'
import { ThemeProvider } from '@emotion/react'
import { AppRouterCacheProvider } from '@mui/material-nextjs/v13-appRouter'
import { SessionProvider } from 'next-auth/react'
import { type FunctionComponent, type ReactNode, createContext, useContext } from 'react'
import { LocalizationProvider } from '@mui/x-date-pickers'
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs'
import {
    experimental_extendTheme as extendTheme,
    Experimental_CssVarsProvider as CssVarsProvider,
} from '@mui/material/styles'

export const ThemeContext = createContext('dark')
// export const ligthThemeContext = createContext('ligth')

const theme = extendTheme({
    cssVarPrefix: 'md-demo',
})

interface Props {
    children: ReactNode
}
export const Providers: FunctionComponent<Props> = ({ children }) => {
    return (
        <SessionProvider>
            <AppRouterCacheProvider options={{ key: 'css' }}>
                <ThemeContext.Provider value="light">
                    <ThemeProvider theme={ligthTheme}>
                        <CssVarsProvider theme={theme}>
                            <LocalizationProvider dateAdapter={AdapterDayjs}>{children}</LocalizationProvider>
                        </CssVarsProvider>
                    </ThemeProvider>
                </ThemeContext.Provider>
            </AppRouterCacheProvider>
        </SessionProvider>
    )
}
