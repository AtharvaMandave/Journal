import { S3Client, PutObjectCommand } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";

function getR2Client() {
  const accountId = process.env.R2_ACCOUNT_ID;
  const accessKeyId = process.env.R2_ACCESS_KEY_ID;
  const secretAccessKey = process.env.R2_SECRET_ACCESS_KEY;
  const endpoint = process.env.R2_ENDPOINT || (accountId ? `https://${accountId}.r2.cloudflarestorage.com` : undefined);
  if (!endpoint) {
    throw new Error("R2 endpoint is not configured. Set R2_ACCOUNT_ID or R2_ENDPOINT.");
  }
  return new S3Client({
    region: "auto",
    endpoint,
    forcePathStyle: true,
    credentials: accessKeyId && secretAccessKey ? { accessKeyId, secretAccessKey } : undefined,
  });
}

export async function createPresignedUploadUrl({ bucket, key, contentType }) {
  const client = getR2Client();
  const command = new PutObjectCommand({ Bucket: bucket, Key: key, ContentType: contentType });
  const url = await getSignedUrl(client, command, { expiresIn: 60 * 5 });
  return url;
}


