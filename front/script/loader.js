




function callbackLoader(asyncFunction) {
    return async function (...args) {
        loader.style.display = "block"
        try {
            const result = await asyncFunction(...args);
            loader.style.display = "none"
            return result;
        } catch (error) {
            loader.style.display = "none"
            console.error('Loader: Error', error);
        }
    };
  }

