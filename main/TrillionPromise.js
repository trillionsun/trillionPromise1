const STATE = {
    PENDING: 'pending',
    FULFILLED: 'fulfilled',
    REJECTED: 'rejected'
}

class TrillionPromise {
    state = STATE.PENDING;
    value;
    reason;
    onResolves = [];
    onRejects = [];

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
        this.onResolves.forEach(fn => fn(value));
    }

    reject(reason) {
        this.setState(STATE.REJECTED);
        this.value = reason;
        this.onRejects.forEach(fn => fn(reason));
    }

    then(onFulfilled, onRejected) {
        return new TrillionPromise((resolve, reject) => {
            const resolvedFromLastPromise = onFulfilled(this.value);
            if (this.state === STATE.FULFILLED) {
                if (typeof onFulfilled === 'function') {
                    try {
                        const fulfilledFromLastPromise = resolvedFromLastPromise;
                        if (fulfilledFromLastPromise instanceof TrillionPromise) {
                            fulfilledFromLastPromise.then(res => resolve(res));
                            return;
                        }
                        resolve(fulfilledFromLastPromise);
                    } catch (e) {
                        reject(e);
                    }
                    return;
                }
                resolve(this.value);
            }
            if (this.state === STATE.REJECTED) {
                if (typeof onRejected === 'function') {
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
                reject(this.value);
            }
            if (this.state === STATE.PENDING) {
                addToMicroTaskQueue(this.onResolves, (value)=> {
                    try{
                    if(resolvedFromLastPromise instanceof TrillionPromise){
                        resolvedFromLastPromise.then(a=> resolve(a));
                    }else{
                        resolve(resolvedFromLastPromise);
                    }}catch (e){
                        reject(e);
                    }
                })
                addToMicroTaskQueue(this.onResolves, onFulfilled);
                addToMicroTaskQueue(this.onRejects, onRejected);
            }
        });
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

function addToMicroTaskQueue(tasks, taskToAdd) {
    setTimeout(() => tasks.push(taskToAdd));
}


// const p1 = new TrillionPromise((resolve) => {
//     resolve('resolved!');
// });
// p1.then((res) => {
//     console.log(res);
// }, (err) => {
//     console.log(err);
// });
//
// const p2 = new TrillionPromise((resolve, reject) => {
//     reject('rejected!')
// })
//
// p2.then((res) => {
//     console.log(res);
// }, (err) => {
//     console.log(err);
// });

const asyncP1 = new TrillionPromise((resolve) =>
    setTimeout(() => resolve('resolve at: ' + currentTime()), 5000));

const currentTime = ()=> new Date().getSeconds();
console.log('current time is ' + currentTime());
asyncP1.then((res) => {
    console.log(res);
}, (err) => {
    console.log('error: '+ err);
}).then(res => setTimeout(() => console.log('what about another second', +currentTime() + ' with value: ' + res), 1000));

module.exports = {TrillionPromise, STATE};