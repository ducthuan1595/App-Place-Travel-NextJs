import EmptyState from "../components/EmptyState";
import ClientOnly from "../components/ClientOnly";

import getCurrentUser from "../actions/getCurrentUser";
import getReservation from "../actions/getReservation";
import ReservationsClient from "./ReservationsClient";

const ReservationPage = async () => {
  const currentUser = await getCurrentUser();
  if(!currentUser) {
    return (
      <ClientOnly>
        <EmptyState
          title="Unauthorized"
          subtitle="Please login"
        />
      </ClientOnly>
    )
  }
  const reservations = await getReservation({
    authorId: currentUser.id
  });

  if(reservations.length === 0) {
    return (
      <ClientOnly>
        <EmptyState
          title="No reservations found"
          subtitle="Looks like you no reservations oon your props"
        />
      </ClientOnly>
    )
  }

  return (
    <ClientOnly>
      <ReservationsClient
        reservations={reservations}
        currentUser={currentUser}
      />
    </ClientOnly>
  )
}

export default ReservationPage;