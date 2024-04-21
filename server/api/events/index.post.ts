import { z } from "zod";
import { prisma } from "~/server/util/db";

const newEventSchema = z.object({
  name: z.string(),
  startAt: z.string().datetime(),
  endAt: z.string().datetime(),
  photoLimit: z.number(),
})

export default defineEventHandler(async (event) => {
  if (!event.context.user?.id) {
    throw createError({
      statusCode: 403,
    });
  }
  if (!event.context.user.admin) {
    throw createError({
      statusCode: 401,
    });
  }

  const result = await readValidatedBody(event, b => newEventSchema.safeParse(b));
  if (!result.success) {
    throw createError({
      statusCode: 400,
      statusMessage: "Invalid body",
    });
  }
  const body = result.data;

  await prisma.event.create({
    data: {
      name: body.name,
      startAt: new Date(body.startAt),
      endAt: new Date(body.endAt),
      photoLimit: body.photoLimit,
    }
  })
});
