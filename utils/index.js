"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getPathById = (id, data) => {
    const tmp = [];
    for (const item of data) {
        if (item.id === id) {
            tmp.unshift(item);
            if (item.parentid) {
                tmp.unshift(exports.getPathById(item.parentid, data));
            }
        }
    }
    return tmp;
};
exports.flatten = (arr) => {
    return arr.reduce((pre, cur) => {
        if (!Array.isArray(cur)) {
            return [...pre, cur];
        }
        else {
            return [...pre, ...exports.flatten(cur)];
        }
    }, []);
};
