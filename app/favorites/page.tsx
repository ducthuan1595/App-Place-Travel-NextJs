import EmptyState from "../components/EmptyState";
import ClientOnly from "../components/ClientOnly";

import getCurrentUser from "../actions/getCurrentUser";
import getFavoriteListing from "../actions/getFavoriteListing";
import FavoriteClient from "./FavoriteClient";

const FavoritePage = async () => {
  const listings = await getFavoriteListing();
  const currentUser = await getCurrentUser();

  if(listings.length === 0) {
    return (
      <ClientOnly>
        <EmptyState 
          title="No favorites found"
          subtitle="Looks like you have no favorites listing"
        />
      </ClientOnly>
    )
  }
  return (
    <ClientOnly>
      <FavoriteClient 
        listings={listings}
        currentUser={currentUser}
      />
    </ClientOnly>
  )
};

export default FavoritePage;