import aws from 'aws-sdk';

aws.config = new aws.Config({
  region: 'us-east-1',
  accessKeyId: process.env.AWS_ACCESSKEY,
  secretAccessKey: process.env.AWS_SECRETKEY,
});

export default aws;
