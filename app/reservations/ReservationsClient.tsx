'use client';

import { useRouter } from "next/navigation";

import { SafeReservation, SafeUser } from "../types";
import Container from '../components/Container'
import Heading from "../components/Heading";
import { useCallback, useState } from "react";
import axios from "axios";
import toast from "react-hot-toast";
import ListingCard from "../components/listings/ListingCard";

interface ReservationsClientProps {
  currentUser?: SafeUser;
  reservations: SafeReservation[];
}

const ReservationsClient: React.FC<ReservationsClientProps> = ({
  reservations,
  currentUser
}) => {
  const router = useRouter();
  const [deletingId, setDeletingId] = useState('');

  const onCancel = useCallback((id: string)=> {
    setDeletingId(id);
    axios.delete(`/api/reservations/${id}`)
    .then(() => {
      toast.success("Reservation cancelled");
      router.refresh();
    })
    .catch(() => {
      toast.error('Something went wrong.')
    })
    .finally(() => {
      setDeletingId('');
    })
  }, [router])

  return (
    <Container>
      <Heading 
        title="Reservations"
        subtitle="Booking on your properties"
      />
      <div
        className="
          mt-10
          grid
          grid-cols-1
          sm:grid-cols-2
          md:grid-cols-3
          lg:grid-cols-4
          xl:grid-cols-5
          2xl:grid-cols-6
          gap-6
        "
      >
        {reservations.map(item => (
          <ListingCard
            key={item.id}
            data={item.listing}
            reservation={item}
            actionId={item.id}
            onAction={onCancel}
            disabled={deletingId === item.id}
            actionLabel="Cancel guest reservation"
            currentUser={currentUser}
          />
        ))}
      </div>
    </Container>
  )
};

export default ReservationsClient;