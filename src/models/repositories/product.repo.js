"use strict";

import {
    _ProductModel,
    _ClothingModel,
    _ElectronicModel,
    _FurnitureModel,
} from "../product.model.js";

const findAllDraftForShop = async ({ query, limit, skip }) => {
    return await queryProduct({ query, limit, skip });
};

const findAllPublishForShop = async ({ query, limit, skip }) => {
    return await queryProduct({ query, limit, skip });
};

const searchProductByUser = async ({ keySearch }) => {
    const regexSearch = new RegExp(keySearch);
    const results = await _ProductModel
        .find(
            {
                isPublished: true,
                $text: { $search: regexSearch },
            },
            { score: { $meta: "textScore" } }
        )
        .sort({ score: { $meta: "textScore" } })
        .lean();

    return results;
};

const publishProductByShop = async ({ product_shop, product_id }) => {
    const foundShop = await _ProductModel.findOne({
        product_shop,
        _id: product_id,
    });

    if (!foundShop) return null;

    foundShop.isDraft = false;
    foundShop.isPublished = true;

    const { modifiedCount } = await foundShop.updateOne(foundShop);

    return modifiedCount;
};

const unPublishProductForShop = async ({ product_shop, product_id }) => {
    const foundShop = await _ProductModel.findOne({
        product_shop,
        _id: product_id,
    });

    if (!foundShop) return null;

    foundShop.isDraft = true;
    foundShop.isPublished = false;

    const { modifiedCount } = await foundShop.updateOne(foundShop);

    return modifiedCount;
};

const queryProduct = async ({ query, limit, skip }) => {
    return await _ProductModel
        .find(query)
        .populate("product_shop", "name email -_id")
        .sort({ updateAt: -1 })
        .skip(skip)
        .limit(limit)
        .lean()
        .exec();
};

export {
    findAllDraftForShop,
    publishProductByShop,
    findAllPublishForShop,
    unPublishProductForShop,
    searchProductByUser,
};
