import { flow, maxBy, minBy, lowerCase, identity, map } from 'lodash/fp';

import SvgDraw from 'js/svg-draw';
import { mapWithKeys } from 'js/utils';

const EYE_STATUS_MAP = {
  occlusion: 'eye is blocked',
  no_glass_eye_open: 'no glasses eye is open',
  normal_glass_eye_close: 'wear\'s glasses eye is closed',
  normal_glass_eye_open: 'wear\'s glasses eye is open',
  dark_glasses: 'wear\'s dark glasses',
  no_glass_eye_close: 'no glasses eye is closed'
};

export default class FaceDrawer {
  constructor(logger) {
    this.logger = logger;
    this.landmark = document.getElementById('landmark');
    this.svgDraw = new SvgDraw();
  }

  newDrawing = function({ width, height }) {
      this.svgDraw.newCanvas(width, height);
  }

  round = function(x ,digits){
      return parseFloat(x.toFixed(digits));
  }

  toReal = function(val, parent) {
      return val - parent + 10;//this.round((val / 100 * parent),2);
  }

  drawNose = function(face, parentData, thickness) {
      var noseArr = ['nose_contour_left1', 'nose_contour_left2', 'nose_left', 'nose_contour_left3', 'nose_contour_lower_middle', 'nose_contour_right3', 'nose_right', 'nose_contour_right2', 'nose_contour_right1'] 
      var coords = []
      for (var i = 0; i < noseArr.length; i++) {
          var name = noseArr[i];
          var area = face[name];
          var coord = { x: this.toReal(area.x, this.facesPositions.left), y: this.toReal(area.y, this.facesPositions.top) };
          coords.push(coord);
          //this.svgDraw.point({ x: this.toReal(area.x, this.facesPositions.left), y: this.toReal(area.y, this.facesPositions.top) }, 4, 'white')
      }
      this.svgDraw.polyline(coords, thickness, "white")
  }

  drawMouth = function(face, parentData, thickness) {
      //var noseArr = ['mouth_left_corner','mouth_upper_lip_left_contour1','mouth_upper_lip_left_contour2','mouth_upper_lip_left_contour3','mouth_upper_lip_top','mouth_upper_lip_right_contour1','mouth_upper_lip_right_contour2','mouth_upper_lip_right_contour3']
      var noseArr = ['mouth_right_corner', 'mouth_upper_lip_right_contour3', 'mouth_upper_lip_bottom', 'mouth_upper_lip_left_contour3', 'mouth_left_corner', 'mouth_upper_lip_left_contour2', 'mouth_upper_lip_left_contour1', 'mouth_upper_lip_top', 'mouth_upper_lip_right_contour1', 'mouth_upper_lip_right_contour2', 'mouth_right_corner', 'mouth_lower_lip_right_contour2', 'mouth_lower_lip_right_contour2', 'mouth_lower_lip_right_contour3', 'mouth_lower_lip_bottom', 'mouth_lower_lip_left_contour3', 'mouth_lower_lip_left_contour2', 'mouth_left_corner', 'mouth_lower_lip_left_contour1', 'mouth_lower_lip_top', 'mouth_lower_lip_right_contour1','mouth_right_corner']

      var coords = []
      for (var i = 0; i < noseArr.length; i++) {
          var name = noseArr[i];
          var area = face[name];
          var coord = { x: this.toReal(area.x, this.facesPositions.left), y: this.toReal(area.y, this.facesPositions.top) };
          coords.push(coord);
          //this.svgDraw.point({ x: this.toReal(area.x, this.facesPositions.left), y: this.toReal(area.y, this.facesPositions.top) }, 1.5, 'white')
      }
      this.svgDraw.polyline(coords,thickness, "white")
  }

