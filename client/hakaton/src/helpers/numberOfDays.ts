export function getNumberOfDays(year: number, month: number) {
    const d = new Date(year, month, 0)

    return d.getDate()
}
