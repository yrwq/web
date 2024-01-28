import { ScrollArea } from '@/components/ScrollArea'
import { PageTitle } from '@/components/PageTitle'
import { BookmarkList } from '@/components/BookmarkList'
import { getCollection, getRaindrops, getCollections } from '@/lib/raindrop'

export async function generateStaticParams() {
  const collections = await getCollections()
  return collections.map((collection) => ({ slug: collection.slug }))
}

async function fetchData(slug) {
  const collections = await getCollections()
  const currentCollection = collections.find((collection) => collection.slug === slug)

  const collection = await getCollection(currentCollection._id)
  const raindrops = await getRaindrops(currentCollection._id)

  return {
    collection: collection.item,
    raindrops
  }
}

export default async function CollectionPage({ params }) {
  const { slug } = params
  const { collection, raindrops } = await fetchData(slug)

  return (
    <ScrollArea className="flex flex-col" hasScrollTitle>
      <div className="content-wrapper">
        <div className="content @container">
          <PageTitle title={collection.title} subtitle=""/>
          <BookmarkList id={collection._id} initialData={raindrops} />
        </div>
      </div>
    </ScrollArea>
  )
}

export async function generateMetadata({ params }) {
  const { slug } = params
  const collections = await getCollections()
  const collection = collections.find((collection) => collection.slug === slug)
  if (!collection) return null

  const siteUrl = `/bookmarks/${collection.slug}`
  const seoTitle = `${collection.title} | Bookmarks`
  const seoDescription = `A curated selection of various handpicked ${collection.title.toLowerCase()} bookmarks by Onur Şuyalçınkaya`

  return {
    title: seoTitle,
    description: seoDescription,
    openGraph: {
      title: seoTitle,
      description: seoDescription,
      url: siteUrl
    },
    alternates: {
      canonical: siteUrl
    }
  }
}
