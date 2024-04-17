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
