'use client'
import { Roboto } from 'next/font/google'
import { createTheme } from '@mui/material/styles'

const roboto = Roboto({
    weight: ['300', '400', '500', '700'],
    subsets: ['latin'],
    display: 'swap',
})

const darkTheme = createTheme({
    typography: {
        fontFamily: roboto.style.fontFamily,
    },
    palette: {
        mode: 'dark',
        // primary: {
        //     main: '#3164ff',
        // },
        //   secondary: {
        //     main: '#fe720d',
        // },
    },
})

const ligthTheme = createTheme({
    typography: {
        fontFamily: roboto.style.fontFamily,
    },
    palette: {
        mode: 'light',
        // primary: {
        //     main: '#3164ff',
        // },
        //   secondary: {
        //     main: '#fe720d',
        // },
    },
})

export { darkTheme, ligthTheme }
