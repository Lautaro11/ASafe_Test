import { FastifyReply, FastifyRequest } from "fastify";

import {
  CreatePostInput,
  GetPostByIdInput,
  UpdatePostInput,
} from "schemas/src/postsSchema";
import {
  createPostService,
  updatePostService,
  getPostByIdService,
  getPostsService,
  deletePostService,
} from "services/src/postService";
import { notifyClients } from "../server";

export async function createPostHandler(
  request: FastifyRequest<{
    Body: CreatePostInput;
  }>,
  reply: FastifyReply
) {
  try {
    const { title, content } = request.body;
    const user = request.user;

    const post = await createPostService(user.id, { title, content });
    try {
      notifyClients(`New post from ${user.username}`);
    } catch (error) {
      console.log("error on create post ws");
    }
    reply.status(201).send(post);
  } catch (e) {
    console.log(e);
    return reply.code(500).send(e);
  }
}

export async function getPostByIdHandler(
  request: FastifyRequest<{
    Params: GetPostByIdInput;
  }>,
  reply: FastifyReply
) {
  const { id } = request.params;

  try {
    const post = await getPostByIdService(id);

    reply.send(post);
  } catch (e) {
    console.log(e);
    return reply.code(404).send({ error: "Post not found" });
  }
}

export async function getPostsHandler(
  request: FastifyRequest,
  reply: FastifyReply
) {
  try {
    const posts = await getPostsService();
    reply.send(posts);
  } catch (e) {
    console.log("Error during getting posts:", e);
    reply.status(500).send({ error: "Internal server error" });
  }
}

export async function updatePostHandler(
  request: FastifyRequest<{
    Params: GetPostByIdInput;
    Body: UpdatePostInput;
  }>,
  reply: FastifyReply
) {
  const user = request.user;
  const post = await getPostByIdService(request.params.id);
  const dataToUpdate = request.body;

  if (!post) {
    return reply.status(404).send({ error: "Post not found" });
  }

  if (post.authorId !== user.id) {
    return reply.status(403).send({
      error: "Forbidden: You do not have permission to update this post",
    });
  }

  try {
    let updateData: any = {};
    if (dataToUpdate.title != post.title) updateData.title = dataToUpdate.title;
    if (dataToUpdate.content != post.content)
      updateData.content = dataToUpdate.content;

    let updatedPost = {};
    if (Object.keys(updateData).length > 0) {
      updatedPost = await updatePostService(user.id, post.id, updateData);
    } else {
      updatedPost = post;
    }
    try {
      notifyClients(`${user.username} updated post`);
    } catch (error) {
      console.log("error on update post ws");
    }
    reply.send(updatedPost);
  } catch (e) {
    console.log("Error during post update:", e);
    reply.status(500).send({ error: "Internal server error" });
  }
}

export async function deletePostHandler(
  request: FastifyRequest<{
    Params: GetPostByIdInput;
  }>,
  reply: FastifyReply
) {
  const post = await getPostByIdService(request.params.id);
  const user = request.user;

  if (!post) {
    return reply.status(404).send({ error: "Post not found" });
  }

  if (post.authorId !== user.id) {
    return reply.status(403).send({
      error: "Forbidden: You do not have permission to delete this post",
    });
  }

  try {
    const deletedPost = await deletePostService(post.authorId, post.id);
    try {
      notifyClients(`${user.username} deleted post`);
    } catch (error) {
      console.log("error on create post ws");
    }
    reply.send({ message: "Post deleted successfully" });
  } catch (e) {
    console.log("Error during post deletion:", e);
    reply.status(500).send({ error: "Internal server error" });
  }
}
