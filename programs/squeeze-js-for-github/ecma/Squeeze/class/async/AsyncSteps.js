/**
 * AsyncSteps : Calls an eventual function of steps
    -use functional args for error(), done(), promise()
 * @returns {Promise) a Promise object
 */

class AsyncSteps {
    constructor(mainObject, options) {

        const error = options.error || options.err || options.onerror;
        const ondone = options.done || options.ondone;

        const chunk = options.chunk || options.onchunk;

        const promise = new Promise((done, error) => {

            mainObject.onerror = () => error(mainObject.__errorMessage);

            mainObject.onchunk = () => chunk(mainObject.iterables);

            mainObject.ondone = () => ondone(mainObject.iterables);

            });

        this.__promise = promise;

    }
}