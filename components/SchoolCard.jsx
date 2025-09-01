import styles from "@/styles/school-grid.module.css"

export default function SchoolCard({ name, address, city, image }) {
  const raw = typeof image === "string" ? image : ""
  const lowerHead = raw.slice(0, 40).toLowerCase()
  const allowed =
    lowerHead.startsWith("data:image/png;base64,") ||
    lowerHead.startsWith("data:image/jpeg;base64,") ||
    lowerHead.startsWith("data:image/jpg;base64,") ||
    lowerHead.startsWith("data:image/webp;base64,") ||
    lowerHead.startsWith("data:image/gif;base64,")
  const payload = raw.includes(",") ? raw.split(",")[1] : ""
  const validImage = allowed && payload.trim().length > 50

  const src = validImage ? raw : "/school-image.png"

  return (
    <article className={styles.card}>
      <div className={styles.imageWrap}>
        <img src={src || "/placeholder.svg"} alt={`${name} image`} loading="lazy" style={{width: "100%",  height: "180px", objectFit:"fill"}} />
      </div>
      <div className={styles.cardBody}>
        <h3 className={styles.cardTitle}>{name}</h3>
        <p className={styles.cardText}>{address}</p>
        <p className={styles.cardMeta}>{city}</p>
      </div>
    </article>
  )
}
