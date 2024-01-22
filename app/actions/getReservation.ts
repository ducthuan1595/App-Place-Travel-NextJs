import prisma from '@/app/libs/prismadb';

interface IParams {
  listingId?: string;
  userId?: string;
  authorId?: string;
}

export default async function getReservation(params: IParams) {
  try {
  const {listingId, userId, authorId} = params;
  const query: any = {};

  if(listingId) {
    query.listingId = listingId;
  }
  if(userId) {
    query.userId = userId;
  }
  if(authorId) {
    query.listing = {userId: authorId};
  }
  const reservation = await prisma.reservation.findMany({
    where: query,
    include: {
      listing: true
    },
    orderBy: {
      createdAt: 'desc'
    }
  });

  const safeReservation = reservation.map(item => ({
    ...item,
    createdAt: item.createdAt.toISOString(),
    startDate: item.startDate.toISOString(),
    endDate: item.endDate.toISOString(),
    listing: {
      ...item.listing,
      createdAt: item.listing.createdAt.toISOString(),
    }
  }))
  return safeReservation;
  }catch(err: any) {
    throw new Error(err)
  }
}