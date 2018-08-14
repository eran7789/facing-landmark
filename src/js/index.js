import MobileDetect from 'mobile-detect';

import 'css/index.css';

import ImageHandler from 'js/image-handler';
import ApiHandler from 'js/api-handler';
import FaceDrawer from 'js/face-drawer';
import Logger from 'js/logger';

const md = new MobileDetect(window.navigator.userAgent);
const isMobile = md.mobile();

document.getElementById('take-photo').classList.remove('hide');
if (!isMobile) {
  document.getElementById('upload').classList.remove('hide');
}

const logger = new Logger();

const imageHandler = new ImageHandler(logger, isMobile);

const faceDrwaer = new FaceDrawer(logger);

const success = response => {
  const img = document.getElementById('uploaded-image');

  faceDrwaer.drawFaces(response.faces, { img_width: img.width, img_height: img.height }, '0.4px')
}

const error = error => {
  console.log(error);
}

const apiHandler = new ApiHandler({ success, error, logger });

faceDrwaer.setApiHandler(apiHandler);

imageHandler.onImageUploaded = apiHandler.onImageUploaded;
