import MobileDetect from 'mobile-detect';
import NoSleep from 'nosleep.js';

import 'css/index.css';

import ImageHandler from 'js/image-handler';
import ApiHandler from 'js/api-handler';
import FaceDrawer from 'js/face-drawer';
import Logger from 'js/logger';

const noSleep = new NoSleep();

function enableNoSleep() {
  noSleep.enable();
  document.removeEventListener('click', enableNoSleep, false);
}

document.addEventListener('click', enableNoSleep, false);

document.getElementById('picture').addEventListener('mouseenter', e => console.log(e.targe))

const md = new MobileDetect(window.navigator.userAgent);
const isMobile = md.mobile();

document.getElementById('take-photo').classList.remove('hide');
if (!isMobile) {
  document.getElementById('upload').classList.remove('hide');
}

const logger = new Logger(noSleep);

const imageHandler = new ImageHandler(logger, isMobile);

const faceDrawer = new FaceDrawer(logger);

const success = response => {
  const img = document.getElementById('uploaded-image');

  faceDrawer.drawFaces(response.faces, { img_width: imageHandler.width, img_height: imageHandler.height }, '0.7px')
}

const error = error => {
  console.log(error);
}

const apiHandler = new ApiHandler({ success, error, logger });

faceDrawer.setApiHandler(apiHandler);

imageHandler.onImageUploaded = apiHandler.onImageUploaded;
