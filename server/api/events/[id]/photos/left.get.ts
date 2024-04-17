import { prisma } from "~/server/util/db"

export default defineEventHandler(async (event) => {
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
  const evt = await prisma.event.findFirst({
    where: {
      id: Number(id)
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
        equals: event.context.user?.id,
      }
    }
  })

  return evt.photoLimit - photoCount;
})
