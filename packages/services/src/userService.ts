import { CreateUserInput, LoginInput, UpdateUserInput } from "schemas/src/usersSchema";
import {
  createUserModel,
  getAllUsersModel,
  getUserByEmailModel,
  getUserByIdModel,
  getUserByUsernameModel,
  updateUserModel,
} from "models/src/usersModel";
import bcrypt from "bcrypt";

export async function createUserService(input: CreateUserInput) {
  try {
    const { password, ...rest } = input;

    if (await getUserByEmailModel(rest.email)) {
      throw { message: "User already exists" };
    }

    const hash = await bcrypt.hash(password, 10);
    const user = await createUserModel({ password: hash, ...rest });

    return user;
  } catch (e) {
    console.log(e);
    throw { message: "Failed to create user" };
  }
}

export async function updateUserService(
  id: string,
  dataToUpdate: UpdateUserInput
) {
  try {
    //TODO: Upload photo to S3 and return the url
    if (dataToUpdate.username?.length && await getUserByUsernameModel(dataToUpdate.username)) {
      throw { message: "User with this username already exists" };
    } else { delete dataToUpdate.username}

    const user = await updateUserModel(id, dataToUpdate);
    return user;
  } catch (e) {
    console.log(e);
    throw { message: "Failed to update user" };
  }
}

export async function getUserByIdService(id: string, includePosts?: boolean | undefined) {
  try {
    
    let user = await getUserByIdModel(id, includePosts);
    return user;
  } catch (e) {
    console.log(e);
    throw { message: "Failed to fetch user by id" };
  }
}

export async function getUsersService() {
  try {
    const users = await getAllUsersModel();
    return users;
  } catch (e) {
    console.log(e);
    throw { message: "Failed to fetch users" };
  }
}

export async function loginService(input: LoginInput) {
  try {
    const user = await getUserByEmailModel(input.email);
    if (!user) {
      throw { message: "Invalid email or password" };
    }
    const isPasswordValid = await bcrypt.compare(
      input.password,
      user.password
    );

    if (isPasswordValid) {
      return {
        id: user.id,
        email: user.email,
        username: user.username,
      };
    }
    return {};
  }
  catch (e) {
    console.log(e);
    throw { message: "Invalid email or password" };
  } 
}
