'use client';

import { differenceInCalendarDays, eachDayOfInterval } from "date-fns";
// import { eachDayOfInterval } from 'date-fns/eachDayOfInterval';
import axios from 'axios';
import toast from 'react-hot-toast';
import { useRouter } from 'next/navigation';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { Range } from "react-date-range";

import { categories } from '@/app/components/navbar/Categories';
import { SafeListing, SafeUser } from '@/app/types';
import { Reservation } from '@prisma/client';
import ListingHead from '../ListingHead';
import ListingInfo from '../ListingInfo';
import useLoginModal from '@/app/hooks/useLoginModal';
import Container from '@/app/components/Container';
import ListingReservation from "@/app/components/listings/ListingReservation";

const initalDateRange = {
  startDate: new Date(),
  endDate: new Date(),
  key: 'selection'
};

interface ListingClientProps {
  reservations?: Reservation[];
  listing: SafeListing & {
    user: SafeUser
  };
  currentUser?: SafeUser | null;
}

const ListingClient: React.FC<ListingClientProps> = ({
  listing,
  currentUser,
  reservations = [],
}) => {
  const loginModal = useLoginModal();
  const router = useRouter();

  const disabledDates = useMemo(() => {
    let dates: Date[] = [];

    reservations.forEach((reservation: any) => {
      const range = eachDayOfInterval({
        start: new Date(reservation.startDate),
        end: new Date(reservation.endDate)
      })
      dates = [...dates, ...range];
    })
    return dates;
  }, [reservations]);

  const [isLoading, setIsLoading] = useState(false);
  const [totalPrice, setTotalPrice] = useState(listing.price);
  const [dateRange, setDateRange] = useState<Range>(initalDateRange);

  const onCreateReservation = useCallback(() => {
    if(!currentUser) return loginModal.onOpen();
    
    console.log(currentUser);
    
    setIsLoading(true);
    axios.post('/api/reservations', {
      totalPrice,
      startDate: dateRange.startDate,
      endDate: dateRange.endDate,
      listingId: listing?.id
    })
    .then(() => {      
      toast.success('Listing reserved!');
      setDateRange(initalDateRange);
      router.push('/trips');
    })
    .catch((err) => {
      console.error(err);
      
      toast.error('Something went wrong.')
    })
    .finally(() => {
      setIsLoading(false);
    })
  }, [totalPrice, dateRange, listing?.id, router, currentUser, loginModal]);

  useEffect(() => {
    if(dateRange.startDate && dateRange.endDate) {
      const dayCount = differenceInCalendarDays(
        dateRange.endDate,
        dateRange.startDate
      );

      if(dayCount && listing.price) {
        setTotalPrice(dayCount * listing.price);
      }else {
        setTotalPrice(listing.price);
      }
    }
  }, [dateRange, listing.price])

  const category = useMemo(() => {
    return categories.find(item => item.label == listing.category)
  }, [listing.category])
  
  
  return (
    <Container>
      <div className='max-w-screen-lg max-auto mt-4'>
        <div className="flex flex-col gap-6">
          <ListingHead
            title={listing.title}
            imageSrc={listing.imageSrc}
            locationValue={listing.locationValue}
            id={listing.id}
            currentUser={currentUser}
           />
          <div
            className='grid grid-cols-1 md:grid-cols-7 md:gap-10 mt-6'
          >
            <ListingInfo
              user={listing.user}
              category={category}
              description={listing.description}
              roomCount={listing.roomCount}
              guestCount={listing.guestCount}
              bathroomCount={listing.bathroomCount}
              locationValue={listing.locationValue}
            />
            <div className="order-first mb-10 md:order-last md:col-span-3">
              <ListingReservation 
                price={listing.price}
                totalPrice={totalPrice}
                onChangeDate={(value) => setDateRange(value)}
                dateRange={dateRange}
                onSubmit={onCreateReservation}
                disabled={isLoading}
                disabledDates={disabledDates}
              />
            </div>
          </div>
        </div>
      </div>
    </Container>
  );
};

export default ListingClient;