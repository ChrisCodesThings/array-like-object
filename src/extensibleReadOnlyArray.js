import numberValue from '@chriscodesthings/number-value';

const defaultAllowList = [
    "length",
    "Symbol(Symbol.iterator)",
];

function handler(obj, allowList) {
    return {
        get(t, k, r) {
            if (typeof obj[k] === 'function') {

                return (...args) => { return obj[k].call(obj, ...args, t) };
            }

            if (typeof obj[k] !== 'undefined') {
                return obj[k];
            }

            if (allowList.includes(k.toString()) || numberValue(k) >= 0) {
                return Reflect.get(t, k);
            }

            return;
        },

        set(t, k, v, r) {
            return false;
        }
    };
}

export default function (arr, obj, customAllowList = []) {
    return new Proxy(arr, handler(obj, [...defaultAllowList, ...customAllowList]));
}
