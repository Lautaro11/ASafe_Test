import { PrismaClient } from "@prisma/client";
import cuid from "cuid";
import { CreatePostInput, UpdatePostInput } from "schemas/src/postsSchema";

const prisma = new PrismaClient();

export async function createPostModel(
  authorId: string,
  input: CreatePostInput
) {
  try {
    const post = await prisma.post.create({
      data: {
        id: cuid(),
        authorId,
        ...input,
      },
    });
    return post;
  } catch (error) {
    console.log("Error on createPostModel", error);
    throw error;
  }
}

export async function updatePostModel(
  authorId: string,
  postId: string,
  input: UpdatePostInput
) {
  try {
    const post = await prisma.post.update({
      where: { id: postId },
      data: { ...input },
    });
    return post;
  } catch (error) {
    console.log("Error on updatePostModel", error);
    throw error;
  }
}

export async function getPostByIdModel(id: string) {
  try {
    const post = await prisma.post.findUnique({ where: { id } });
    return post;
  } catch (error) {
    console.log("Error on getPostByIdModel", error);
    throw error;
  }
}

export async function deletePostModel(authorId: string, postId: string) {
  try {
    const post = await prisma.post.delete({
      where: { id: postId, authorId },
    });
    return post;
  } catch (error) {
    console.log("Error on deletePostModel", error);
    throw error;
  }
}

export async function getAllPostsModel() {
  try {
    return await prisma.post.findMany();
  } catch (error) {
    console.error("Error on getAllPostsModel:", error);
    throw error;
  }
}
