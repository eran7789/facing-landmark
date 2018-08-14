export default class ApiHandler {
  constructor({ success, error, logger }) {
    this.success = success;
    this.error = error;
    this.logger = logger;
  }

  API_BASE_URL = 'https://api-us.faceplusplus.com/facepp/v3/detect';

  onImageUploaded = imgBlob => {
    this.logger.log('Detecting faces');
    this.callApi(imgBlob);
  }

  handleSuccess = response => {
    if (response.faces.length === 0) {
      this.logger.stopAfter('0 Faces detected');
    } else if (typeof this.success === 'function') {
      this.logger.log(`${response.faces.length} ${response.faces.length === 1 ? 'Face' : 'Faces'} detected`);
      this.success(response);
    }
  }

  handleError = () => {
    this.logger.immediateStop('Face detection failed, please try again');

    if (typeof this.error === 'function') {    
      this.error();
    }
  }

  saveImage = svgString => {
    const  xhr = new XMLHttpRequest();
    const data = { image: svgString };

    xhr.timeout = 10 * 1000;
    // xhr.onreadystatechange = () => {
    //   if (xhr.readyState === 4) {
    //     if (xhr.status !== 200) {
    //       return this.saveImage(svgString);
    //     }
    //   }
    // };


    xhr.open('POST', '/api/save-landmark');
    xhr.setRequestHeader("Content-Type", "application/json;charset=UTF-8");
    xhr.send(JSON.stringify(data));
  }

  callApi = imgBlob => {
    const  xhr = new XMLHttpRequest();

    xhr.timeout = 10 * 1000;
    xhr.onreadystatechange = () => {
      if (xhr.readyState === 4) {
        if (xhr.status === 200) {
          this.handleSuccess(JSON.parse(xhr.responseText));
        } else { 
          this.handleError();
        }
      }
    };

    var fd = new FormData();
    fd.append('api_key', process.env.API_KEY);
    fd.append('api_secret', process.env.API_SECRET);
    fd.append('return_landmark', 1);
    fd.append('return_attributes', 'gender');
    fd.append('image_base64', imgBlob);

    xhr.open('POST', this.API_BASE_URL);
    xhr.send(fd);
  }
}