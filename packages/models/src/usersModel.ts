import { PrismaClient } from "@prisma/client";
import cuid from "cuid";
import { CreateUserInput, UpdateUserInput } from "schemas/src/usersSchema";

const prisma = new PrismaClient();

export async function createUserModel(input: CreateUserInput) {
  try {
    const user = await prisma.user.create({
      data: {
        id: cuid(),
        ...input,
      },
    });
    return user;
  } catch (error) {
    console.log("Error on createUserModel", error);
    throw error;
  }
}

export async function getAllUsersModel() {
  try {
    return await prisma.user.findMany();
  } catch (error) {
    console.error("Error on getAllUsersModel:", error);
    throw error;
  }
}

export async function getUserByIdModel(id: string, includePosts?: boolean) {
  try {
    let query = { where: { id } } as any;
    if (includePosts) query.include = { posts: true };
    return await prisma.user.findUnique(query);
  } catch (error) {
    console.error("Error on getUserByIdModel:", error);
    throw error;
  }
}

export async function getUserByEmailModel(email: string) {
  try {
    let query = { where: { email } };
    return await prisma.user.findUnique(query);
  } catch (error) {
    console.error("Error on getUserByEmailModel:", error);
    throw error;
  }
}

export async function getUserByUsernameModel(username: string, includePosts?: boolean) {
  try {
    let query = { where: { username } } as any;
    if (includePosts) query.include = { posts: true };
    return await prisma.user.findUnique(query);
  } catch (error) {
    console.error("Error on getUserByEmailModel:", error);
    throw error;
  }
}

export async function updateUserModel(id: string, input: UpdateUserInput) {
  try {
    return await prisma.user.update({
      where: { id },
      data: { ...input },
    });
  } catch (error) {
    console.log("Error on updateUserModel", error);
    throw error;
  }
}

export async function deleteUserModel(id:string) {
  try {
    return await prisma.user.delete({
      where: { id },
    });
  } catch (error) {
    console.error("Error during user deletion:", error);
    throw error;
  }
}
