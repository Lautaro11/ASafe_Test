import {
  CreateUserInput,
  LoginInput,
  UpdateUserInput,
} from "schemas/src/usersSchema";
import {
  createUserModel,
  getAllUsersModel,
  getUserByEmailModel,
  getUserByIdModel,
  getUserByUsernameModel,
  updateUserModel,
} from "models/src/usersModel";
import { downloadFileFromS3, uploadToS3 } from "utils/src/s3";
import { getMimeTypeFromBase64 } from "utils/src/utils";
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
    if (!(await getUserByIdModel(id))) {
      throw { message: "Unauthorized user to update" };
    }
    //TODO: Upload photo to S3 and return the url

    let updatedData = {} as any;
    updatedData = { ...dataToUpdate };
    if (dataToUpdate.profilePicture) {
      const mimeType =
        (await getMimeTypeFromBase64(dataToUpdate.profilePicture)) ||
        "image/jpeg";
      let path = `users/${id}/profilePhoto`;
      const options = {
        ContentEncoding: "base64",
        ContentType: mimeType,
      };

      const s3Path = await uploadToS3(path, dataToUpdate.profilePicture, options);

      updatedData.profilePicture = s3Path;
    }

    if (
      dataToUpdate.username?.length &&
      (await getUserByUsernameModel(dataToUpdate.username))
    ) {
      throw { message: "User with this username already exists" };
    } else {
      delete updatedData.username;
    }

    const user = await updateUserModel(id, updatedData);
    return user;
  } catch (e) {
    console.log(e);
    throw { message: "Failed to update user" };
  }
}

export async function getUserByIdService(
  id: string,
  includePosts?: boolean | undefined
) {
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
    const isPasswordValid = await bcrypt.compare(input.password, user.password);

    if (isPasswordValid) {
      return {
        id: user.id,
        email: user.email,
        username: user.username,
      };
    }
    return {};
  } catch (e) {
    console.log(e);
    throw { message: "Invalid email or password" };
  }
}

export async function getUserPictureService(userId: string) {
  try {
   const user = await getUserByIdModel(userId);

   if (!user?.profilePicture) {
    throw { message: "User dont have profilePicture" };
   }

   let profilePictureData = await downloadFileFromS3(user.profilePicture);

   return profilePictureData;

  } catch (error) {
    console.log(error);
    throw { message: "Failed to getUserPicture from s3" };
  }
}