// export const ssr = false
export const load = async ({ fetch }) => {
  try {
    const res = await fetch('/api/tsClientData')
    if (!res.ok) {
      throw new Error(`HTTP error: ${res.status}`)
    }
    const data = await res.json()
    data.map(async (el) => {
      el.time = new Date(el.time)
    })
    data.reverse()
    return { data }
  } catch (e) {
    console.error(e)
  }
}
