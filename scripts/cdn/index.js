import qiniu from 'qiniu';
import config from 'config';
import klawSync from 'klaw-sync';
import PATH from '../path.js';

const appName = config.get('appName');
const BucketName = config.get('qiniu.BucketName');
const AccessKey = config.get('qiniu.AccessKey');
const SecretKey = config.get('qiniu.SecretKey');
const appVersion = process.env.APP_VERSION;

qiniu.conf.ACCESS_KEY = AccessKey;
qiniu.conf.SECRET_KEY = SecretKey;

const getFiles = () => {
  const files = klawSync(PATH.PUBLIC_PATH, { nodir: true })
    .map(item => item.path)
    .filter(path => path.split('/').slice(-1)[0][0] !== '.');
  return files;
};

const uptoken = (bucket, key) => {
  const putPolicy = new qiniu.rs.PutPolicy(`${bucket}:${key}`);
  return putPolicy.token();
};

const uploadFile = (token, key, localFile) => {
  const extra = new qiniu.io.PutExtra();
  qiniu.io.putFile(token, key, localFile, extra, (err, ret) => {
    if (!err) {
      // 上传成功， 处理返回值
      console.log('Upload success!', ret.hash, ret.key);
    } else {
      // 上传失败， 处理返回代码
      console.log('Upload Error!', err);
    }
  });
}

const deployCdn = () => {
  const files = getFiles();
  for (let i = 0; i < files.length; i += 1) {
    const fullpath = files[i];
    const file = fullpath.replace(PATH.PUBLIC_PATH, '');
    const key = appVersion ? `${appName}/${appVersion}${file}` : `${appName}${file}`;
    const token = uptoken(BucketName, key);
    uploadFile(token, key, fullpath);
  }
};

deployCdn();
