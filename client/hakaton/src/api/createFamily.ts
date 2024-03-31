export const createFamily: (email: string) => Promise<boolean> = async (email) => {
    const res = await fetch('http://localhost:3001/create_family', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
            email,
        }),
    })

    return res.ok
}
