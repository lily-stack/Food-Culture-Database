import { Router } from "express";
import { S3Client, PutObjectCommand } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import crypto from "crypto";

export const s3Router = Router();

const s3 = new S3Client({ region: process.env.AWS_REGION, forcePathStyle: false });
const BUCKET = process.env.S3_BUCKET_NAME!;

s3Router.get("/pictures", async (req, res) => {
	try {
		const fileType = req.query.fileType as string || "image/jpeg";
		const extension = fileType.split("/")[1] || "jpg";
		const fileName = req.query.fileName as string || "unknown";
		const safeFileName = fileName.replace(/[^a-zA-Z0-9-_]/g, "_");

		const key = `pictures/${safeFileName}_${crypto.randomUUID()}.${extension}`;

		const command = new PutObjectCommand({
			Bucket: BUCKET,
			Key: key,
			ContentType: fileType
		});

		const uploadUrl = await getSignedUrl(s3, command, { expiresIn: 60 });

		res.json({
			uploadUrl,
			fileUrl: `https://${BUCKET}.s3.${process.env.AWS_REGION}.amazonaws.com/${key}`,
		});
	} catch (err) {
		console.error("S3 presign error: ", err);
		res.status(500).json({ error: "Could not generate presigned URL" });
	}
});

s3Router.get("/recipe-images", async (req, res) => {
	try {
		const fileType = req.query.fileType as string || "image/jpeg";
        const extension = fileType.split("/")[1] || "jpg";
        const fileName = req.query.fileName as string || "unknown";
		const safeFileName = fileName.replace(/[^a-zA-Z0-9-_]/g, "_");

		const key = `recipe-images/${safeFileName}_${crypto.randomUUID()}.${extension}`;

		const command = new PutObjectCommand({
			Bucket: BUCKET,
			Key: key,
			ContentType: fileType
		});

		const uploadUrl = await getSignedUrl(s3, command, { expiresIn: 60 });

		res.json({
			uploadUrl,
			fileUrl: `https://${BUCKET}.s3.${process.env.AWS_REGION}.amazonaws.com/${key}`
		});
	} catch (err) {
		console.error("S3 presign error: ", err);
		res.status(500).json({ error: "Could not generate presigned URL" });
	}
});
