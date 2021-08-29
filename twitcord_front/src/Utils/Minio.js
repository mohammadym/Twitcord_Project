const Minio = require('minio');

const minioClient = new Minio.Client({
  endPoint: '127.0.0.1',
  port: 9000,
  useSSL: false,
  accessKey: 'minio_user',
  secretKey: 'minio_pass',
});

export default minioClient;
