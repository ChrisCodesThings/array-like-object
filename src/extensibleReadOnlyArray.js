import numberValue from '@chriscodesthings/number-value';

const alwaysAllowList = [
    "length",
    "Symbol(Symbol.iterator)",
];

const defaultAllowList = [
    "at",
    "concat",
    "entries",
    "every",
    "find",
    "findIndex",
    "findLast",
    "findLastIndex",
    "forEach",
    "includes",
    "indexOf",
    "join",
    "keys",
    "lastIndexOf",
    "map",
    "reduce",
    "reduceRight",
    "some",
    "toLocaleString",
    "toReversed",
    "toSorted",
    "toSpliced",
    "toString",
    "values",
    "with"
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

            if (numberValue(k) >= 0) {
                return t[k];
            }

            const kStr = k.toString();

            if (allowList.includes(kStr)) {
                if (typeof t[kStr] === 'function') {
                    return (...args) => { return t[k].apply(t, args); };
                }

                return t[k];
            }

            return;
        },

        set(t, k, v, r) {
            console.log(t, k, v, r);
            return false;
        }
    };
}

export default function (arr, obj, customAllowList = [], includeDefaultAllowList = true) {
    const allowList = [...alwaysAllowList, ...customAllowList];

    if (includeDefaultAllowList) {
        allowList.push(...defaultAllowList);
    }

    return new Proxy(arr, handler(obj, allowList));
}
