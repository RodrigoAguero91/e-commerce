import { Router} from 'express';
import CartManager from '../Dao/db/controllers/Mongo/cartManagerMongo.js';
import ProductManager from '../Dao/db/controllers/Mongo/productManagerMongo.js';
const routerC = Router()
const cm = new CartManager()
const pm = new ProductManager()

// ENDPOINT Auxiliar para corroborar todos los carritos y hacer diferentes pruebas
routerC.get('/carts', async (req, res) => {
    const result = await cm.getCarts()
    return res.status(200).send(result)
})
// ENDPOINT Que devuelve un carrito
routerC.get('/carts/:cid', async (req, res) => {
    try {
        const { cid } = req.params
        
        const result = await cm.getCartById(cid)
        
        // Si el resultado del GET tiene la propiedad 'CastError' devuelve un error
        if(result === null || typeof(result) === 'string') return res.status(404).send({status:'error', message: 'ID not found' });
        

        // Resultado
        return res.status(200).send(result);
    } catch (err) {
        console.log(err);
    }

})

// ENDPOINT para crear un carrito con o sin productos
routerC.post('/carts', async (req, res) => {
    try {
        const { products } = req.body
        console.log(products)

        
        if (!Array.isArray(products)) return res.status(400).send({ status: 'error', message: 'TypeError' });

        // Corroborar si todos los ID de los productos existen
        const results = await Promise.all(products.map(async (product) => {
            const checkId = await pm.getProductById(product._id);
            if (checkId === null || typeof(checkId) === 'string') return res.status(404).send({status: 'error', message: `The ID product: ${product._id} not found`})
        }))

        const check = results.find(value => value !== undefined)
        if (check) return res.status(404).send(check)

        const cart = await cm.addCart(products)
        
                
        res.status(200).send(cart);

    }
    catch (err) {
        console.log(err);
    }
})


// ENDPOINT para colocar la cantidad de un producto
routerC.post('/carts/:cid/products/:pid', async (req, res) => {
    try {
        
        let { cid, pid } = req.params
        const { quantity } = req.body
        


        if (quantity < 1) return res.status(400).send({status:'error', payload:null, message:'The quantity must be greater than 1'})
        
        const checkIdProduct = await pm.getProductById(pid);
        

        if (checkIdProduct === null || typeof(checkIdProduct) === 'string') return res.status(404).send({status: 'error', message: `The ID product: ${pid} not found`})
    
        const checkIdCart = await cm.getCartById(cid)

        if (checkIdCart === null || typeof(checkIdCart) === 'string') return res.status(404).send({status: 'error', message: `The ID cart: ${cid} not found`})
    
        const result = await cm.addProductInCart(cid, { _id: pid, quantity })
        
        return res.status(200).send({message:`added product ID: ${pid}, in cart ID: ${cid}`, cart: result});

    } catch (error) {
        console.log(error);
    }
})

// ENDPOINT que actualiza la lista de productos 
routerC.put('/carts/:cid', async (req, res) =>{
    try {
        const { cid } = req.params
        const {products} = req.body
        
        const results = await Promise.all(products.map(async (product) => {
            const checkId = await pm.getProductById(product._id);
            
            if (checkId === null || typeof(checkId) === 'string') {
                return res.status(404).send({status: 'error', message: `The ID product: ${product._id} not found`})
            }
        }))
        const check = results.find(value => value !== undefined)
        if (check) return res.status(404).send(check)

    
        const checkIdCart = await cm.getCartById(cid)
        if (checkIdCart === null || typeof(checkIdCart) === 'string') return res.status(404).send({status: 'error', message: `The ID cart: ${cid} not found`})
        
        const cart = await cm.updateProductsInCart(cid, products)
        return res.status(200).send({status:'success', payload:cart})
    } catch (error) {
        console.log(error);
    }
    
})

export default routerC