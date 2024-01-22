'use client';

import Container from "../components/Container";
import Heading from "../components/Heading";
import ListingCard from "../components/listings/ListingCard";
import { SafeListing, SafeUser } from "../types";

interface FavoriteClientProps {
  currentUser?: SafeUser | null;
  listings: SafeListing[];
}

const FavoriteClient: React.FC<FavoriteClientProps> = ({
  currentUser,
  listings
}) => {

  return (
    <Container>
      <Heading
        title="Favorites"
        subtitle="List of places you have favorites"
      />
      <div className="
        mt-10
        grid
        grid-cols-1
        sm:grid-cols-2
        md:grid-cols-3
        lg:grid-cols-4
        xl:grid-cols-5
        2xl:grid-cols-6
      ">
        {listings.map(item => (
          <ListingCard 
            key={item.id}
            data={item}
            currentUser={currentUser}
          />
        ))}
      </div>
    </Container>
  );
};

export default FavoriteClient;