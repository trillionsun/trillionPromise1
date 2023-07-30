const STATE = {
    PENDING: 'pending',
    FULFILLED: 'fulfilled',
    REJECTED: 'rejected'
}

class TrillionPromise {
    state = STATE.PENDING;
    value;
    reason;

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

    resolve(value) {
        this.setState(STATE.FULFILLED);
        this.value = value;
    }

    reject(reason) {
        this.setState(STATE.REJECTED);
        this.value = reason;
    }

    then(onFulfilled, onRejected) {
        if (this.state === STATE.FULFILLED && typeof onFulfilled === 'function' ) {
            onFulfilled(this.value);
            return;
            // return a promise?
        }
        if (this.state === STATE.REJECTED && typeof onRejected === 'function') {
            onRejected(this.value);
            // return a promise?
        }
    }

    constructor(handler) {
        try {
            //Q1: bind the resolve and reject to instance otherwise it will be undefined
            this.resolve = this.resolve.bind(this);
            this.reject = this.reject.bind(this);
            handler(this.resolve, this.reject);
        } catch (err) {
            this.reject(err);
        }
    }

}

const p1 = new TrillionPromise((resolve) => {
    resolve('resolved!');
});
p1.then((res) => {
    console.log(res);
}, (err) => {
    console.log(err);
});

const p2 = new TrillionPromise((resolve, reject) => {
    reject('rejected!')
})

p2.then((res) => {
    console.log(res);
}, (err) => {
    console.log(err);
});

module.exports = {TrillionPromise, STATE};