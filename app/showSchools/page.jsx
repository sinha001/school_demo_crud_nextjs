import SchoolCard from "@/components/SchoolCard"
import styles from "@/styles/school-grid.module.css"
import { headers } from "next/headers"

export const metadata = { title: "Schools" }

async function getSchools() {
  const h = await headers()
  const host = h.get("x-forwarded-host") || h.get("host") || "localhost:3000"
  const protoHeader = h.get("x-forwarded-proto")
  const proto = protoHeader || (host.includes("localhost") ? "http" : "https")
  const baseUrl = `${proto}://${host}`

  const res = await fetch(`${baseUrl}/api/schools`, { cache: "no-store" })
  if (!res.ok) return []
  const json = await res.json()
  return json.data || []
}

export default async function ShowSchoolsPage() {
  const schools = await getSchools()

  return (
    <main className={styles.page}>
      <header className={styles.header}>
        <h1>Schools</h1>
        <p>Browse listed schools. Add more from the Add School page.</p>
      </header>

      <section className={styles.grid}>
        {schools.length === 0 && <p>No schools found.</p>}
        {schools.map((s) => (
          <SchoolCard key={s.id} name={s.name} address={s.address} city={s.city} image={s.image} />
        ))}
      </section>
    </main>
  )
}
