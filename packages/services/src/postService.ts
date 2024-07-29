import { CreatePostInput, UpdatePostInput } from "schemas/src/postsSchema";
import {
  createPostModel,
  deletePostModel,
  getAllPostsModel,
  getPostByIdModel,
  updatePostModel,
} from "models/src/postsModel";
import { getUserByIdModel } from "models/src/usersModel";

export async function createPostService(
  authorId: string,
  input: CreatePostInput
) {
  try {
    if (!(await getUserByIdModel(authorId))) {
      throw { message: "Unauthorized user" };
    }
    const post = await createPostModel(authorId, input);
    return post;
  } catch (e) {
    console.log(e);
    throw { message: "Failed to create post" };
  }
}

export async function updatePostService(
  authorId: string,
  postId: string,
  input: UpdatePostInput
) {
  try {
    if (!(await getUserByIdModel(authorId))) {
      throw { message: "Unauthorized user to update this post" };
    }
    if (!(await getPostByIdModel(postId))) {
      throw { message: "Post to update not found" };
    }

    const updatedPost = await updatePostModel(authorId, postId, input);
    return updatedPost;
  } catch (e) {
    console.log(e);
    throw { message: "Failed to update post" };
  }
}

export async function deletePostService(authorId: string, postId: string) {
  try {
    if (!(await getUserByIdModel(authorId)))
      throw { message: "Unauthorized user to delete this post" };
    if (!(await getPostByIdModel(postId))) {
      throw { message: "Post to delete not found" };
    }

    const deletedPost = await deletePostModel(authorId, postId);

    return deletedPost;
  } catch (e) {
    console.log(e);
    throw { message: "Failed to delete post" };
  }
}

export async function getPostByIdService(postId: string) {
  try {
    let post = await getPostByIdModel(postId);
    return post;
  } catch (e) {
    console.log(e);
    throw { message: "Failed to get post by id" };
  }
}

export async function getPostsService() {
    try {
      const posts = await getAllPostsModel();
      return posts;
    } catch (e) {
      console.log(e);
      throw { message: "Failed to fetch posts" };
    }
  }
