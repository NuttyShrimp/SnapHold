import { prisma } from "../../util/db";

export default defineEventHandler(async (event) => {
  if (!event.context.user?.id) {
    throw createError({
      statusCode: 403,
    });
  }
  const events = await prisma.event.findMany({
    include: {
      photos: {
        take: 1,
      },
    }
  });

  return events;
});
