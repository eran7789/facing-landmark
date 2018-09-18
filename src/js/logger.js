import { isEmpty, head } from 'lodash/fp';
import MobileDetect from 'mobile-detect';

import resolver, { stopAllResolvers } from 'js/resolver';

export default class Logger {
  constructor(noSleep) {
    this.noSleep = noSleep;
    this.logContainer = document.getElementById('log-container');
  }

  getOptions = (logMessage, nextTimout) => ({
    // Initial position
    offset: 0,
    // Timeout between each random character
    timeout: 0,
    // Number of random characters to show
    iterations: 2,
    // Random characters to pick from
    characters: ['$', '@', '!', ',', '#', '%', '&', '-', '+', '_', '?', '/', '\\', '=', ';'],
    // String to resolve
    resolveString: logMessage,
    // The element
    element: this.logContainer,
    nextCallbackTimeout: nextTimout || 0
  })

  getStaticOptions = () => ({
    // Initial position
    offset: 0,
    // Timeout between each random character
    timeout: 60,
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

  stopLogging = (svgElement, multipleFaces) => {
    this.shouldStop = true;

    if (svgElement) {
      const md = new MobileDetect(window.navigator.userAgent);
      const textElement = document.createElement('div');

      textElement.setAttribute('id', 'landmark-text');
      textElement.textContent = multipleFaces ? "Identities stored" : "Identity stored";

      document.getElementById('landmark').innerHTML = svgElement;

      if (md.mobile() || md.tablet()) {
        document.getElementById('landmark-content').prepend(textElement);
      } else {
        document.getElementById('landmark-content').append(textElement);
      }
    }
  }

  stopAfter = (message) => {
    this.log(message);
    this.shouldStop = true;
    this.keepAlive = true;
  }

  immediateStop = (message) => {
    this.logOptionsQueue = [];
    // stopAllResolvers();
    this.immediateStopFlag = true;
    this.immediateStopMessage = message;
    this.noSleep.disable();

    if (isEmpty( this.logOptionsQueue)) {
      this.resolverCallback();
    }
  }

  log = (logMessage, breakAfter, nextTimout) => {
    if (!this.firstLogingOccured) {
      this.firstLogingOccured = true;


      if (breakAfter) {
        this.logOptionsQueue.push(this.getStaticOptions());
      }
      resolver(this.getOptions(logMessage), this.resolverCallback, nextTimout);

      return;
    }

    if (isEmpty(this.logOptionsQueue)) {
      this.logOptionsQueue.push(this.getOptions(logMessage, nextTimout));
      if (breakAfter) {
        this.logOptionsQueue.push(this.getStaticOptions());
      }

      if (this.notRunning) {
        this.resolverCallback();
      }

      return;
    }

    this.logOptionsQueue.push(this.getOptions(logMessage, nextTimout));
    if (breakAfter) {
        this.logOptionsQueue.push(this.getStaticOptions());
      }
  }

  resolverCallback = () => {
    if (this.immediateStopFlag) {
      this.logContainer.style.transition = "";
      this.logContainer.style.transform = "";
      this.logContainer.style.position = "static";
      this.logContainer.style.left = "initial";
      this.logContainer.innerHTML = `<div style="width: 100%;">${this.immediateStopMessage}</div> <div  style="width: 100%;"><a href="">Try again</a></div>`;

      return;
    }

    if (isEmpty(this.logOptionsQueue) && this.shouldStop) {
      setTimeout(() => {
        const landmark = document.getElementById('landmark-content');

        landmark.style.opacity = 0;
        landmark.classList.remove('hide');

        setTimeout(() => {
          landmark.style.opacity = 1;
          setTimeout(() => {
            document.getElementById('landmark-text').style.opacity = 1;
            setTimeout(() => {
              const lines = document.getElementsByTagName('line');
              for (let i = 0; i < lines.length; i++) {
                lines[i].style.opacity = 0;
              }
              const polylines = document.getElementsByTagName('polyline')
              for (let i = 0; i < polylines.length; i++) {
                polylines[i].style.opacity = 0;
              }
              setTimeout(() => {
                document.body.style.transition = 'all 4s linear';
                document.body.classList.remove('black-background');
                this.noSleep.disable();
              }, 3000);
            }, 2000);
          }, 3000);
        }, 0);

        if (!this.keepAlive) {
          this.logContainer.classList.add('hide');
        }
      }, 1000);

      return;
    }

    if (isEmpty(this.logOptionsQueue)) {
      this.notRunning = true;

      return;
    }

    this.notRunning = false;
    resolver(this.logOptionsQueue.shift(), this.resolverCallback);
  }
}