"use strict";

import { BadRequestError, NotFoundError } from "../core/error.response.js";
import _CartModel from "../models/cart.model.js";
import {
    createUserCart,
    deleteUserCartItem,
    getListUserCart,
    updateUserCartQuantity,
} from "../models/repositories/cart.repo.js";
import { getProductById } from "../models/repositories/product.repo.js";

/*
    Key Features: Cart Service
    - Add product to cart [USER]
    - Reduce product quantity by one [USER]
    - Increase product quantity by one [USER]
    - Get list to cart [USER]
    - Delete to cart [USER]
    - Delete cart item [USER]
*/

class CartService {
    // - Add product to cart [USER]
    static async addToCart({ userId, product = {} }) {
        // Check cart ton tai hay khong?
        const userCart = await _CartModel.findOne({ cart_userId: userId });
        if (!userCart) {
            // Create cart for user
            return await createUserCart({ userId, product, model: _CartModel });
        }

        // Neu co gio hang roi nhung chua co san pham?
        if (!userCart.cart_products.length) {
            userCart.cart_products = [product];
            return await userCart.save();
        }

        // Gio hang ton tai, va co san pham nay roi thi update quantity
        const { productId, quantity } = product;
        const foundProduct = userCart.cart_products.find(
            (cart) => cart.productId === productId
        );
        if (foundProduct) {
            if (quantity < 0) {
                throw new BadRequestError("Quantity must be greater than zero");
            }

            return await updateUserCartQuantity({
                userId,
                product,
                model: _CartModel,
            });
        }

        // Nếu có cart rồi thì sẽ thêm 1 sản phẩm mới vào cart_products
        return await createUserCart({ userId, product, model: _CartModel });
    }

    // Update cart
    /*
        Đây là dữ liệu từ Front end gửi về back end
        shop_order_ids: [
            {
                shopId,
                item_products: [
                    {
                        quantity,
                        price,
                        shopId,
                        productId,
                        old_quantity
                    }
                ],
                version
            }
        ]
    */

    static async addToCartV2({ userId, shop_order_ids }) {
        const { productId, quantity, old_quantity } =
            shop_order_ids[0]?.item_products[0];

        // Kiểm tra Product có tồn tại không?
        const foundProduct = await getProductById(productId);
        if (!foundProduct) throw new NotFoundError("Product not exists");

        // Kiểm tra shopId trong Product có giống shopId truyền từ payload không?
        if (
            foundProduct.product_shop.toString() !== shop_order_ids[0]?.shopId
        ) {
            throw new NotFoundError("Product do not belong to the shop");
        }

        // Nếu quantity bằng 0 thì phải xoá product
        if (quantity === 0) {
            // Deleted
            return await deleteUserCartItem({
                userId,
                productId,
                model: _CartModel,
            });
        }

        return await updateUserCartQuantity({
            userId,
            product: {
                productId,
                quantity: quantity - old_quantity,
            },
            model: _CartModel,
        });
    }

    // Delete Cart Item
    static async deleteUserCartItem({ userId, productId }) {
        return await deleteUserCartItem({
            userId,
            productId,
            model: _CartModel,
        });
    }

    // Get list user cart
    static async getListUserCart({ userId }) {
        return await getListUserCart({ userId, model: _CartModel });
    }
}

export default CartService;
