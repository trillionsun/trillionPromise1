const STATE = {
    PENDING: 'pending',
    FULFILLED: 'fulfilled',
    REJECTED: 'rejected'
}

class TrillionPromise {
    state = STATE.PENDING;
    value;
    onResolveCallBacks = [];
    onRejectCallBacks = [];

    setState(state) {
        if (this.state !== STATE.PENDING) {
            throw new Error('state of this promise cannot be updated!');
        }
        switch (state) {
            case STATE.FULFILLED:
                this.state = STATE.FULFILLED;
                break;
            case STATE.REJECTED:
                this.state = STATE.REJECTED;
                break;
            default:
                throw new Error('wrong state to be, the changed state must be fulfilled or rejected');
        }
    }

    onResolve(value) {
        this.setState(STATE.FULFILLED);
        this.value = value;
        if (this.onResolveCallBacks && this.onResolveCallBacks.length) {
            this.onResolveCallBacks.forEach(fn=> fn(value));
        }
    }

    onReject(reason) {
        this.setState(STATE.REJECTED);
        this.value = reason;
        if (this.onRejectCallBacks && this.onRejectCallBacks.length) {
            this.onRejectCallBacks.forEach(fn=> fn(reason));
        }
    }

    then(onResolved, onRejected) {
        return new TrillionPromise((resolve, reject) => {

            if (this.state === STATE.FULFILLED) {
                try {
                    const resolvedFromLastPromise = onResolved(this.value);
                    if (resolvedFromLastPromise instanceof TrillionPromise) {
                        resolvedFromLastPromise.then(res => resolve(res));
                        return;
                    }
                    resolve(resolvedFromLastPromise);
                } catch (e) {
                    reject(e);
                }
                return;
            }
            if (this.state === STATE.REJECTED) {
                try {
                    const rejectedFromLastPromise = onRejected(this.value);
                    if (rejectedFromLastPromise instanceof TrillionPromise) {
                        rejectedFromLastPromise.then(null, rej => reject(rej));
                        return;
                    }
                    reject(this.value);
                } catch (e) {
                    reject(e);
                }
                return;
            }
            if (this.state === STATE.PENDING) {
                registerCallBack(() => {
                    try {
                        const resolvedFromLastPromise = onResolved(this.value);
                        if (resolvedFromLastPromise instanceof TrillionPromise) {
                            resolvedFromLastPromise.then(resolve, reject);
                        } else {
                            resolve(resolvedFromLastPromise);
                        }
                    } catch (e) {
                        reject(e);
                    }
                }, this.onResolveCallBacks);
                registerCallBack(() => {
                    try {
                        const rejectedFromLastPromise = onRejected(this.value);
                        if (rejectedFromLastPromise instanceof TrillionPromise) {
                            rejectedFromLastPromise.then(resolve, reject);
                        } else {
                            reject(rejectedFromLastPromise);
                        }
                    } catch (e) {
                        reject(e);
                    }
                }, this.onRejectCallBacks);
            }
        });
    }

    constructor(handler) {
        this.onResolve = this.onResolve.bind(this);
        this.onReject = this.onReject.bind(this);
        handler(this.onResolve, this.onReject);
    }

    static resolve(value) {
        return new TrillionPromise(resolve => resolve(value));
    }

    static reject(value) {
        return new TrillionPromise((_, reject) => reject(value));
    }

}

function registerCallBack(taskToExecute, callbacks) {
    setTimeout(() => {
        callbacks.push(taskToExecute);
    }, 0);
}

module.exports = {TrillionPromise, STATE};

function getCurrentSecond() {
    return new Date().getSeconds();
}

const promise = new TrillionPromise((resolve, reject) => {
    setTimeout(()=> reject('should reject after 2s'), 2000);
});

const currentSecond = getCurrentSecond();
console.log('current second is :' + getCurrentSecond());
promise.then(()=> null, reason=> {
    const rejectedReason = reason;
    console.log('rejected second is :' + getCurrentSecond());
} );


