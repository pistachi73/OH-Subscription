import type { CreatePresignedUrlOutput } from "../actions/create-presigned-url";

export const uploadToS3 = async ({
  file,
  createPresignedUrl,
}: {
  file: File;
  createPresignedUrl: () => CreatePresignedUrlOutput;
}) => {
  const { presignedUrl, fileName: uploadFileName } = await createPresignedUrl();

  const data: Record<string, any> = {
    ...presignedUrl.fields,
    "Content-Type": file.type,
    file,
  };

  const formData = new FormData();
  for (const name in data) {
    formData.append(name, data[name]);
  }

  try {
    await fetch(presignedUrl.url, {
      method: "POST",
      body: formData,
    });
  } catch (err) {
    console.error(err);
  }

  return { fileName: uploadFileName };
};
