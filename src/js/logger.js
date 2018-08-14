import { isEmpty } from 'lodash/fp';

import resolver, { stopAllResolvers } from 'js/resolver';

export default class Logger {
  constructor() {
    this.logContainer = document.getElementById('log-container');
  }

  getOptions = logMessage => ({
    // Initial position
    offset: 0,
    // Timeout between each random character
    timeout: 15,
    // Number of random characters to show
    iterations: 5,
    // Random characters to pick from
    characters: ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'i', 'j', 'k', 'l', 'm', 'n', 'o', 'p', 'q', 'r', 's', 't', 'u', 'v', 'x', 'y', 'x', '#', '%', '&', '-', '+', '_', '?', '/', '\\', '='],
    // String to resolve
    resolveString: logMessage,
    // The element
    element: this.logContainer
  })

  getStaticOptions = () => ({
    // Initial position
    offset: 0,
    // Timeout between each random character
    timeout: 100,
    // Number of random characters to show
    iterations: 0,
    // Random characters to pick from
    characters: [],
    // String to resolve
    resolveString: '...',
    // The element
    element: this.logContainer
  })

  startLogging = () => {
    this.logContainer.classList.remove('hide');
    this.logOptionsQueue = [];
    this.shouldStop = false;
  }

  stopLogging = svgElement => {
    this.shouldStop = true;

    if (svgElement) {
      document.getElementById('landmark-content').innerHTML = svgElement;
    }
  }

  stopAfter = (message) => {
    this.log(message);
    this.shouldStop = true;
    this.keepAlive = true;
  }

  immediateStop = (message) => {
    this.logOptionsQueue = [];
    stopAllResolvers();
    resolver(this.getOptions(message), () => {
      this.logContainer.textContent = message;
      this.logContainer.style.top = '50%';
      document.getElementById('root').style.justifyContent = 'flex-start';
      document.getElementById('redo-container').classList.remove('hide');
    }, true);
  }

  log = logMessage => {
    if (isEmpty(this.logOptionsQueue)) {
      this.logOptionsQueue.push(this.getStaticOptions());
      this.logOptionsQueue.push(this.getOptions(logMessage));

      resolver(this.logOptionsQueue.shift(), this.resolverCallback);

      return;
    }
    
    this.logOptionsQueue.push(this.getStaticOptions());
    this.logOptionsQueue.push(this.getOptions(logMessage));
  }

  resolverCallback = () => {
    if (isEmpty(this.logOptionsQueue) && this.shouldStop) {
      setTimeout(() => {
        const redoButton = document.getElementById('redo-container');
        const landmark = document.getElementById('landmark-content');

        redoButton.style.opacity = 0;
        redoButton.classList.remove('hide');
        landmark.style.opacity = 0;
        landmark.classList.remove('hide');

        setTimeout(() => {
          landmark.style.opacity = 1;
        }, 0);

        if (!this.keepAlive) {
          this.logContainer.classList.add('hide');
        }

        if (!this.keepAlive) {
          setTimeout(() => {
            redoButton.style.opacity = 1;
          }, 5000);
        } else {
          redoButton.style.opacity = 1;
        }
      }, 1000);

      return;
    }

    if (isEmpty(this.logOptionsQueue)) {
      return;
    }
    
    resolver(this.logOptionsQueue.shift(), this.resolverCallback);
  }
}