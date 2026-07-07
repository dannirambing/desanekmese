import { createUploadthing, type FileRouter } from "uploadthing/next";
import { UploadThingError } from "uploadthing/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

const f = createUploadthing();

export const ourFileRouter = {
  imageUploader: f({
    image: {
      maxFileSize: "4MB",
      maxFileCount: 1,
    },
  })
    .middleware(async () => {
      const session = await getServerSession(authOptions);

      if (!session?.user) {
        throw new UploadThingError("Unauthorized");
      }

      return { adminId: session.user.id };
    })
    .onUploadComplete(async ({ file }) => {
      try {
        await prisma.mediaAsset.create({
          data: {
            url: file.ufsUrl,
            publicId: file.key,
            name: file.name,
          },
        });
      } catch (err) {
        console.error("Gagal menyimpan MediaAsset:", err);
      }
      return { url: file.ufsUrl, key: file.key };
    }),

  documentUploader: f({
    pdf: {
      maxFileSize: "16MB",
      maxFileCount: 1,
    },
  })
    .middleware(async () => {
      const session = await getServerSession(authOptions);

      if (!session?.user) {
        throw new UploadThingError("Unauthorized");
      }

      return { adminId: session.user.id };
    })
    .onUploadComplete(async ({ file }) => {
      return { url: file.ufsUrl, key: file.key };
    }),
} satisfies FileRouter;

export type OurFileRouter = typeof ourFileRouter;
