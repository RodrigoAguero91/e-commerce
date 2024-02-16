import { cartsModel } from "../models/carts.model.js";

class CartManager {
    getCarts = async () => {
        try {
            return await cartsModel.find()
        } catch (err) {
            console.log(err);
        }
    };

    getCartById = async (cartId) => {
        try {

            return await cartsModel.findOne({ _id: cartId }).lean().populate("products._id")

        } catch (err) {
            return err.message
        }

    }
    addCart = async (products) => {
        try {
            const cartCreated = await cartsModel.create({})
            products.forEach(product => cartCreated.products.push(product));
            await cartCreated.save();
            return cartCreated

        }
        catch (err) {
            // console.log(err.message);
            return err.message;

        }
    }


    addProductInCart = async (cid, productFromBody) => {

        try {
            const cart = await cartsModel.findOne({ _id: cid })
            const findProduct = cart.products.some(
                (product) => product._id.toString() === productFromBody._id)

            if (findProduct) {
                await cartsModel.updateOne(
                    { _id: cid, "products._id": productFromBody._id },
                    { $inc: { "products.$.quantity": productFromBody.quantity } })
                return await cartsModel.findOne({ _id: cid })
            }

            await cartsModel.updateOne(
                { _id: cid },
                {
                    $push: {
                        products: {
                            _id: productFromBody._id,
                            quantity: productFromBody.quantity
                        }
                    }
                })
    


        }

        catch (err) {
            console.log(err.message);
            return err

        }
    }


    updateProductsInCart = async (cid, products) => {
        try {
            return await cartsModel.findOneAndUpdate(
                { _id: cid },
                { products },
                { new: true })

        } catch (err) {
            return err
        }
    }

    updateOneProduct = async (cid, products) => {
        
        await cartsModel.updateOne(
            { _id: cid },
            {products})
        return await cartsModel.findOne({ _id: cid })
    }

}



export default CartManager;