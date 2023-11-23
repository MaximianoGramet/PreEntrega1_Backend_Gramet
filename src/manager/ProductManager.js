import { error } from "console";
import fs, { writeFile } from "fs";


class ProductManager{
    constructor(filename){
        this.filename=filename
        if(fs.existsSync(filename)){
            try{
                let Products = fs.readFileSync(filename,"utf-8")
                this.Products = JSON.parse(Products)
            }catch (error){
                this.Products=[]
            }
        }else{
            this.Products=[]
        }
        this.idcounter = this.findMaxProductId() + 1;
    }

    findMaxProductId() {
        let maxId = 0;
    
        for (const product of this.Products) {
          if (product.id > maxId) {
            maxId = product.id;
          }
        }
    
        return maxId;
    }

    async SaveFile(data){
        try{
            await fs.promises.writeFile(
                this.filename,
                JSON.stringify(data,null,"\t")
            )
            return true
        }catch (error){
            console.log(error);
            return false
        }
    }


    async addProduct(product){
        
        if(!product){
            throw new error("The product doesn't exist")
        }

        const check = this.Products.find((element) => element.code == product.code)
        if(check){
            throw new Error("Already existing product")
        }
        product.id = this.idcounter++;
        product.status=true
        this.Products.push(product)
        const response= await this.SaveFile(this.Products)

        if(!response){
            throw new Error("Product couldn't be created");
        }
    }

    getProductById(id){
        const product = this.Products.find(prod => prod.id == id);
        if (!product){
            throw new Error("Producto no encontrado");
        }
        return product || null; 
    }

    deleteProduct(id){
        const productDelete = this.Products.findIndex((product) => product.id === id);
        if(productDelete)
        {
            this.Products.splice(productDelete,1)
            if (this.SaveFile(this.Products)) {
                console.log("Producto eliminado")
            } else{
                throw new Error("Producto no encontrado");
            }
        }    
    }

    async editProduct(id, updatedProduct) {
        const productToEdit = this.getProductById(id);


        if (productToEdit) {
            const index = this.Products[this.Products.length - 1].id + 1;
            console.log(this.Products[index].stock)


            let titleP = updatedProduct.title == null ? this.Products[index].title : updatedProduct.title;
            let descriptionP = updatedProduct.desc == null ? this.Products[index].desc : updatedProduct.desc;
            let codeP = updatedProduct.code == null ? this.Products[index].code : updatedProduct.code;
            let priceP = isNaN(updatedProduct.price) ? this.Products[index].price : updatedProduct.price;
            let stockP = updatedProduct && updatedProduct.stock != null ? updatedProduct.stock : this.Products[index].stock;
            let categoryP = updatedProduct.category == null ? this.Products[index].category : updatedProduct.category;
            let statusP = updatedProduct.status == null ? this.Products[index].status : updatedProduct.status;
            let thumbnailsP = updatedProduct.thumbnail == null ? this.Products[index].thumbnail : updatedProduct.thumbnail;

            this.Products[index] = { 
              ...this.Products[index],
              title: titleP, 
              description: descriptionP, 
              code: codeP, 
              price: Number(priceP), 
              stock: Number(stockP), 
              status: statusP,
              category: categoryP,
              thumbnail: thumbnailsP 
            }


            const response = await this.SaveFile(this.Products);
            if (response) {
                console.log("Producto editado con éxito");
            } else {
                throw new Error("Failure at editing");
            }
        } else {
            throw new Error("Product not found");
        }
    }

    ConsultarProductos(){
        console.log(this.Products);
        return this.Products;
    }
}

class Product {
    constructor(code,title,desc,price,status,thumbnail,stock,category){
        this.id=null;
        this.code=code;
        this.title=title;
        this.desc=desc;
        this.price=price;
        this.status=status;
        this.thumbnail=thumbnail;
        this.stock=stock;  
        this.category=category;
    }
}

export {ProductManager,Product}
