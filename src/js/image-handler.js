import { isEmpty } from 'lodash/fp';
import { removeAllEventListeners } from 'js/utils';

export default class ImageHandler {
  constructor(logger, isMobile) {
    this.logger = logger;
    this.input = document.getElementById('upload-input');
    this.input.addEventListener('change', this.fileUploaded);
    this.canvas = document.getElementById('canvas');
    this.video = document.getElementById('photo-preview');
    this.fileReader = new FileReader();
    this.isMobile = isMobile;

    if (isMobile) {
      document.getElementById('take-photo').addEventListener('click', this.openUploadDialog);
    } else {
      document.getElementById('take-photo').addEventListener('click', this.takePhoto);
      document.getElementById('upload').addEventListener('click', this.openUploadDialog);
    }
    
    this.fileReader.addEventListener('load', event => this.callOnImageUploadedEventListeners(event.target.result), false);
  }

  openUploadDialog = () => {
    this.input.click();
  };

  takePhoto = () => {
    if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
      navigator.mediaDevices = navigator.mediaDevices ? navigator.mediaDevices : {};
      navigator.mediaDevices.getUserMedia = navigator.mediaDevices.getUserMedia 
        ? navigator.mediaDevices.getUserMedia
        : require('webrtc-adapter/out/adapter').getUserMedia;
    }

    this.goToTakePictureState();
  }

  goToInitialState = () => {
    let pictureButton = document.getElementById('picture');
    const photoButtonsContainer = document.getElementById('photo-buttons-container');
    const uploadButtonsContainer = document.getElementById('upload-buttons-container');
    const usePhotoButton = document.getElementById('use-photo');
    const retakeButton = document.getElementById('retake');

    photoButtonsContainer.classList.add('hide');
    pictureButton.classList.add('hide');
    retakeButton.classList.add('hide');
    usePhotoButton.classList.add('hide');
    uploadButtonsContainer.classList.remove('hide');

    photoButtonsContainer.style.backgroundColor = "initial";
    photoButtonsContainer.style.justifyContent = "center";

    if (this.isMobile) {
      document.getElementById('upload').classList.add('hide');
    }

    pictureButton = removeAllEventListeners(pictureButton);

    this.video.classList.add('hide');
    this.canvas.classList.add('hide');
    document.getElementById('photo-preview').srcObject.getVideoTracks().forEach(track => track.stop());
  }

  goToTakePictureState = () => {
    const constraints = {
      audio: false,
      video: true
    };
    const usePhotoButton = document.getElementById('use-photo');
    const retakeButton = document.getElementById('retake');
    const photoButtonsContainer = document.getElementById('photo-buttons-container');

    retakeButton.classList.add('hide');
    usePhotoButton.classList.add('hide');

    photoButtonsContainer.style.backgroundColor = "transparent";
    photoButtonsContainer.style.justifyContent = "center";

    navigator.mediaDevices.getUserMedia(constraints)
      .then(mediaStream => {
        this.video.srcObject = mediaStream;

        let pictureButton = document.getElementById('picture');
        const uploadButtonsContainer = document.getElementById('upload-buttons-container');

        photoButtonsContainer.classList.remove('hide');
        pictureButton.classList.remove('hide');
        uploadButtonsContainer.classList.add('hide');

        pictureButton = removeAllEventListeners(pictureButton);

        this.video.classList.remove('hide');
        this.canvas.classList.add('hide');

        pictureButton.addEventListener('click', () => this.snapPicture(mediaStream));
      });
  }

  snapPicture = (mediaStream) => {
    let pictureButton = document.getElementById('picture');
    let usePhotoButton = document.getElementById('use-photo');
    let retakeButton = document.getElementById('retake');
    let photoButtonsContainer = document.getElementById('photo-buttons-container');
    const overlay = document.getElementById('overlay');
    const constraints = {
      audio: false,
      video: true
    };

    this.canvas.width = this.video.videoWidth;
    this.canvas.height = this.video.videoHeight;
    this.canvas.getContext('2d').drawImage(this.video, 0, 0, this.canvas.width, this.canvas.height);

    overlay.classList.remove('hide');
    
    setTimeout(() => {
      overlay.classList.add('hide');

      setTimeout(() => {
        this.video.classList.add('hide');
        pictureButton.classList.add('hide')
        this.canvas.classList.remove('hide');
        retakeButton.classList.remove('hide');
        usePhotoButton.classList.remove('hide');

        photoButtonsContainer.style.backgroundColor = "#000";
        photoButtonsContainer.style.justifyContent = "space-between";

        usePhotoButton = removeAllEventListeners(usePhotoButton);
        retakeButton = removeAllEventListeners(retakeButton);

        usePhotoButton.addEventListener('click', this.readSnappedPicture);
        retakeButton.addEventListener('click', this.goToTakePictureState);

        this.video.srcObject.getVideoTracks().forEach(track => track.stop());
      }, 700);
    }, 200);
  }

  readSnappedPicture = () => {
    this.canvas.toBlob(blob => {
      this.imageUploaded(blob);
    });
  }

  onImageUploadedEventListeners = [];

  set onImageUploaded(onImageUploaded) {
    this.onImageUploadedEventListeners.push(onImageUploaded);
  }

  fileUploaded = () => {
    const currFiles = this.input.files;

    if (isEmpty(currFiles)) {
      return null;
    }

    this.imageUploaded(currFiles[0]);
  }
  
  imageUploaded = blob => {
    const img = document.createElement('img');
    
    // img.classList.remove('hide');
    img.src = window.URL.createObjectURL(blob);
    img.onload = () => {
      this.width  = img.naturalWidth  || img.width;
      this.height = img.naturalHeight || img.height; 
    }

    this.hideUploadButtons();

    document.body.classList.add('black-background');

    this.logger.startLogging();
    this.logger.log(`Image received: ${blob.name || 'from camera'}`);

    this.fileReader.readAsDataURL(blob);
  };

  callOnImageUploadedEventListeners = (imgBlob) => {
    if (!isEmpty(this.onImageUploadedEventListeners)) {
      this.onImageUploadedEventListeners.forEach(eventListener => {
        eventListener(imgBlob);
      });
    }
  }

  hideUploadButtons = () => {
    const buttonsContaner = document.getElementById('upload-container');

    buttonsContaner.classList.add('hide');
  }

  returnFileSize = numberOfBytes => {
    if(numberOfBytes < 1024) {
      return numberOfBytes + 'bytes';
    } else if(numberOfBytes >= 1024 && numberOfBytes < 1048576) {
      return (numberOfBytes/1024).toFixed(1) + 'KB';
    } else if(numberOfBytes >= 1048576) {
      return (numberOfBytes/1048576).toFixed(1) + 'MB';
    } else {
      return (numberOfBytes/1099511627776).toFixed(1) + 'GB';
    }
  }
}