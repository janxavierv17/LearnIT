import AWS from "aws-sdk";
import {nanoid} from "nanoid"

const awsConfig = {
    accessKeyId: process.env.AWS_ACCESS_ID,
    secrectAccessKey: process.env_AWS_SECRET_KEY,
    region: process.env.AWS_REGION,
    apiVersion:process.env.AWS_API_VERSION,
}

const S3 = new AWS.S3(awsConfig)

export const uploadImage = async (request, response) => {
    try {
        const { image } = request.body;
        if (!image) {
            return response.status(400).send("No image uploaded.")
        }

        // Prepare the binary version of the image.
        const base64Data = new Buffer.from(image.replace(/^data:image\/\w+:base64,/, ""), "base64")

        // Grabbing type of image which is jpeg.
        const type = image.split(";")[0].split("/")[1];
        // Image Parameters
        const params = {
            // 
            Bucket: "janedemy-bucket",
            Key: `${nanoid()}.${type}`,
            Body: base64Data,
            ACL: "public-read",
            ContentEncoding: "",
            ContentType: `image/${type}`
        }

        // Upload the image to S3.
        S3.upload(params, (error, data) => {
            if (error) {
                console.log(error);
                return response.sendStatus(400)
            } else {
                console.log("Data from uploading the image;", data)
                response.send(data)
            }
        })
    } catch (error) {
        console.log("Something went wrong with uploading the image: ",  error)
    }
    // console.log("Body of Image: ", request.body)
}


export const removeImage = async (request, response) => {
    try {
        const { image } = request.body;
        const params = {
            // 
            Bucket: "janedemy-bucket",
            Key: image.key,
        };

        // Send delete request to S3
        S3.deleteObject(params, (error, data) => {
            if (error) {
                console.log("Something went wrong at S3: ", error)
                res.sendStatus(400);
            } else {
                response.send({ok:true})
            }
        })
    } catch (error) {
        console.log("Something went wrong with removing the image: ", error)
    }
} 