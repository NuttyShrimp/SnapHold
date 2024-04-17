import { prisma } from "~/server/util/db";

export default defineEventHandler(async (event) => {
  if (!event.context.user?.id) {
    throw createError({
      statusCode: 403,
    });
  }
  const id = getRouterParam(event, "id");
  if (!id) {
    throw new Error("Event ID is required");
  }
  if (!Number.isInteger(Number(id))) {
    throw new Error("Event ID must be an integer");
  }
  const evt = await prisma.event.findFirst({
    where: {
      id: Number(id)
    }
  })
  if (!evt) {
    throw new Error("Event not found");
  }

  return evt;
})