  drawEyeBrow = function(face, parentData, thickness) {
      var noseArr = ['left_eyebrow_left_corner', 'left_eyebrow_upper_left_quarter', 'left_eyebrow_upper_middle', 'left_eyebrow_upper_right_quarter', 'left_eyebrow_right_corner', 'left_eyebrow_lower_right_quarter', 'left_eyebrow_lower_middle', 'left_eyebrow_lower_left_quarter', 'left_eyebrow_left_corner']
      var coords = []
      for (var i = 0; i < noseArr.length; i++) {
          var name = noseArr[i];
          var area = face[name];
          var coord = { x: this.toReal(area.x, this.facesPositions.left), y: this.toReal(area.y, this.facesPositions.top) };
          coords.push(coord);
          //this.svgDraw.point({ x: this.toReal(area.x, this.facesPositions.left), y: this.toReal(area.y, this.facesPositions.top) }, 1.5, 'white')
          //this.svgDraw.point({ x: this.toReal(area.x, this.facesPositions.left), y: this.toReal(area.y, this.facesPositions.top) }, 4, 'white')
      }
      this.svgDraw.polyline(coords, thickness, "white")

      var noseArr = ['right_eyebrow_left_corner', 'right_eyebrow_upper_left_quarter', 'right_eyebrow_upper_middle', 'right_eyebrow_upper_right_quarter', 'right_eyebrow_right_corner', 'right_eyebrow_lower_right_quarter', 'right_eyebrow_lower_middle', 'right_eyebrow_lower_left_quarter', 'right_eyebrow_left_corner']
      var coords = []
      for (var i = 0; i < noseArr.length; i++) {
          var name = noseArr[i];
          var area = face[name];
          var coord = { x: this.toReal(area.x, this.facesPositions.left), y: this.toReal(area.y, this.facesPositions.top) };
          coords.push(coord);
          //this.svgDraw.point({ x: this.toReal(area.x, this.facesPositions.left), y: this.toReal(area.y, this.facesPositions.top) }, 1.5, 'white')
          //this.svgDraw.point({ x: this.toReal(area.x, this.facesPositions.left), y: this.toReal(area.y, this.facesPositions.top) }, 4, 'white')
      }
      this.svgDraw.polyline(coords, thickness, "white")

      //var area=face['left_eye_pupil']
      //this.svgDraw.point({ x: this.toReal(area.x, this.facesPositions.left), y: this.toReal(area.y, this.facesPositions.top) }, 4, 'white')

  }

  drawEyes = function(face, parentData, thickness) {
      var noseArr = ['left_eye_top', 'left_eye_upper_right_quarter', 'left_eye_right_corner', 'left_eye_lower_right_quarter', 'left_eye_bottom', 'left_eye_lower_left_quarter', 'left_eye_left_corner', 'left_eye_upper_left_quarter', 'left_eye_top']
      var coords = []
      for (var i = 0; i < noseArr.length; i++) {
          var name = noseArr[i];
          var area = face[name];
          var coord = { x: this.toReal(area.x, this.facesPositions.left), y: this.toReal(area.y, this.facesPositions.top) };
          coords.push(coord);
          //this.svgDraw.point({ x: this.toReal(area.x, this.facesPositions.left), y: this.toReal(area.y, this.facesPositions.top) }, 1.5, 'white')
          //this.svgDraw.point({ x: this.toReal(area.x, this.facesPositions.left), y: this.toReal(area.y, this.facesPositions.top) }, 4, 'white')
      }
      this.svgDraw.polyline(coords,thickness, "white")

      var noseArr = ['right_eye_top', 'right_eye_upper_right_quarter', 'right_eye_right_corner', 'right_eye_lower_right_quarter', 'right_eye_bottom', 'right_eye_lower_left_quarter', 'right_eye_left_corner', 'right_eye_upper_left_quarter', 'right_eye_top']
      var coords = []
      for (var i = 0; i < noseArr.length; i++) {
          var name = noseArr[i];
          var area = face[name];
          var coord = { x: this.toReal(area.x, this.facesPositions.left), y: this.toReal(area.y, this.facesPositions.top) };
          coords.push(coord);
          //this.svgDraw.point({ x: this.toReal(area.x, this.facesPositions.left), y: this.toReal(area.y, this.facesPositions.top) }, 1.5, 'white')
          //this.svgDraw.point({ x: this.toReal(area.x, this.facesPositions.left), y: this.toReal(area.y, this.facesPositions.top) }, 4, 'white')
      }
      /*var area=face['left_eye_center']
      this.svgDraw.point({ x: this.toReal(area.x, this.facesPositions.left), y: this.toReal(area.y, this.facesPositions.top) }, 2, 'white')
      var area=face['right_eye_center']
      this.svgDraw.point({ x: this.toReal(area.x, this.facesPositions.left), y: this.toReal(area.y, this.facesPositions.top) }, 2, 'white')*/
      this.svgDraw.polyline(coords, thickness, "white")

      //var area=face['left_eye_pupil']
      //this.svgDraw.point({ x: this.toReal(area.x, this.facesPositions.left), y: this.toReal(area.y, this.facesPositions.top) }, 4, 'white')

  }

