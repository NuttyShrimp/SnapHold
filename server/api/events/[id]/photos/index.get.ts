import { prisma } from "~/server/util/db";

export default defineEventHandler(async event => {
  if (!event.context.user?.id) {
    throw createError({
      statusCode: 403,
    });
  }
  const id = getRouterParam(event, "id");
  if (!id) {
    throw createError({
      statusCode: 400,
      statusMessage: "Event ID is required",
    })
  }
  if (!Number.isInteger(Number(id))) {
    throw createError({
      statusCode: 400,
      statusMessage: "Event ID must be a integer",
    })
  }

  const photos = await prisma.photo.findMany({
    where: {
      event_id: Number(id),
    },
    include: {
      user: true,
    },
  });

  return photos;
});
