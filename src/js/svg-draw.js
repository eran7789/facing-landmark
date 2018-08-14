import MobileDetect from 'mobile-detect';
import { get } from 'lodash/fp';

const md = new MobileDetect(get('navigator.userAgent', window));

export default class SvgDraw {
  svgStart = '';
  svgEnd = '</svg>';
  body = ''

  toAttr = (attrs) => {
      var str = ' '
      for (var key in attrs) {
          var value = attrs[key]
          str += key + '=\'' + value + '\' '
      }
      return str;
  }

  element = (name, attrs) => {
      var attrStr = this.toAttr(attrs)
      var tag = '<' + name + attrStr + " />"
      return tag
  }

  clear = function() {
      this.body = ''
      return this;
  }

  newCanvas = function(width, height) {
    const viewBox = md.is('iPhone') ? `0 0 ${height} ${width}` : `0 0 ${width} ${height}`;
    this.svgStart = `<svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" version="1.1" viewBox="${viewBox}" x="0" y="0">`;
  }

  point = function(position, radius, color) {
      var attrs = {};
      attrs.cx = position.x;
      attrs.cy = position.y;
      attrs.fill = color;
      attrs.r = radius
      var elem = this.element('circle', attrs);
      this.body += elem
      return this;
  }

  line = function(coord, thickness, color) {
      //<line x1="0" y1="150" x2="400" y2="150" stroke-width="2" stroke="blue"/>
      var attrs = {};
      attrs.x1 = coord.start.x;
      attrs.y1 = coord.start.y;
      attrs.x2 = coord.stop.x;
      attrs.y2 = coord.stop.y;

      attrs.fill = "none"
      attrs.stroke = color
      attrs['stroke-width'] = thickness;
      var elem = this.element('line', attrs);
      this.body += elem;
      return this;
  }

  polyline = function(coord, thickness, color) {
      var attrs = {};
      var newCood = [];
      for (var index in coord) {
          var item = coord[index];
          newCood.push(item.x + "," + item.y);
      }
      attrs.points = newCood.join(' ')
      attrs.fill = "none"
      attrs.stroke = color
      attrs['stroke-width'] = thickness;
      var elem = this.element('polyline', attrs);
      this.body += elem;
      return this;
      //console.log(elem)
      //<polyline points="13,37 28,437.5 258,62.5 150,25 42,52.6 42,37.5" fill="none" stroke="purple" stroke-width="4"/>

  }

  export = function() {
      return this.svgStart + this.body + this.svgEnd;
  }

  exportDataUrl = function() {
      return "data:image/svg+xml;base64," + window.btoa(this.export());
  }

  exportCssDataUrl = function() {
      return "url('" + this.exportDataUrl() + "')";
  }
};