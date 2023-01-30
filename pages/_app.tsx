import { Session } from "next-auth"
import { SessionProvider } from "next-auth/react"
import { AppProps } from "next/app"

interface CustomPageProps {
  session: Session
}

export default function App({
  Component,
  pageProps: { session, ...pageProps },
}: AppProps<CustomPageProps>) {
  return (
    <SessionProvider session={session}>
      <Component {...pageProps} />
    </SessionProvider>
  )
}
