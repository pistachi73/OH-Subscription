import { DeleteObjectCommand, S3Client } from "@aws-sdk/client-s3";
import { z } from "zod";

import { env } from "@/env";

export const s3 = new S3Client({
  apiVersion: "2006-03-01",
  region: env.AWS_REGION,
  credentials: {
    accessKeyId: env.AWS_ACCESS_KEY_ID,
    secretAccessKey: env.AWS_SECRET_ACCESS_KEY,
  },
});

const deleteFileSchema = z.object({
  fileName: z.string(),
});

export const deleteFile = async ({
  fileName,
}: z.infer<typeof deleteFileSchema>) => {
  const Key = fileName;

  const command = new DeleteObjectCommand({
    Bucket: env.AWS_S3_BUCKET,
    Key,
  });

  try {
    await s3.send(command);
  } catch (err) {
    console.error(err);
  }

  return true;
};
