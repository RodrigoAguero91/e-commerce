import { promises as fs} from "fs"
import { nanoid } from "nanoid";
import ProductManager from "./ProductManager.js"

const productALL = new ProductManager


class CartManager {
    constructor() {
        this.path = "./src/dao/fileSystem/models/carts.json";
    }

    readCarts = async() => {
        let carts = await fs.readFile(this.path, "utf-8");
        return JSON.parse(carts);
    }

    writeCarts= async (cart) => {
        await fs.writeFile(this.path, JSON.stringify(cart))
    }

    exist = async (id) => {
        let carts = await this.readCarts();
        return carts.find(cart => cart.id ===id)
    }

    addCarts = async () => {
        let cartsOld = await this.readCarts();
        let id = nanoid()
        let cartsConcat =[{id:id, products:[]}, ...cartsOld]
        await this.writeCarts(cartsConcat)
        return "Carrito Agregado"
    }

    getCartsById = async (id) => {
        let cartById = await this.exist(id)
        if(!cartById) return "Carrito no encontrado"
        return cartById
    }

    addProductInCart = async ( cartId, productId) => {
        let cartById = await this.exist(cartId)
        if(!cartById) return "Carrito no encontrado"
        let productById = await productALL.exist(productId)
        if(!cartById) return "Producto no encontrado"

        let cartsALL = await this.readCarts()
        let cartFilter = cartsALL.filter( (cart)=> cart.id != cartId)

        if(cartById.products.some(prod => prod.id === productId)) {
            let otroProductInCart = cartById.products.find
            (prod => prod.id === productId)
            otroProductInCart.cantidad++
            console.log(otroProductInCart.cantidad)
            let cartsConcat =[cartById, ...cartFilter]
            await this.writeCarts(cartsConcat)
            return "Producto  sumado al carrito"
            
        }
        
        cartById.products.push({id:productById.id, cantidad : 1})
        let cartsConcat =[cartById, ...cartFilter]
        await this.writeCarts(cartsConcat)
        return "Producto agregado al carrito"
    }

 
}



export default CartManager