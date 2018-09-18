let timeouts = [];

const setTimeout = (callback, timeout) => {
  let start = null;
  let ids = [];

  function execute(timestamp) {
    if (!start) { start = timestamp };
    const progress = timestamp - start;
    
    if (progress < timeout) {
      ids = [...ids, window.requestAnimationFrame(execute)];
    } else {
      callback();
    }

    return ids;
  }

  ids = [...ids, window.requestAnimationFrame(execute)];

  return ids;
};

const resolver = (options, callback) => {
  // The string to resolve
  const resolveString = options.resolveString;
  const combinedOptions = Object.assign({}, options, {resolveString: resolveString});

  function getRandomInteger(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
  };
  
  function randomCharacter(characters) {
    return characters[getRandomInteger(0, characters.length - 1)];
  };
  
  function doRandomiserEffect(options, callback) {
    const characters = options.characters;
    const timeout = options.timeout;
    const element = options.element;
    const partialString = options.partialString;

    let iterations = options.iterations;

    const currentTimeout = setTimeout(() => {
      if (iterations >= 0) {
        const nextOptions = Object.assign({}, options, {iterations: iterations - 1});
        // Ensures partialString without the random character as the final state.
        if (iterations === 0) {
          element.textContent = partialString;
        } else {
          // Replaces the last character of partialString with a random character
          element.textContent = partialString.substring(0, partialString.length - 1) + randomCharacter(characters);
        }

        const translateXTo = - (element.offsetWidth / 2);

        element.style.transform = `translateX(${translateXTo}px)`;
        doRandomiserEffect(nextOptions, callback)
      } else if (typeof callback === "function") {
        callback(); 
      }
    }, timeout);

    timeouts = [...timeouts, ...currentTimeout];
  };
  
  function doResolverEffect(options, callback, keepAlive) {
    const resolveString = options.resolveString;
    const characters = options.characters;
    const offset = options.offset;
    const partialString = resolveString.substring(0, offset);
    const combinedOptions = Object.assign({}, options, {partialString: partialString});

    doRandomiserEffect(combinedOptions, () => {
      const nextOptions = Object.assign({}, options, {offset: offset + 1});

      if (offset <= resolveString.length) {
        doResolverEffect(nextOptions, callback);
      } else if (typeof callback === "function") {
        setTimeout(() => {
          if (keepAlive) {
            combinedOptions.element.textContent = '';
          }

          setTimeout(() => {
            if (keepAlive) {
              combinedOptions.element.style.transform = 'translateX(0px)';
            }

            setTimeout(() => {
              callback();
            }, combinedOptions.nextCallbackTimeout || 0);
          }, 0);
        }, 0);
      }
    });
  };

  doResolverEffect(combinedOptions, callback);
}

export const stopAllResolvers = () => {
  timeouts.forEach(timeout => window.cancelAnimationFrame(timeout));
  timeouts = [];
}

export default resolver;