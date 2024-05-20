"use strict";

import _DiscountModel from "../discount.model.js";
import { getSelectData, unGetSelectData } from "../../utils/index.js";

const checkDiscount = async ({ model, filter }) => {
    return await model.findOne(filter).lean();
};

const findAllDiscountCodesUnSelect = async ({
    limit = 50,
    page = 1,
    sort = "ctime",
    filter,
    unSelect,
    model,
}) => {
    const skip = (page - 1) * limit;
    const sortBy = sort === "ctime" ? { _id: -1 } : { _id: 1 };
    const discounts = await model
        .find(filter)
        .sort(sortBy)
        .skip(skip)
        .limit(limit)
        .select(unGetSelectData(unSelect))
        .lean();

    return discounts;
};

const findAllDiscountCodesSelect = async ({
    limit = 50,
    page = 1,
    sort = "ctime",
    filter,
    select,
    model,
}) => {
    const skip = (page - 1) * limit;
    const sortBy = sort === "ctime" ? { _id: -1 } : { _id: 1 };
    const discounts = await model
        .find(filter)
        .sort(sortBy)
        .skip(skip)
        .limit(limit)
        .select(getSelectData(select))
        .lean();

    return discounts;
};

export {
    checkDiscount,
    findAllDiscountCodesUnSelect,
    findAllDiscountCodesSelect,
};
