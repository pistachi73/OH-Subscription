"use server";

import { S3Client } from "@aws-sdk/client-s3";
import { createPresignedPost } from "@aws-sdk/s3-presigned-post";
import type { Conditions } from "@aws-sdk/s3-presigned-post/dist-types/types";
import crypto from "node:crypto";
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

const PresignedUrl = z.object({
  url: z.string(),
  fields: z.record(z.string()),
});

const CreatePresignedUrlOutputSchema = z.promise(
  z.object({
    presignedUrl: PresignedUrl,
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

  const Bucket = env.AWS_S3_BUCKET;
  const Conditions: Conditions[] = [
    ["starts-with", "$Content-Type", ""],
    ["content-length-range", 0, maxFileSize ?? UPLOAD_MAX_FILE_SIZE],
  ];

  const Key = fileName;

  const presignedUrl = await createPresignedPost(s3, {
    Bucket,
    Key,
    Expires: 600,
    Fields: {},
    Conditions,
  });

  return {
    presignedUrl,
    fileName: fileName,
  };
};