  drawFace = function(face, parentData, thickness) {
      var noseArr = ['contour_left1', 'contour_left2', 'contour_left3', 'contour_left4', 'contour_left5', 'contour_left6', 'contour_left7', 'contour_left8', 'contour_left9', 'contour_chin', "contour_chin", "contour_right9", "contour_right8", "contour_right7", "contour_right6", "contour_right5", "contour_right4", "contour_right3", "contour_right2", "contour_right1"]
      var coords = []
      for (var i = 0; i < noseArr.length; i++) {
          var name = noseArr[i];
          var area = face[name];
          //console.error('height',parentData['img_height'],'width',parentData['img_width'])
          var coord = { x: this.toReal(area.x, this.facesPositions.left), y: this.toReal(area.y, this.facesPositions.top) };
          coords.push(coord);
          //this.svgDraw.point({ x: this.toReal(area.x, this.facesPositions.left), y: this.toReal(area.y, this.facesPositions.top) }, 1.5, 'white')
          //this.svgDraw.point({ x: this.toReal(area.x, this.facesPositions.left), y: this.toReal(area.y, this.facesPositions.top) }, 4, 'white')
      }
      var height = this.toReal(parentData.height, parentData['img_height']),
          width = this.toReal(parentData.width, parentData['img_width']);
      //console.log(height,width)
      //var faceRect=[{x:30,y:40}]
      //this.svgDraw.polyline(faceRect, 1, "white")
      this.svgDraw.polyline(coords, thickness, "white")
  }

