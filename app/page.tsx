import Header from './ui/main/header'
import HymnSearch from './ui/main/hymn-search'

export default function Home() {
  return (
    <main className='bg-gray-50 min-h-screen'>
      <Header />
      <HymnSearch />
    </main>
  )
}
