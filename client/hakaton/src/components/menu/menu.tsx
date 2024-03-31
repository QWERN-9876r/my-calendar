'use client'

import { FunctionComponent, useEffect, useState } from 'react'
import Check from '@mui/icons-material/Check'
import Image from 'next/image'
import { signIn, signOut, useSession } from 'next-auth/react'
import styles from './menu.module.css'
import { getUsersInFmily } from '@/api/getUsersInFmily'
import Button from '@mui/material/Button'
import { createFamily } from '@/api/createFamily'
import { addUser } from '@/api/addUser'
import { getUser } from '@/api/getUser'
import { TextField, ListItemIcon, ListItemText, Divider, MenuList, MenuItem, Paper } from '@mui/material'
import { addUserInFamily } from '@/api/addUserInFamily'
import { deleteUserFromFamily } from '@/api/deleteUserFromFamily'

export const Menu: FunctionComponent = () => {
    const session = useSession()
    const [family, setFamily] = useState([] as string[])
    const [userHasBeenAdded, setUserHasBeenAdded] = useState(false)
    const [addedEmail, setAddedEmail] = useState('')
    const [usersInFamliyShowDeleted, setUsersInFamliyShowDeleted] = useState(new Array(family.length).fill(false))
    const [usersId, setUsersId] = useState([] as string[])

    const userAuth = !!session.data?.user?.name

    async function getFamily() {
        const res = await getUsersInFmily(session.data?.user?.email as string)
        if ('error' in res) {
            console.error(res.error)
            return
        }
        setFamily(
            await Promise.all(
                res.map(async (id) => {
                    const user = await getUser(id)
                    return user.name
                }),
            ),
        )
        setUsersId(res)
        setUsersInFamliyShowDeleted(new Array(family.length).fill(false))
    }
    async function addInFamily() {
        const ok = await addUserInFamily(session.data?.user?.email as string, addedEmail)
        if (!ok) return
        getFamily()
        setAddedEmail('')
    }
    async function deleteUser(id: string) {
        const ok = await deleteUserFromFamily(id)
        if (ok) getFamily()
    }

    useEffect(() => {
        ;(async () => {
            if (!userAuth) return
            if (!family.length) {
                getFamily()
            }
            if (!userHasBeenAdded) {
                addUser({
                    email: session.data?.user?.email as string,
                    name: session.data?.user?.name as string,
                    theme: 'dark',
                })
                setUserHasBeenAdded(true)
            }
        })()
    }, [session.data?.user?.email, userHasBeenAdded])

    async function createFamilyListener() {
        await createFamily(session.data?.user?.email as string)
        await getFamily()
    }

    return (
        <Paper sx={{ width: 350, position: 'fixed', right: 30, top: 75, zIndex: 2, animation: 'showMenu 0.9s' }}>
            <MenuList dense>
                {userAuth && (
                    <>
                        <MenuItem>
                            <ListItemText>{session?.data?.user?.name}</ListItemText>
                        </MenuItem>
                        <MenuItem>Выбрать тему</MenuItem>
                        <Divider />
                        <MenuItem>
                            <ListItemIcon>
                                <Check />
                            </ListItemIcon>
                            Темная
                        </MenuItem>
                        <MenuItem>
                            <ListItemText inset>Светлая</ListItemText>
                        </MenuItem>
                        <Divider />
                        {family.length ? (
                            <>
                                <MenuItem>
                                    <ListItemText>Семья</ListItemText>
                                </MenuItem>
                                <Divider />
                                {family.map((name, i) => (
                                    <MenuItem sx={{ width: '100%' }}>
                                        <ListItemText key={name}>
                                            <div
                                                style={{
                                                    display: 'flex',
                                                    justifyContent: 'space-between',
                                                    alignItems: 'center',
                                                    height: 50,
                                                }}
                                                onMouseOver={() => {
                                                    setUsersInFamliyShowDeleted(() => {
                                                        return new Array(family.length).fill(false).map((_, index) => {
                                                            return index === i
                                                        })
                                                    })
                                                }}
                                                onMouseOut={() => {
                                                    setUsersInFamliyShowDeleted(new Array(family.length).fill(false))
                                                }}
                                            >
                                                {name}
                                                {usersInFamliyShowDeleted[i] && (
                                                    <Button
                                                        className={styles.deleteUserFromFamily}
                                                        variant="text"
                                                        color="error"
                                                        onClick={() => deleteUser(usersId[i])}
                                                    >
                                                        Удалить
                                                    </Button>
                                                )}
                                            </div>
                                        </ListItemText>
                                    </MenuItem>
                                ))}
                                <Divider />
                                <MenuItem>
                                    <TextField
                                        variant="standard"
                                        label="Email"
                                        type="email"
                                        onChange={(evt) => setAddedEmail(evt.target.value)}
                                    />
                                    <Button variant="text" color="primary" onClick={addInFamily}>
                                        Добавить в семью
                                    </Button>
                                </MenuItem>
                            </>
                        ) : (
                            <Button
                                variant="text"
                                color="primary"
                                onClick={createFamilyListener}
                                style={{ marginLeft: 10 }}
                            >
                                Создать семью
                            </Button>
                        )}
                        <MenuItem>
                            <Button
                                onClick={() => signOut({ callbackUrl: '/' })}
                                type="button"
                                variant="text"
                                color="error"
                            >
                                Выйти
                            </Button>
                        </MenuItem>
                    </>
                )}

                {!userAuth && (
                    <MenuItem>
                        <ListItemText>
                            <div
                                style={{ height: 20, display: 'flex', alignItems: 'center' }}
                                onClick={async () => {
                                    const res = await signIn('google', { callbackUrl: '/' })
                                    setUserHasBeenAdded(false)
                                }}
                            >
                                <Image
                                    src="https://authjs.dev/img/providers/google.svg"
                                    height={20}
                                    width={20}
                                    alt="google"
                                />
                                <div style={{ marginLeft: 15 }}>Войти</div>
                            </div>
                        </ListItemText>
                    </MenuItem>
                )}
            </MenuList>
        </Paper>
    )
}