  drawFaceVertices = function(face, parentData, thickness) {
      //'left_eyebrow_left_corner'
      var vertices = [
          //Nose
          ['nose_tip', 'nose_contour_left1'],
          ['nose_tip', 'nose_contour_right1'],
          ['nose_contour_right1', 'nose_contour_left1'],
          ['nose_tip', 'nose_contour_lower_middle'],
          ['nose_tip', 'nose_contour_right2'],
          ['nose_tip', 'nose_contour_left2'],
          ['nose_tip', 'nose_contour_right3'],
          ['nose_tip', 'nose_contour_left3'],
          ['nose_contour_right3','nose_contour_right2'],
          ['nose_contour_left3','nose_contour_left2'],
          //Nose to eyebrows
          [ 'nose_contour_left1','left_eyebrow_right_corner'],
          ['left_eyebrow_right_corner','nose_contour_right1'],
          ['nose_contour_right1','right_eyebrow_left_corner'],
          ['right_eyebrow_left_corner','left_eyebrow_right_corner'],
          //Nose to right eyes
          ['nose_contour_right1','right_eye_left_corner'],
          ['right_eye_lower_left_quarter', 'nose_contour_right2'],
          ['right_eye_bottom', 'nose_contour_right2'],
          ['right_eye_lower_right_quarter', 'nose_contour_right2'],
          ['right_eye_lower_right_quarter', 'nose_right'],
          ['right_eye_left_corner','nose_contour_right2'],
          //Nose to left eyes
          ['nose_contour_left1','left_eye_right_corner'],
          ['left_eye_lower_left_quarter', 'nose_contour_left2'],
          ['left_eye_bottom', 'nose_contour_left2'],
          ['left_eye_lower_right_quarter', 'nose_contour_left2'],
          ['left_eye_right_corner','nose_contour_left2'],
          ['left_eye_lower_left_quarter','nose_left'],
          //Upper lip to nose
          ['nose_left','mouth_upper_lip_left_contour1'],
          ['mouth_upper_lip_left_contour2','nose_left'],
          ['nose_contour_left3','mouth_upper_lip_left_contour1'],
          ['mouth_upper_lip_left_contour1','nose_contour_lower_middle'],
          ['nose_contour_lower_middle','mouth_upper_lip_top'],
          ['nose_contour_lower_middle','mouth_upper_lip_right_contour1'],
          //['mouth_upper_lip_top','nose_contour_right3'],
          ['nose_contour_right3','mouth_upper_lip_right_contour1'],
          ['mouth_upper_lip_right_contour1','nose_right'],
          ['nose_right','mouth_upper_lip_right_contour2'],

          //Upper lip
          ['mouth_upper_lip_right_contour2','mouth_upper_lip_right_contour3'],
          ['mouth_upper_lip_right_contour3','mouth_upper_lip_right_contour1'],
          ['mouth_upper_lip_right_contour1','mouth_upper_lip_bottom'],
          ['mouth_upper_lip_bottom','mouth_upper_lip_top'],
          ['mouth_upper_lip_bottom','mouth_upper_lip_left_contour1'],
          ['mouth_upper_lip_left_contour1','mouth_upper_lip_left_contour3'],
          ['mouth_upper_lip_left_contour3','mouth_upper_lip_left_contour2'],
          //Lower lip
          ['mouth_lower_lip_right_contour2','mouth_lower_lip_right_contour1'],
          ['mouth_lower_lip_right_contour1','mouth_lower_lip_right_contour3'],
          ['mouth_lower_lip_right_contour3','mouth_lower_lip_top'],
          ['mouth_lower_lip_top','mouth_lower_lip_bottom'],
          ['mouth_lower_lip_top','mouth_lower_lip_left_contour3'],
          ['mouth_lower_lip_left_contour3','mouth_lower_lip_left_contour1'],
          ['mouth_lower_lip_left_contour1','mouth_lower_lip_left_contour2'],
          //Upper lip to lower lip
          ['mouth_lower_lip_left_contour1','mouth_upper_lip_left_contour3'],
          ['mouth_upper_lip_left_contour3','mouth_lower_lip_top'],
          ['mouth_lower_lip_top','mouth_upper_lip_bottom'],
          ['mouth_upper_lip_bottom','mouth_lower_lip_right_contour1'],
          ['mouth_lower_lip_right_contour1','mouth_upper_lip_right_contour3'],
          //left eyebrow to left eyes
          ['left_eyebrow_right_corner','left_eye_right_corner'],
          ['left_eyebrow_right_corner','left_eye_upper_right_quarter'],
          ['left_eye_upper_right_quarter','left_eyebrow_lower_right_quarter'],
          ['left_eyebrow_lower_right_quarter','left_eye_top'],
          ['left_eye_top','left_eyebrow_lower_middle'],
          ['left_eyebrow_lower_middle','left_eye_upper_left_quarter'],
          ['left_eye_upper_left_quarter','left_eyebrow_lower_left_quarter'],
          ['left_eyebrow_lower_left_quarter','left_eye_left_corner'],
          ['left_eye_left_corner','left_eyebrow_left_corner'],
          //right eyebrow to right eye
          ['right_eyebrow_right_corner','right_eye_right_corner'],
          ['right_eyebrow_lower_right_quarter','right_eye_right_corner'],
          ['right_eye_upper_right_quarter','right_eyebrow_lower_right_quarter'],
          ['right_eye_upper_right_quarter','right_eyebrow_lower_middle'],
          //['right_eyebrow_right_corner','right_eye_upper_right_quarter'],
          //['right_eye_upper_right_quarter','right_eyebrow_lower_right_quarter'],
          //['right_eyebrow_lower_right_quarter','right_eye_top'],
          ['right_eye_top','right_eyebrow_lower_middle'],
          ['right_eyebrow_lower_middle','right_eye_upper_left_quarter'],
          ['right_eye_upper_left_quarter','right_eyebrow_lower_left_quarter'],
          //['right_eyebrow_lower_left_quarter','right_eye_left_corner'],
          ['right_eye_upper_left_quarter','right_eyebrow_left_corner'],
          ['right_eye_left_corner','right_eyebrow_left_corner'],


          //left eyebrows
          ['left_eyebrow_lower_left_quarter','left_eyebrow_upper_left_quarter'],
          ['left_eyebrow_lower_middle','left_eyebrow_upper_left_quarter'],
          ['left_eyebrow_lower_middle','left_eyebrow_upper_middle'],
          ['left_eyebrow_upper_middle','left_eyebrow_lower_right_quarter'],
          ['left_eyebrow_lower_right_quarter','left_eyebrow_upper_right_quarter'],
          //right eyebrows
          ['right_eyebrow_lower_left_quarter','right_eyebrow_upper_left_quarter'],
          ['right_eyebrow_upper_middle','right_eyebrow_lower_left_quarter'],
          //['right_eyebrow_lower_middle','right_eyebrow_upper_left_quarter'],
          ['right_eyebrow_lower_middle','right_eyebrow_upper_middle'],
          ['right_eyebrow_upper_right_quarter','right_eyebrow_lower_middle'],
          //['right_eyebrow_upper_middle','right_eyebrow_lower_right_quarter'],
          ['right_eyebrow_lower_right_quarter','right_eyebrow_upper_right_quarter'],
          //Left to right eyebrows
          ['left_eyebrow_upper_right_quarter','right_eyebrow_upper_left_quarter'],
          ['right_eyebrow_upper_left_quarter','left_eyebrow_right_corner'],
          //Eyebrows to face
          ['right_eyebrow_right_corner','contour_right1'],
          ['contour_right1','right_eye_right_corner'],
          ['right_eye_right_corner','contour_right2'],
          ['contour_right2','right_eye_lower_right_quarter'],
          ['right_eye_lower_right_quarter','contour_right3'],
          //Nose to face
          ['contour_right3','nose_right'],
          ['nose_right','contour_right4'],
          //Mouth right to face
          ['contour_right4','mouth_upper_lip_right_contour2'],
          ['mouth_upper_lip_right_contour2','contour_right5'],
          ['contour_right5','mouth_right_corner'],
          //['mouth_upper_lip_right_contour2','contour_right5'],
          //['contour_right5','mouth_right_corner'],
          ['mouth_right_corner','contour_right6'],
          ['mouth_right_corner','contour_right7'],
          ['contour_right7','mouth_lower_lip_right_contour2'],
          ['mouth_lower_lip_right_contour2','contour_right8'],

          

          //['contour_right6','mouth_lower_lip_right_contour2'],
          //['mouth_lower_lip_right_contour2','contour_right7'],
          //['contour_right7','mouth_lower_lip_right_contour3'],
          
          ['contour_right8','mouth_lower_lip_right_contour3'],
          ['mouth_lower_lip_right_contour3','contour_right9'],
          //['contour_right8','mouth_lower_lip_bottom'],
          ['mouth_lower_lip_bottom','contour_right9'],
          //Middle
          ['mouth_lower_lip_bottom','contour_chin'],
          //left face
          ['mouth_lower_lip_bottom','contour_left9'],
          ['contour_left9','mouth_lower_lip_left_contour3'],
          ['mouth_lower_lip_left_contour3','contour_left8'],
          ['contour_left8','mouth_lower_lip_left_contour2'],
          ['mouth_lower_lip_left_contour2','contour_left7'],
          ['contour_left7','mouth_left_corner'],
          ['mouth_left_corner','contour_left6'],
          //['mouth_left_corner','contour_left5'],

          //['contour_left6','mouth_upper_lip_left_contour2'],
          ['contour_left5','mouth_left_corner'],
          ['mouth_upper_lip_left_contour2','contour_left5'],


          //['mouth_upper_lip_left_contour2','contour_left5'],
          ['mouth_upper_lip_left_contour2','contour_left4'],
          //['contour_left5','nose_left'],

          ['nose_left','contour_left4'],
          ['nose_left','contour_left3'],
          //['contour_left4','left_eye_lower_left_quarter'],
          //['left_eye_lower_left_quarter','contour_left3'],
          ['contour_left3','left_eye_lower_left_quarter'],
          ['left_eye_lower_left_quarter','contour_left2'],
          ['contour_left2','left_eye_left_corner'],
          ['left_eye_left_corner','contour_left1'],
          ['contour_left1','left_eyebrow_left_corner'],

          //Left eyes polygon
          ['left_eye_lower_left_quarter','left_eye_upper_left_quarter'],
          ['left_eye_upper_left_quarter','left_eye_pupil'],
          ['left_eye_lower_left_quarter','left_eye_pupil'],
          ['left_eye_pupil','left_eye_top'],
          ['left_eye_pupil','left_eye_bottom'],
          ['left_eye_pupil','left_eye_lower_right_quarter'],
          ['left_eye_pupil','left_eye_upper_right_quarter'],
          ['left_eye_lower_right_quarter','left_eye_upper_right_quarter'],




          //Right eyes polygon
          ['right_eye_lower_left_quarter','right_eye_upper_left_quarter'],
          ['right_eye_upper_left_quarter','right_eye_pupil'],
          ['right_eye_lower_left_quarter','right_eye_pupil'],
          ['right_eye_pupil','right_eye_top'],
          ['right_eye_pupil','right_eye_bottom'],
          ['right_eye_pupil','right_eye_lower_right_quarter'],
          ['right_eye_pupil','right_eye_upper_right_quarter'],
          ['right_eye_lower_right_quarter','right_eye_upper_right_quarter'],
          //['right_eye_upper_left_quarter','right_eye_bottom'],
          //['right_eye_bottom','right_eye_top'],
          //['right_eye_top','right_eye_lower_right_quarter'],
          //['right_eye_lower_right_quarter','right_eye_upper_right_quarter'],

      ]
      for (var i = 0; i < vertices.length; i++) {
          var vartice = vertices[i];
          var start = face[vartice[0]];
          var stop = face[vartice[1]];
          this.svgDraw.line({
              start:{ x: this.toReal(start.x, this.facesPositions.left), y: this.toReal(start.y, this.facesPositions.top) },
              stop:{ x: this.toReal(stop.x, this.facesPositions.left), y: this.toReal(stop.y, this.facesPositions.top) }
          }, thickness, '#fff');
      }
  }

