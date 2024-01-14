import prisma from '@/app/libs/prismadb';

interface IParmas {
  listingId?: string;
}

export default async function getListingById(
  params: IParmas
) {
  try {
    const {listingId} = params;
    const listing = await prisma.listing.findUnique({
      where: {
        id: listingId
      },
      include: {
        user: true
      }
    });
    if(!listing) return true;
    return {
      ...listing,
      createdAt: listing.createdAt.toISOString(),
      user: {
        ...listing.user,
        createdAt: listing.user.createdAt.toISOString(),
        updatedAt: listing.user.updatedAt.toISOString(),
        emailVerified: listing.user.emailVerified?.toISOString() || null
      }
    };
  } catch(err: any) {
    throw new Error(err)
  }
}