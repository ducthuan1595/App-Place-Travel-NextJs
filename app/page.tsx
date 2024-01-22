import Image from 'next/image'
import ClientOnly from './components/ClientOnly'
import Container from './components/Container'
import EmptyState from './components/EmptyState';
import getListings, { IListingsParam } from './actions/getListings';
import ListingCard from './components/listings/ListingCard';
import getCurrentUser from './actions/getCurrentUser';

interface HomeProps {
  searchParams: IListingsParam;
}

export default async function Home(props: HomeProps) {
  const listings = await getListings(props.searchParams);
  const currentUser = await getCurrentUser();

  if(listings.length === 0) {
    return (
      <ClientOnly>
        <EmptyState showReset />
      </ClientOnly>
    )
  }
 
  return (
   <ClientOnly>
      <Container>
        <div className='pt-[8rem] grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 2xl:grid-cols-6 gap-8'>
          {listings.map((item:any) => {
            return (
              <ListingCard currentUser={currentUser} key={item.id} data={item} />
            )
          })}
        </div>
      </Container>
   </ClientOnly>
  )
}
