import aws from 'aws-sdk';
import multer from 'multer';
import multerS3 from 'multer-s3';
import { bucket } from '../config'; // github secret에 등록 필요!

const s3 = new aws.S3({

});

export const deleteImage = (imageUrl: string) => {
    s3.deleteObject({
        Bucket: bucket,
        Key: imageUrl
    }, (err, data) => {
        if (err) throw new Error(err.message);
        else console.log(data);
    });
}

export const upload = multer({
    storage: multerS3({
        s3: s3,
        bucket: bucket,
        metadata: function (req, file, cb) {
          cb(null, {fieldName: file.fieldname});
        },
        key: function (req, file, cb) {
          cb(null, Date.now().toString())
        }
    })
});