  draw = function(face, parentData, thickness) {
      //var a=`<svg width="200" height="200" xmlns="http://www.w3.org/2000/svg">
      //<circle cx="100" cy="100" r="1" fill="white" />
      //</svg>
      // `;
      var landmark = face.landmark;
      //console.log(landmark)
      var nose = landmark['nose_tip'];
      this.drawNose(landmark, parentData, thickness)
      this.drawFace(landmark, parentData, thickness)
      this.drawEyes(landmark, parentData, thickness)
      this.drawEyeBrow(landmark, parentData, thickness)
      this.drawMouth(landmark, parentData, thickness)
      this.drawFaceVertices(landmark, parentData, thickness)

      //<line x1="0" y1="150" x2="400" y2="150" stroke-width="2" stroke="white"/>
      /* this.svgDraw.line({
            start:{
                x:0,
                y:33
            },
            stop:{
                x:400,
                y:150
            }
        }, 3, 'white')*/

      //13,37 28,437.5 258,62.5 150,25 42,52.6 42,37.5
      //this.svgDraw.polyline([{x:0,y:20},{x:20,y:44}],3,"white")
      //this.svgDraw.point({ x: this.toReal(nose.x, parentData['img_width']), y: this.toReal(nose.y, parentData['img_height']) }, 2, 'white')
  }

