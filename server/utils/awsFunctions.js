import aws from "aws-sdk";
// AWS S3 setup
const s3 = new aws.S3({
  region: "eu-central-1",
  accessKeyId: process.env.AWS_ACCESS_KEY,
  secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
});

export const generateUploadUrl = async () => {
  const date = new Date();
  const imageName = `${nanoid()}-${date.getTime()}.jpeg`;

  return await s3.getSignedUrlPromise("putObject", {
    Bucket: "movie-database-project",
    Key: imageName,
    Expires: 1000,
    ContentType: "image/jpeg",
  });
};

export const uploadFileToAWSfromUrl = async (fileUrl) => {
  try {
    const imageResponse = await axios.get(fileUrl, {
      responseType: "arraybuffer",
    });

    const date = new Date();
    const imageName = `${nanoid()}-${date.getTime()}.jpeg`;

    const uploadParams = {
      Bucket: "movie-database-project",
      Key: imageName,
      Body: Buffer.from(imageResponse.data, "binary"),
      ContentType: "image/jpeg",
    };

    const s3Response = await s3.upload(uploadParams).promise();

    return s3Response.Location;
  } catch (err) {
    console.error("Error uploading file: ", err);
    throw new Error("Failed to upload file to S3");
  }
};
