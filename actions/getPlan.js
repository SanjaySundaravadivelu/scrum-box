"use server";

import { db } from "@/lib/prisma";
import { auth } from "@clerk/nextjs/server";

/** 🔍 Helper function to validate user plan */
export async function getUser() {
  const { userId } = auth();
  if (auth().userId) {
    try {
      const user = await db.user.findUnique({
        where: { clerkUserId: userId },
      });
      return user;
    } catch (error) {
      console.log(error);
    }
  }

  return null;
}
