import { NextResponse } from "next/server"
import { getSchools, insertSchool } from "@/lib/db"

export async function GET() {
  try {
    const items = await getSchools()
    const data = items.map((s) => {
      const raw = typeof s.image === "string" ? s.image : ""
      let image = null

      if (raw) {
        if (raw.startsWith("data:image/")) {
          const payload = raw.split(",")[1] || ""
          if (payload.trim().length > 50) {
            image = raw
          }
        } else {
          // If DB stored only base64 (legacy), add a default prefix (png) when payload looks real
          const looksBase64 = /^[A-Za-z0-9+/]+=*$/.test(raw)
          if (looksBase64 && raw.length > 50) {
            image = `data:image/png;base64,${raw}`
          }
        }
      }

      return {
        id: s.id,
        name: s.name,
        address: s.address,
        city: s.city,
        image,
      }
    })
    return NextResponse.json({ data })
  } catch (err) {
    return NextResponse.json({ error: err?.message || "Failed to fetch schools" }, { status: 500 })
  }
}

export async function POST(req) {
  try {
    const body = await req.json()
    const name = String(body.name || "").trim()
    const address = String(body.address || "").trim()
    const city = String(body.city || "").trim()
    const state = String(body.state || "").trim()
    const contact = String(body.contact || "").trim()
    const email_id = String(body.email_id || "").trim()
    const imageDataUrlRaw = String(body.imageDataUrl || "")
    const imageDataUrl = imageDataUrlRaw.replace(/\s/g, "")

    if (!name || !address || !city || !state || !contact || !email_id || !imageDataUrl) {
      return NextResponse.json({ error: "All fields are required." }, { status: 400 })
    }
    const emailOk = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email_id)
    if (!emailOk) return NextResponse.json({ error: "Invalid email format." }, { status: 400 })
    const phoneOk = /^[0-9\s+\-()]{7,15}$/.test(contact)
    if (!phoneOk) return NextResponse.json({ error: "Invalid contact format." }, { status: 400 })

    const dataUrlOk = /^data:image\/(png|jpe?g|webp|gif);base64,/i.test(imageDataUrl)
    const afterComma = imageDataUrl.split(",")[1] || ""
    if (!dataUrlOk || afterComma.trim().length < 50) {
      return NextResponse.json({ error: "Invalid or empty image data." }, { status: 400 })
    }

    await insertSchool({ name, address, city, state, contact, email_id, image: imageDataUrl })
    return NextResponse.json({ ok: true, message: "School added." })
  } catch (err) {
    return NextResponse.json({ error: err?.message || "Failed to add school" }, { status: 500 })
  }
}
