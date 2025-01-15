export default class Deferred {
    private promise: Promise<any>
    public resolve!: (o: any) => any
    public reject!: (o: any) => any

    constructor(proxyFn?: (o: any) => any) {
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

    then(fn: () => any) {
        return this.promise.then(fn)
    }

    catch(fn: () => any) {
        return this.promise.catch(fn)
    }
}


