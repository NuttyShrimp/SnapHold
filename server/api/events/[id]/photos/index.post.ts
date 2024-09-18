import { prisma } from "~/server/util/db";
import { generateFileUUID, storePhoto } from "~/server/util/minio";
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

  const photosLeft = await getPhotoCountLeftForUser(event.context.user.id, Number(id));
  if (photosLeft <= 0) {
    return createError({ status: 400, statusMessage: "You have no photos left" })
  }

  const files = await readMultipartFormData(event);
  if (files?.length === 0) {
    return createError({ status: 400, statusMessage: "No files found" });
  }

  const file = files?.find(f => f.name === "photo");
  if (!file) {
    return createError({ status: 400, statusMessage: "No file named photo found" });
  }

  const uuid = await generateFileUUID();
  if (!uuid) {
    return createError({ status: 500, statusMessage: "Failed to generate UUID for photo" });
  }

  try {
    await storePhoto(uuid, file.data);
  } catch (e) {
    console.error(e)
    return createError({ status: 500, statusMessage: "Failed to store photo" });
  }

  await prisma.photo.create({
    data: {
      url: `https://minioserver.lecoutere.dev/pov-clone/${uuid}.jpg`,
      event_id: Number(id),
      user_id: event.context.user.id,
    }
  });
})