  drawFaces = (faces, parentData, thickness) => {
    const faceDescription = faces.length > 1 ? 'faces' : 'face';

    this.newDrawing({ height: parentData.img_height, width: parentData.img_width });

    if (faces.length > 0) {
      let count = 0;

      this.facesPositions = this.calculateFacesPosition(faces);
      faces.forEach(face => {
        count += 1;
  
        if (faces.length > 1) {
          this.logger.log(`Analyzing landmarks for face number ${count}...`, false, 1000);
        } else {
          this.logger.log('Analyzing landmarks...', false, 1000);
        }

        const emotion = flow(
          mapWithKeys((value, key) => ({ emotion: key, value })),
          maxBy(item => item.value),
          (emotionObject) => emotionObject.emotion
        )(face.attributes.emotion);
        const leftEyeStatus = flow(
          mapWithKeys((value, key) => ({ status: key, value })),
          maxBy(item => item.value),
          (statusObject) => statusObject.status
        )(face.attributes.eyestatus.left_eye_status);
        const rightEyeStatus = flow(
          mapWithKeys((value, key) => ({ status: key, value })),
          maxBy(item => item.value),
          (statusObject) => statusObject.status
        )(face.attributes.eyestatus.right_eye_status);

        this.logger.log(`Age: ${lowerCase(face.attributes.age.value)}`);
        this.logger.log(`Gender: ${lowerCase(face.attributes.gender.value)}`);
        this.logger.log(`Smiling value: ${lowerCase(face.attributes.smile.value)}`);
        this.logger.log(`Emotion: ${lowerCase(emotion)}`);
        this.logger.log(`Ethnicity: ${lowerCase(face.attributes.ethnicity.value)}`);
        this.logger.log(`Left eye status: ${EYE_STATUS_MAP[leftEyeStatus]}`);
        this.logger.log(`Right eye status: ${EYE_STATUS_MAP[rightEyeStatus]}`);

        this.draw(face, parentData, thickness);
      });

      var bs = this.svgDraw.export('Identification stored', this.calculateFacesPosition(faces));

      this.logger.log('Calibrating values...');
      this.logger.log(`Identification ${faces.length > 1 ? 'profiles' : 'profile'} created...`);

      if (window.location.pathname === '/landmark/download') {
        this.saveFile(faces, parentData);
      }
    } else {
      this.logger.immediateStop('No Faces detected');
    }

    this.logger.stopLogging(bs, faces.length > 1);
  }

