"use server";

import { removeTranslation } from "@/mongodb/models/Users";
import { auth } from "@clerk/nextjs/server";
import { revalidateTag } from "next/cache";

async function deleteTranslation(id: string): Promise<void> {
  auth().protect();

  const { userId } =await auth();

  // Perform deletion without needing to return any data
  await removeTranslation(userId!, id);

  // Revalidate cache after deletion
  revalidateTag("translationHistory");
}

export default deleteTranslation;
