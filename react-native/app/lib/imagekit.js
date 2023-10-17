import ImageKit from 'imagekit-javascript';
import {
  urlEndpoint,
  publicKey,
  authenticationEndpoint,
} from '../config/imagekit';

var imagekitConfigOptions = {urlEndpoint};

if (publicKey) {
  imagekitConfigOptions.publicKey = publicKey;
}
if (authenticationEndpoint) {
  imagekitConfigOptions.authenticationEndpoint = authenticationEndpoint;
}

const imagekit = new ImageKit(imagekitConfigOptions);

module.exports.getImagekitUrlFromSrc = function (imageSrc, transformationArr) {
  var ikOptions = {
    src: imageSrc,
    transformation: transformationArr,
  };
  var imageURL = imagekit.url(ikOptions);
  return decodeURIComponent(imageURL);
};

module.exports.getImagekitUrlFromPath = function (
  imagePath,
  transformationArr,
  transformationPostion,
) {
  var ikOptions = {
    urlEndpoint,
    path: imagePath,
    transformation: transformationArr,
  };
  if (transformationPostion) {
    ikOptions.transformationPostion = transformationPostion;
  }

  var imageURL = imagekit.url(ikOptions);

  return decodeURIComponent(imageURL);
};

async function fetchSecurityCredentails() {
  try {
    const response = await fetch(
      'https://8123-2401-4900-820c-a675-3c50-8ff-b04-82f9.ngrok-free.app/auth',
    );

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(
        `Request failed with status ${response.status}: ${errorText}`,
      );
    }

    const data = await response.json();
    const {signature, expire, token} = data;
    return {signature, expire, token};
  } catch (error) {
    throw new Error(`Authentication request failed: ${error.message}`);
  }
}

module.exports.uploadFile = async file => {
  console.log('🚀 ~ file: imagekit.js:72 ~ file:', {
    ...file,
    ...imagekitConfigOptions,
  });
  const securityParameters = await fetchSecurityCredentails();
  return await imagekit.upload({
    file,
    fileName: file.name, //you can change this and generate your own name if required
    tags: ['sample-tag-1', 'sample-tag-2'], //change this or remove it if you want
    token: securityParameters.token,
    signature: securityParameters.signature,
    expire: securityParameters.expire,
  });
};
