"use server";
import { getImageUrl } from "@/lib/utils";
import fs from "node:fs/promises";
import path from "node:path";
import sharp from "sharp";

const bufferToBase64 = (buffer: Buffer) => {
  return `data:image/jpg;base64,${buffer.toString("base64")}`;
};

const getStaticImagePlaceholder = async (src: string) => {
  const realFilepath = path.join(process.cwd(), "public", src);
  const buffer = await fs.readFile(realFilepath);
  const image = await sharp(buffer).resize(20).toBuffer();
  const base64 = bufferToBase64(image);

  return {
    src,
    placeholder: base64,
  };
};

const getDynamicImagePlaceholder = async (src: string) => {
  const srcPath = getImageUrl(src);
  const buffer = await fetch(srcPath).then(async (res) =>
    Buffer.from(await res.arrayBuffer()),
  );

  const image = await sharp(buffer).resize(100, 100).toBuffer();
  const base64 = bufferToBase64(image);

  return {
    src: srcPath,
    placeholder: base64,
  };
};

const getPlaceholderImage = async (
  src?: string | null,
  placeholderImageSrc?: string,
) => {
  if (!src) {
    if (!placeholderImageSrc) return null;

    return await getStaticImagePlaceholder(placeholderImageSrc);
  }

  return await getDynamicImagePlaceholder(src);
};

type ArrayInput<K extends string, T extends { [x in K]: string | null }> = {
  obj: T[];
  key: K;
  placeholderImageSrc?: string;
};

type ObjectInput<K extends string, T extends { [x in K]: string | null }> = {
  obj: T;
  key: K;
  placeholderImageSrc?: string;
};

type ReturnType<T, K extends string> = Omit<T, K> & {
  [x in K]: {
    src: string;
    placeholder: string;
  } | null;
};

// Function overloads for different input types
async function getObjWithPlaceholderImage<
  K extends string,
  T extends { [x in K]: string | null },
>(input: ArrayInput<K, T>): Promise<ReturnType<T, K>[]>;

async function getObjWithPlaceholderImage<
  K extends string,
  T extends { [x in K]: string | null },
>(input: ObjectInput<K, T>): Promise<ReturnType<T, K>>;

async function getObjWithPlaceholderImage<
  K extends string,
  T extends { [x in K]: string | null },
>({
  obj,
  key,
  placeholderImageSrc,
}: {
  obj: T | T[];
  key: K;
  placeholderImageSrc?: string;
}): Promise<ReturnType<T, K>[] | ReturnType<T, K>> {
  if (Array.isArray(obj)) {
    return await Promise.all(
      obj.map(async (obj) => {
        const src = obj[key];
        const placeholder = await getPlaceholderImage(src, placeholderImageSrc);
        return {
          ...obj,
          [key]: placeholder,
        };
      }),
    );
  }
  const src = obj[key];
  const placeholder = await getPlaceholderImage(src, placeholderImageSrc);

  return {
    ...obj,
    [key]: placeholder,
  };
}

export default getObjWithPlaceholderImage;
