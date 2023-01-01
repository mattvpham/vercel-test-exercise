import Image from 'next/image'
import Link from 'next/link'
import { Inter } from '@next/font/google'
import styles from './page.module.css'

const inter = Inter({ subsets: ['latin'] })

export default function Home() {
  return (
    <main>
      <div>A basic website</div>
      <ul>
        <li><Link href="/dashboard">Dashboard</Link></li>
      </ul>
    </main>
  )
}
