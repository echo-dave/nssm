export const ssr = false
export const load = async ({ fetch }) => {
  try {
    const res = await fetch('/api/tsClientData')
    if (!res.ok) {
      throw new Error(`HTTP error: ${res.status}`)
    }
    const metrics = await res.json()

    metrics.map(async (el) => {
      el.time = new Date(el.time)
    })
    metrics.reverse()
    return { metrics }
  } catch (e) {
    console.warn({ error: e, msg: 'Unable to fetch initial client data' })
  }
}
