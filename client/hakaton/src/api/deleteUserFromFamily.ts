export const deleteUserFromFamily: (id: string) => Promise<boolean> = async (id) => {
    const res = await fetch('http://localhost:3001/delete_user_in_family', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
            id,
        }),
    })

    return res.ok
}
