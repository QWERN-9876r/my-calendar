'use client'

import { FunctionComponent, useEffect } from 'react'
import { Experimental_CssVarsProvider as CssVarsProvider, useColorScheme } from '@mui/material/styles'

export const ForTheme: FunctionComponent = () => {
    const { mode, setMode } = useColorScheme()

    useEffect(() => {
        if (mode === 'dark') document.querySelector('body')?.classList.add('dark')
        else document.querySelector('body')?.classList.remove('dark')
    }, [mode])

    return <></>
}
