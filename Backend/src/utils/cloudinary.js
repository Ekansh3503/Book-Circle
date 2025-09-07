import { v2 as cloudinary } from 'cloudinary';
import streamifier from 'streamifier';

cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_SECRET_KEY
})

const uploadFile = async(filePath, folderPath, id) => {
    try {
        const result = await cloudinary.uploader.upload(filePath, {
            folder: folderPath,
            public_id: id + "_" + Date.now(),
        });
        console.log(result);
        return result;
    } catch (error) {
        console.log("upload error: ", error.message);
        
    }
}

const uploadBuffer = (buffer, folder, publicId) => {
    return new Promise((resolve, reject) => {
      const stream = cloudinary.uploader.upload_stream(
        {
          folder,
          public_id: publicId,
        },
        (error, result) => {
          if (result) resolve(result);
          else reject(error);
        }
      );
  
      streamifier.createReadStream(buffer).pipe(stream);
    });
  };

 export default { cloudinary , uploadFile, uploadBuffer};