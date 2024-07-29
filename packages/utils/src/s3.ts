import AWS from "aws-sdk";
require("dotenv").config();

export const uploadToS3 = (
  path: string,
  file: any,
  options: object,
  bucketName = "s3bucket"
) => {
  return new Promise(async (resolve, reject) => {
    const s3 = new AWS.S3({
      endpoint: process.env.B2_ENDPOINT,
      accessKeyId: process.env.B2_KEY_ID,
      secretAccessKey: process.env.B2_APPLICATION_KEY,
    });

    // upload data
    s3.putObject(
      {
        Bucket: process.env.B2_BUCKET_NAME!,
        Key: path,
        Body: file,
        ACL: "private",
        ...options,
      },
      (error) => {
        if (error) {
          return reject(error);
        }
        return resolve(path);
      }
    );
  });
};

export const downloadFileFromS3 = async (path: string) => {
  return new Promise(async (resolve, reject) => {
    const s3 = new AWS.S3({
      endpoint: process.env.B2_ENDPOINT,
      accessKeyId: process.env.B2_KEY_ID,
      secretAccessKey: process.env.B2_APPLICATION_KEY,
    });
    let params = {
      Bucket: process.env.B2_BUCKET_NAME!,
      Key: path,
    };
    s3.getObject(params, (err, data) => {
      if (err) {
        return reject(err);
      }
      return resolve(data);
    });
  });
};
