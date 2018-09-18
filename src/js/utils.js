import { map } from 'lodash/fp';

export const removeAllEventListeners = (element) => {
  const newElement = element.cloneNode(false);

  while (element.hasChildNodes()) newElement.appendChild(element.firstChild);

  element.parentNode.replaceChild(newElement, element);

  return newElement;
}

export const mapWithKeys = map.convert({ cap: false });