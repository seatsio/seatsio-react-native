export default class Deferred {

    constructor(proxyFn) {
        if (proxyFn) {
            this.promise = new Promise((resolve, reject) => {
                this.resolve = (o) => resolve(proxyFn(o));
                this.reject = (o) => reject(proxyFn(o));
            })
        } else {
            this.promise = new Promise((resolve, reject) => {
                this.resolve = resolve
                this.reject = reject
            })
        }
    }

    then(fn) {
        return this.promise.then(fn)
    }

    catch(fn) {
        return this.promise.catch(fn)
    }
}


