import { notFound } from 'next/navigation'
import { ScrollArea } from '@/components/ScrollArea'
import { PageTitle } from '@/components/PageTitle'
import { GradientBg } from '@/components/GradientBg'
import { title, description } from "@/lib/config"
import  Logo from "@/components/Logo"

export default function Home() {
  return (
    <main>
      <GradientBg />
      <div className="content">
      </div>
    </main>
  )
}
