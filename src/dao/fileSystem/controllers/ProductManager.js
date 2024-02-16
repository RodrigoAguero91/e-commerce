import {promises as fs} from "fs"
import { nanoid } from "nanoid"

class ProductManager {
    constructor(){
        this.patch = "./src/dao/fileSystem/models/carts.json"
    }

    readProdcuts = async () => {
        let products = await fs.readFile(this.patch,"utf-8")
        return JSON.parse(products)
    }

    writeProducts = async (product) =>{
        await fs.writeFile(this.patch, JSON.stringify(product))
    }

    exist = async (id)=>{
        let products = await this.readProdcuts()
        return products.find(prod => prod.id === id)
    }

    addProducts = async (product) =>{
        let productOld = await this.readProdcuts()
        product.id = nanoid()
        let productAll = [...productOld, product]
        await this.writeProducts(productAll)
        return "Producto agregado"
    }

    getProducts = async () =>{
        return await this.readProdcuts()

    }

    getProductsById = async (id) =>{
        let productById = await this.exist(id)
        if(!productById) return "Producto no encontrado"
        return productById

    }

    

    updateProduct = async (id, product) =>{
        let productById = await this.exist(id)
        if(!productById) return "Producto no encontrado"
        await this.deleteProduct(id)
        let productOld = await this.readProdcuts()
       let products = [{...product, id : id}, ...productOld]
       await this.writeProducts(products)
       return "Producto actualizado"
       
    }

    deleteProduct = async (id) =>{
        let products = await this.readProdcuts()
        let existProducts = products.some(prod => prod.id === id)
        if(existProducts){
        let filterProducts = products.filter(prod => prod.id != id)
        await this.writeProducts(filterProducts)
        return "Producto eliminado"
    }
    return "El producto que quiere eliminar no existe"
    }
}

  


export default ProductManager







    

