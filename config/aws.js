const AWS = require('aws-sdk')

// Initializing S3 Interface
const awsBucket = new AWS.S3({
  accessKeyId: process.env.AWS_BUCKET_ID,
  secretAccessKey: process.env.AWS_SECRET_KEY
})

const uploadFileToAwsBucket = (fileName, fileContent, bucketName) => {
  const params = {
    Bucket: bucketName,
    Key: fileName,
    Body: fileContent
  };

  // Uploading files to the bucket
  awsBucket.upload(params, function (err, data) {
    if (err) {
      throw err
    }
  });
};

const readFileFromBucket = async (bucketName, fileName) => {
  return await awsBucket.getObject({ Bucket: bucketName, Key: fileName }).promise()
}

module.exports = {
  uploadFileToAwsBucket, readFileFromBucket
}