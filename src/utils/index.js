"use strict";

import _ from "lodash";
import { Types } from "mongoose";

const getInfoData = ({ fields = [], object = {} }) => {
    return _.pick(object, fields);
};

const convertToObjectIdMongodb = (id) => {
    return new Types.ObjectId(id);
};

const getSelectData = (select = []) => {
    return Object.fromEntries(select.map((el) => [el, 1]));
};

const unGetSelectData = (select = []) => {
    return Object.fromEntries(select.map((el) => [el, 0]));
};

const removeUndefinedObject = (object) => {
    Object.keys(object).forEach((key) => {
        if (object[key] === null) {
            delete object[key];
        }
    });

    return object;
};

/*
    object = {
        a: 1,
        b: {
            c: 2,
            d: 3,
        }
    } 

    db.updateOne({
        a: 1,
        `b.c`: 2,
        `b.d`: 3,
    }) 
*/
const updateNestedObjectParser = (obj) => {
    const final = {};
    Object.keys(obj).forEach((key) => {
        if (typeof obj[key] === "object" && !Array.isArray(obj[key])) {
            const response = updateNestedObjectParser(obj[key]);
            Object.keys(response).forEach((child) => {
                final[`${key}.${child}`] = response[child];
            });
        } else {
            final[key] = obj[key];
        }
    });

    return final;
};

export {
    getInfoData,
    getSelectData,
    unGetSelectData,
    removeUndefinedObject,
    updateNestedObjectParser,
    convertToObjectIdMongodb,
};
