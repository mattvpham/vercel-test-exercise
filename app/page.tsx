"use client"
import Link from "next/link"

export default function Home() {
  return (
    <main>
      <div>A basic website</div>

      <section>
        <ul>
          <li>
            <Link href="/dashboard">Dashboard</Link>
          </li>
        </ul>
      </section>

      <section>
        <button
          type="button"
          onClick={() => {
            throw new Error("Frontend Error")
          }}
        >
          Throw Error
        </button>
      </section>
    </main>
  )
}
