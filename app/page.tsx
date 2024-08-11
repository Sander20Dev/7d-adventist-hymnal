import Header from './ui/main/header'
import HymnsCatalog from './ui/main/hymn-catalog'
import HymnSearchProvider from './ui/main/hymn-search'
import SearchBar from './ui/main/search-bar'

export default function Home() {
  return (
    <main className='bg-gray-50 min-h-screen'>
      <Header />
      <HymnSearchProvider>
        <SearchBar />
        <HymnsCatalog />
      </HymnSearchProvider>
    </main>
  )
}
