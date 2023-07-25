class TrillionPromise {
    STATE = {
        PENDING: 'pending',
        FULFILLED: 'fulfilled',
        REJECTED: 'rejected'
    }

    state = this.STATE.PENDING;
    value;
    reason;

    static setState(state) {
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

    resolve(value) {
        this.setState(STATE.FULFILLED);
        this.value = value;
    }

    reject(reason) {
        this.setState(STATE.REJECTED);
        this.reason = reason;
    }

    static then(onFulfilled, onRejected) {
        if (this.state === STATE.FULFILLED && typeof onFulfilled === Function) {
            onFulfilled(this.value);
            // return a promise?
        }
        if (this.state === STATE.REJECTED && typeof onRejected === Function) {
            onRejected(this.value);
            // return a promise?
        }
    }

    constructor(handler) {
        try {
            handler(resolve, reject);
        } catch (err) {
            reject(err);
        }
    }


}

module.exports = { TrillionPromise };