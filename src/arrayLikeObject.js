import numberValue from '@chriscodesthings/number-value';

function handler(obj) {
    return {

    };
}

export default function (obj = {}, arr = []) {
    if (Array.isArray(arr)) {
        return new Proxy(Array.from(arr), handler(obj));
    };

    return;
}
