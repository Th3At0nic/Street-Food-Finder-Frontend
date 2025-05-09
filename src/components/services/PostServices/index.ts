"use server";

import config from "@/config";
import { IResponse, TPostCategory } from "@/types";
import { authOptions } from "@/utils/authOptions";
import { getServerSession } from "next-auth";

export async function createOrUpdatePostCategory(postCategory: TPostCategory) {
  const session = await getServerSession(authOptions);

  console.log({ plan: postCategory });
  const payload: Partial<TPostCategory> = { name: postCategory.name };
  try {
    let postCategoryApiUrl = `${config.backend_url}/post-categories`;
    let method = "POST";
    if (postCategory.catId) {
      postCategoryApiUrl = `${config.backend_url}/post-categories/${postCategory.catId}`;
      method = "PATCH";
      payload["catId"] = postCategory.catId;
    }
    const response = await fetch(`${postCategoryApiUrl}`, {
      method,
      headers: {
        Authorization: `Bearer ${session?.user.accessToken}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify(payload)
    });
    const result: IResponse<TPostCategory> = await response.json();
    console.log({ result });
    return result;
  } catch (error: unknown) {
    throw error;
  }
}

export async function deletePostCategory(postCategoryId: string) {
  const session = await getServerSession(authOptions);
  try {
    const url = `${config.backend_url}/post-categories/${postCategoryId}`;

    const response = await fetch(url, {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${session?.user.accessToken}`,
        "Content-Type": "application/json"
      }
    });
    const result: IResponse<null> = await response.json();
    console.log({ result });
    return result;
  } catch (error: unknown) {
    throw error;
  }
}
