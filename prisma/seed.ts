import { PrismaClient } from '@prisma/client';
import dayjs from 'dayjs';
const prisma = new PrismaClient();

async function main() {
  await prisma.event.create({
    data: {
      id: 1,
      name: "Running event",
      startAt: dayjs().subtract(1, "day").toDate(),
      endAt: dayjs().add(1, "month").toDate(),
    }
  });

  await prisma.event.create({
    data: {
      id: 2,
      name: "Passed event",
      startAt: dayjs().subtract(1, "month").toDate(),
      endAt: dayjs().subtract(1, "day").toDate(),
    }
  });

  await prisma.user.create({
    data: {
      id: "jyqef0q132pi4kn",
      name: "Jan Lecoutere",
      admin: false,
      OAuthUser: {
        create: {
          oauthId: "ae708b1c-5d57-4d98-a9c6-738b7eaaeada",
          oauthProvider: "microsoft"
        }
      }
    }
  });

  await prisma.photo.create({
    data: {
      url: "https://minioserver.lecoutere.dev/pov-clone/010f5c97-2b5e-498f-a815-13608fab58ff.jpg",
      user_id: "jyqef0q132pi4kn",
      event_id: 2,
    }
  });

  await prisma.photo.create({
    data: {
      url: "https://minioserver.lecoutere.dev/pov-clone/010f5c97-2b5e-498f-a815-13608fab58ff.jpg",
      user_id: "jyqef0q132pi4kn",
      event_id: 2,
    }
  });

  await prisma.photo.create({
    data: {
      url: "https://minioserver.lecoutere.dev/pov-clone/010f5c97-2b5e-498f-a815-13608fab58ff.jpg",
      user_id: "jyqef0q132pi4kn",
      event_id: 2,
    }
  });
  await prisma.photo.create({
    data: {
      url: "https://minioserver.lecoutere.dev/pov-clone/010f5c97-2b5e-498f-a815-13608fab58ff.jpg",
      user_id: "jyqef0q132pi4kn",
      event_id: 2,
    }
  });
  await prisma.photo.create({
    data: {
      url: "https://minioserver.lecoutere.dev/pov-clone/010f5c97-2b5e-498f-a815-13608fab58ff.jpg",
      user_id: "jyqef0q132pi4kn",
      event_id: 2,
    }
  });
  await prisma.photo.create({
    data: {
      url: "https://minioserver.lecoutere.dev/pov-clone/010f5c97-2b5e-498f-a815-13608fab58ff.jpg",
      user_id: "jyqef0q132pi4kn",
      event_id: 2,
    }
  });
  await prisma.photo.create({
    data: {
      url: "https://minioserver.lecoutere.dev/pov-clone/010f5c97-2b5e-498f-a815-13608fab58ff.jpg",
      user_id: "jyqef0q132pi4kn",
      event_id: 2,
    }
  });
  await prisma.photo.create({
    data: {
      url: "https://minioserver.lecoutere.dev/pov-clone/010f5c97-2b5e-498f-a815-13608fab58ff.jpg",
      user_id: "jyqef0q132pi4kn",
      event_id: 2,
    }
  });
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });
