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
    let redoButton = document.getElementById('go-back');
    const photoButtonsContainer = document.getElementById('photo-buttons-container');
    const uploadButtonsContainer = document.getElementById('upload-buttons-container');

    photoButtonsContainer.classList.add('hide');
    pictureButton.classList.add('hide');
    redoButton.classList.add('hide');
    uploadButtonsContainer.classList.remove('hide');

    if (this.isMobile) {
      document.getElementById('upload').classList.add('hide');
    }

    pictureButton = removeAllEventListeners(pictureButton);
    redoButton = removeAllEventListeners(redoButton);

    this.video.classList.add('hide');
    this.canvas.classList.add('hide');
    document.getElementById('photo-preview').srcObject.getVideoTracks().forEach(track => track.stop());
  }

  goToTakePictureState = () => {
    const constraints = {
      audio: false,
      video: true
    };

    navigator.mediaDevices.getUserMedia(constraints)
      .then(mediaStream => {
        this.video.srcObject = mediaStream;

        let pictureButton = document.getElementById('picture');
        let redoButton = document.getElementById('go-back');
        const photoButtonsContainer = document.getElementById('photo-buttons-container');
        const uploadButtonsContainer = document.getElementById('upload-buttons-container');

        photoButtonsContainer.classList.remove('hide');
        pictureButton.classList.remove('hide');
        redoButton.classList.remove('hide');
        uploadButtonsContainer.classList.add('hide');

        pictureButton = removeAllEventListeners(pictureButton);
        redoButton = removeAllEventListeners(redoButton);

        this.video.classList.remove('hide');
        this.canvas.classList.add('hide');

        pictureButton.addEventListener('click', this.snapPicture);
        redoButton.addEventListener('click', this.goToInitialState);
      });
  }

  snapPicture = () => {
    let pictureButton = document.getElementById('picture');
    let redoButton = document.getElementById('go-back');
    
    this.canvas.width = this.video.videoWidth;
    this.canvas.height = this.video.videoHeight;
    this.canvas.getContext('2d').drawImage(this.video, 0, 0, this.canvas.width, this.canvas.height);
    
    this.canvas.classList.remove('hide');
    this.video.classList.add('hide');

    redoButton = removeAllEventListeners(redoButton);
    pictureButton = removeAllEventListeners(pictureButton);

    redoButton.addEventListener('click', this.goToTakePictureState);
    pictureButton.addEventListener('click', this.readSnappedPicture);

    document.getElementById('photo-preview').srcObject.getVideoTracks().forEach(track => track.stop());
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
    const img = document.getElementById('uploaded-image');
    
    img.classList.remove('hide');
    img.src = window.URL.createObjectURL(blob);

    this.hideUploadButtons();

    document.body.classList.add('black-background');

    this.logger.startLogging();
    this.logger.log(`Picture recieved: ${blob.name || 'from camera'}, size: ${this.returnFileSize(blob.size)}`);

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