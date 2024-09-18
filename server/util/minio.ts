import * as Minio from 'minio';
import { v4 } from 'uuid';

const config = useRuntimeConfig();

export const minioClient = new Minio.Client({
  endPoint: 'minioserver.lecoutere.dev',
  useSSL: true,
  port: 443,
  accessKey: config.minioAccessKey,
  secretKey: config.minioSecretKey,
});

export const generateFileUUID = async () => {
  let uuid = v4();
  let used = true;

  let timeout = 100;
  while (used && timeout-- > 0) {
    try {
      const res = await minioClient.statObject(config.minioBucket, uuid);
      uuid = v4();
    } catch (e: any) {
      if (e == 'S3Error: Not Found') {
        used = false;
        break;
      }
      uuid = v4();
    }
  }

  return uuid;
}

export const storePhoto = async (uuid: string, data: Buffer) => {
  await minioClient.putObject(config.minioBucket, `${uuid}.jpg`, data, {
    'Content-Type': 'image/jpeg',
  });
}
