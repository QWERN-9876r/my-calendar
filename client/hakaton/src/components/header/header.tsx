'use client'

import { FunctionComponent, useState } from 'react'
import AccountCircleIcon from '@mui/icons-material/AccountCircle'
import styles from './header.module.css'
import { Menu } from '../menu/menu'
import { useSession } from 'next-auth/react'
import Image from 'next/image'

export const Header: FunctionComponent = () => {
    const [menuIsOpen, setMenuIsOpen] = useState(false)
    const session = useSession()

    return (
        <header className="header">
            <button
                className={styles.profileIcon}
                onClick={async () => {
                    setMenuIsOpen((prev) => !prev)
                    const noft = await Notification.requestPermission()
                }}
            >
                {session.data?.user?.image ? (
                    <Image
                        style={{ borderRadius: 50 }}
                        src={session.data?.user?.image}
                        alt={session.data?.user?.name || ''}
                        height={50}
                        width={50}
                    />
                ) : (
                    <AccountCircleIcon sx={{ width: 50, height: 50 }} />
                )}
            </button>
            {menuIsOpen && <Menu />}
        </header>
    )
}
