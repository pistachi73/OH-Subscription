"use server";
import crypto from "node:crypto";

import { S3Client } from "@aws-sdk/client-s3";
import { createPresignedPost } from "@aws-sdk/s3-presigned-post";
import { z } from "zod";

import { env } from "@/env";

const s3 = new S3Client({
  apiVersion: "2006-03-01",
  region: env.AWS_REGION,
  credentials: {
    accessKeyId: env.AWS_ACCESS_KEY_ID,
    secretAccessKey: env.AWS_SECRET_ACCESS_KEY,
  },
});

const UPLOAD_MAX_FILE_SIZE = 1000000;

const CreatePresignedUrlInputSchema = z.object({
  fileName: z.string().optional(),
  maxFileSize: z.number().optional(),
});

const CreatePresignedUrlOutputSchema = z.promise(
  z.object({
    url: z.string(),
    fields: z.record(z.string()),
    fileName: z.string(),
  }),
);

export type CreatePresignedUrlOutput = z.infer<
  typeof CreatePresignedUrlOutputSchema
>;

export const createPresignedUrl = async ({
  fileName,
  maxFileSize,
}: z.infer<typeof CreatePresignedUrlInputSchema>): z.infer<
  typeof CreatePresignedUrlOutputSchema
> => {
  if (!fileName) {
    fileName = crypto.randomBytes(16).toString("hex");
  }

  const Fields = {};
  const Key = fileName;

  const presignedUrl = await createPresignedPost(s3, {
    Bucket: env.AWS_S3_BUCKET,
    Key,
    Expires: 600,
    Fields,
    Conditions: [
      ["starts-with", "$Content-Type", ""],
      ["content-length-range", 0, maxFileSize ?? UPLOAD_MAX_FILE_SIZE],
    ],
  });

  return {
    ...presignedUrl,
    fileName: fileName,
  };
};
