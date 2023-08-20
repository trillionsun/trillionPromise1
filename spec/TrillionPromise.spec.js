const {TrillionPromise} = require('../main/TrillionPromise');

describe('resolved or rejected immediately', () => {
    it('should resolve immediately', function () {
        const promise = TrillionPromise.resolve('resolved value');

        promise.then((value) => {
            expect(value).toBe('resolved value');
        });
    });

    it('should reject immediately', function () {
        const promise = TrillionPromise.reject('rejected reason');

        promise.then(() => null,
            (value) => {
                expect(value).toBe('rejected reason');
            }
        );
    });
});

function getCurrentSecond() {
    return new Date().getSeconds();
}

describe('resolved or rejected asynchronously', () => {
    it('should resolve after delay', async function () {
        const promise = new TrillionPromise((resolve, reject) => {
            setTimeout(() => resolve('should resolve after 2s'), 2000);
        });

        const currentSecond = getCurrentSecond();

        const resolvedValue = await promise;
        expect(resolvedValue).toEqual('should resolve after 2s');
        expect(getCurrentSecond()).toBe(currentSecond + 2);
    });

    it('should reject after delay',  function () {
        const promise = new TrillionPromise((resolve, reject) => {
            setTimeout(()=> reject('should reject after 2s'), 2000);
        });

        const currentSecond = getCurrentSecond();

        promise.then(()=>null, rejectedReason=> {
            console.log('rejected second is :' + getCurrentSecond());
            expect(rejectedReason).toEqual('should reject after 2s');
            expect(getCurrentSecond()).toBe(currentSecond + 1);
        });
    });
});