  findHeighestFacePoint = face => {
    const landmarks = map(identity, face.landmark);

    return minBy('y', landmarks).y;
  }

  findLowestFacePoint = face => {
    const landmarks = map(identity, face.landmark);

    return maxBy('y', landmarks).y;
  }

  findLeftMostFacePoint = face => {
    const landmarks = map(identity, face.landmark);

    return minBy('x', landmarks).x;
  }

  findRightMostFacePoint = face => {
    const landmarks = map(identity, face.landmark);

    return maxBy('x', landmarks).x;
  }

  calculateFacesPosition = (faces) => {
    const topFace = minBy(this.findHeighestFacePoint, faces);
    const bottomFace = maxBy(this.findLowestFacePoint, faces);
    const leftFace = minBy(this.findLeftMostFacePoint, faces);
    const rightFace = maxBy(this.findRightMostFacePoint, faces);
    // const bottom = bottomFace.face_rectangle.top + bottomFace.face_rectangle.height;
    // const left = minBy(face => face.face_rectangle.left, faces).face_rectangle.left;
    // const rightFace = maxBy(face => face.face_rectangle.left, faces);
    // const right = rightFace.face_rectangle.left + rightFace.face_rectangle.width;

    return {
      left: this.findLeftMostFacePoint(leftFace),
      right: this.findRightMostFacePoint(rightFace),
      top: this.findHeighestFacePoint(topFace),
      bottom: this.findLowestFacePoint(bottomFace)
    }
  }

  saveFile = (faces, parentData) => {
      var filename = 'facing-landmark.svg';
      var data = this.svgDraw.export(false, this.calculateFacesPosition(faces));
      var blob = new Blob([data], { type: 'image/svg+xml' });
      if (window.navigator.msSaveOrOpenBlob) {
          window.navigator.msSaveBlob(blob, filename);
      } else {
          var elem = window.document.createElement('a');
          elem.href = window.URL.createObjectURL(blob);
          elem.download = filename;
          document.body.appendChild(elem);
          elem.click();
          document.body.removeChild(elem);
      }
      // this.newDrawing({ height: parentData.img_height, width: parentData.img_width });
      // faces.forEach(face => {
      //   this.draw(face, parentData, '0.1px');
      // });
      // const bs = this.svgDraw.export();
      // // Send to server

      // if (this.apiHandler) {
      //   this.apiHandler.saveImage(bs);
      // }
  }

  setApiHandler = handler => {
    this.apiHandler = handler;
  }

  clearAll = function() {
      this.svgDraw.clear();
      this.landmark.style.backgroundImage = '';
  }
}