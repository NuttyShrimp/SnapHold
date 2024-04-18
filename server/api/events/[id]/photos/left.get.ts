import { prisma } from "~/server/util/db"
import { getPhotoCountLeftForUser } from "~/server/util/repository";

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
  return await getPhotoCountLeftForUser(event.context.user.id, Number(id));
})
