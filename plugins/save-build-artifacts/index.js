var tar = require("tar-fs");
var fs = require("fs");
var AWS = require("aws-sdk");

function uploadToS3(fileName) {
  const s3 = new AWS.S3({
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  });
  const fileContent = fs.readFileSync(fileName);
  const params = {
    Bucket: process.env.AWS_BUCKET_NAME,
    Key: fileName,
    Body: fileContent,
  };
  s3.upload(params, (err, data) => {
    if (err) {
      console.error(err);
    }
    console.log(`${fileName} uploaded to ${data.Location}`);
  });
}

module.exports = {
  onSuccess: ({ constants }) => {
    const publishDir = constants.PUBLISH_DIR;
    const tarName = `${process.env.COMMIT_REF}.tar`;
    tar.pack(publishDir).pipe(fs.createWriteStream(tarName));
    uploadToS3(tarName);
  },
};
