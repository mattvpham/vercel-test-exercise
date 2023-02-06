"use client"
import Link from "next/link"
import * as Sentry from "@sentry/nextjs"
import LoginButton from "../components/login-btn"
import { signIn, useSession } from "next-auth/react"
import { useEffect } from "react"

export default function Home() {
  const { data: session } = useSession()

  useEffect(() => {
    if (session?.error === "RefreshAccessTokenError") {
      signIn()
    }
  }, [session])

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
            Sentry.captureMessage("Hello world")
            throw new Error("Frontend Error")
          }}
        >
          Throw Error
        </button>
      </section>
      <section>
        <LoginButton />
      </section>
    </main>
  )
}
