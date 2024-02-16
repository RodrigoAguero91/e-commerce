import { Router } from 'express';
import ProductManager from '../dao/db/controllers/productManagerMongo.js';
import CartManager from "../dao/db/controllers/cartManagerMongo.js"
import { __dirname } from '../utils.js';

const pm=new ProductManager()
const cm=new CartManager()
const routerV = Router()

let cart = []


routerV.get("/",async(req,res)=>{
    const listadeproductos=await pm.getProductsView()
    res.render("home",{listadeproductos})
})




     


routerV.get('/products/inCart', async (req, res) => {

    const productsInCart = await Promise.all(cart.map(async (product) => {
        const productDB = await pm.getProductById(product._id);
        return { title: productDB.title, quantity: product.quantity }
    }))

    return res.send({ cartLength: cart.length, productsInCart })
})

    routerV.post('/products', async (req, res) => {
        try {
            const { product, finishBuy } = req.body
            
            if (product) {
                if (product.quantity > 0) {
                    const findId = cart.findIndex(productCart => productCart._id === product._id);
                    (findId !== -1) ? cart[findId].quantity += product.quantity : cart.push(product)
                }
                else {
                    return res.render('products', { message: 'Quantity must be greater than 0' })
                }
            }
            if (finishBuy) {
                await cm.addCart(cart)
                
                cart.splice(0, cart.length)
            }

            return res.render('products')
        } catch (error) {
            console.log(error);
        }
    })

routerV.get("/realtimeproducts",(req,res)=>{
res.render("realtimeproducts")
})



routerV.get("/chat",(req,res)=>{
    res.render("chat")
})

routerV.get('/carts/:cid', async (req, res) => {
    try {
        const { cid } = req.params

        const result = await cm.getCartById(cid)
        
        if(result === null || typeof(result) === 'string') return res.render('cart', { result: false, message: 'ID not found' });

        return res.render('cart', { result });


    } catch (err) {
        console.log(err);
    }

})

export default routerV