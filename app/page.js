import Link from "next/link";

export default function Home(){
  const linkStyle = {
    display: "inline-block",
    padding: "12px 16px",
    border: "1px solid #ddd",
    borderRadius: 8,
    textDecoration: "none",
    color: '#111',
    marginRight: 12,
  }

  return (
    <main style={{maxWidth: 960, margin: "0 auto", padding: 24}}>
      <h1 style={{marginBottom: 8}}>School Directory (DEMO) </h1>
      <div>
        <Link href="/addSchool" style={linkStyle}>Add School</Link>
        <Link href="/showSchools" style={linkStyle}>Show Schools</Link>
      </div>
    </main>
  )
}