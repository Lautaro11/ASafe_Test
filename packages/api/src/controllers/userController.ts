import { FastifyReply, FastifyRequest } from "fastify";

import {
  CreateUserInput,
  LoginInput,
  GetUserByIdParamsInput,
  GetUserByIdQueryInput,
  UpdateUserInput,
} from "schemas/src/usersSchema";
import {
  createUserService,
  updateUserService,
  loginService,
  getUserByIdService,
  getUsersService,
} from "services/src/userService";

export async function createUserHandler(
  request: FastifyRequest<{
    Body: CreateUserInput;
  }>,
  reply: FastifyReply
) {
  try {
    const { email, name, username, password } = request.body;

    const user = await createUserService({
      email,
      username,
      password,
      name,
    });
    console.log("User created successfully");

    reply.status(201).send(user);
  } catch (e) {
    console.log(e);
    return reply.code(500).send(e);
  }
}

export async function loginHandler(
  request: FastifyRequest<{
    Body: LoginInput;
  }>,
  reply: FastifyReply
) {
  const { email, password } = request.body;

  try {
    const user = await loginService({password, email});

    if (user.id) {
      const token = request.server.jwt.sign({
        id: user.id,
        email: user.email,
        username: user.username,
      });

      reply.send({ id: user.id, token });
    } else {
      reply.status(401).send({ error: "Invalid email or password" });
    }
  } catch (error) {
    console.error("Error during login:", error);
    reply.status(500).send({ error: "Internal server error" });
  }
}


export async function getUserByIdHandler(
  request: FastifyRequest<{
    Params: GetUserByIdParamsInput;
    Querystring: GetUserByIdQueryInput;
  }>,
  reply: FastifyReply
) {
  const { id } = request.params;
  const query = request.query;

  try {
    let params = {id} as any;

    if (query.includePosts === 'true') params["includePosts"] = true;
    const user = await getUserByIdService(params);

    reply.send({ user });
  } catch (e) {
    console.log(e);
    return reply.code(500).send(e);
  }
}

export async function getUsersHandler(
  request: FastifyRequest,
  reply: FastifyReply
) {
  try {
    const users = await getUsersService();
    reply.send(users);
  } catch (e) {
    console.log("Error during getting users:", e);
    reply.status(500).send({ error: "Internal server error" });
  }
}

export async function updateUserHandler(
  request: FastifyRequest<{
    Body: UpdateUserInput;
  }>,
  reply: FastifyReply
) {
  const user = request.user;
  const dataToUpdate = request.body;

  try {
    if (!user.id) {
      return reply.status(403).send({
        error: "Forbidden: You do not have permission",
      });
    }

    const updateData: any = {};
    if (dataToUpdate.username) updateData.username = dataToUpdate.username;
    if (dataToUpdate.name) updateData.name = dataToUpdate.name;
    if (dataToUpdate.description)
      updateData.password = dataToUpdate.description;
    if (dataToUpdate.profilePicture)
      updateData.description = dataToUpdate.profilePicture;

    const updatedUser = await updateUserService(user.id, dataToUpdate);

    reply.send({ message: "User updated successfully", user: updatedUser });
  } catch (e) {
    console.log("Error during user update:", e);
    reply.status(500).send({ error: "Internal server error" });
  }
}
