"use strict";

import {
    _ProductModel,
    _ClothingModel,
    _ElectronicModel,
    _FurnitureModel,
} from "../product.model.js";
import {
    convertToObjectIdMongodb,
    getSelectData,
    unGetSelectData,
} from "../../utils/index.js";

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

const findAllProducts = async ({ limit, sort, page, filter, select }) => {
    const skip = (page - 1) * limit;
    const sortBy = sort === "ctime" ? { _id: -1 } : { _id: 1 };
    const products = await _ProductModel
        .find(filter)
        .sort(sortBy)
        .skip(skip)
        .limit(limit)
        .select(getSelectData(select))
        .lean();

    return products;
};

const findProduct = async ({ product_id, unSelect }) => {
    return await _ProductModel
        .findById(product_id)
        .select(unGetSelectData(unSelect));
};

const getProductById = async (productId) => {
    return await _ProductModel.findOne({
        _id: convertToObjectIdMongodb(productId),
    });
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

const updateProductById = async ({
    productId,
    payload,
    model,
    isNew = true,
}) => {
    return await model.findByIdAndUpdate(productId, payload, {
        new: isNew,
    });
};

const checkProductByServer = async (products) => {
    return await Promise.all(
        products.map(async (product) => {
            const foundProduct = await getProductById(product.productId);
            if (foundProduct) {
                return {
                    price: foundProduct.product_price,
                    quantity: product.quantity,
                    productId: product.productId,
                };
            }
        })
    );
};

export {
    findAllDraftForShop,
    publishProductByShop,
    findAllPublishForShop,
    unPublishProductForShop,
    searchProductByUser,
    findAllProducts,
    findProduct,
    updateProductById,
    getProductById,
    checkProductByServer,
};
