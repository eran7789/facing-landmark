export const removeAllEventListeners = (element) => {
  const newElement = element.cloneNode(false);

  while (element.hasChildNodes()) newElement.appendChild(element.firstChild);

  element.parentNode.replaceChild(newElement, element);

  return newElement;
}