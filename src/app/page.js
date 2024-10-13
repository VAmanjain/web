
import dynamic from 'next/dynamic'

const Web3LandingPage = dynamic(() => import('@/components/Web3LandingPage'), { ssr: false })

export default function Home() {
  return <Web3LandingPage/>
}