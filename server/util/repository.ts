import { prisma } from "./db";

export const getPhotoCountLeftForUser = async (userId: string, eventId: number) => {
  const evt = await prisma.event.findFirst({
    where: {
      id: eventId,
    },
    select: {
      photoLimit: true,
    }
  })
  if (!evt) {
    throw new Error("Event not found");
  }

  const photoCount = await prisma.photo.count({
    where: {
      user_id: {
        equals: userId,
      }
    }
  })

  return evt.photoLimit - photoCount;
}
