const fs = require('fs')

class CartMaganer {
    constructor(path) {
        this.path = path
    }
    addCart = async () => {
        try {
        const carrito = {
            productos: []
        }
        const data = await this.getCarritos()
        data.length === 0 ? carrito.id = 1 : carrito.id = data[data.length - 1].id + 1
        const newData = JSON.stringify([...data, carrito])
            await fs.promises.writeFile(this.path, newData, 'utf-8')
            return carrito
        }
        catch (err) {
            throw new Error("Error al crear el carrito", err)
        }
    }

    getCarritos = async () => {
        if (fs.existsSync(this.path)) {
            try {
                const data = await fs.promises.readFile(this.path)
                const dataParsed = JSON.parse(data)
                return dataParsed
            }
            catch (err) {
                throw new Error("Error al leer productos", err)
            }
        }
        else {
            await fs.promises.writeFile(this.path, '[]', 'utf-8')
            return []
        }
    }

    getCarritosById = async (id) => {
        const data = await this.getCarritos()
        const find = data.find(cart => cart.id === id)
        const idx = data.findIndex(cart => cart.id === id)
        if (find) return { find, idx }
        else throw new Error("Carrito no encontrado")
    }

    getCartProducts = async (id) => {
        try {
            const {find} = await this.getCarritosById(id)
            return find.productos
        }
        catch (err) {
            throw new Error(err.message)
        }
    }

    addProdToCart = async (cid, pid)=>{
        try{
            const carritos = await this.getCarritos()
            const {find: cart, idx} = await this.getCarritosById(cid)
            const prodFind = cart.productos.find(prod=> prod.product === pid)
            !prodFind ? cart.productos.push({product: pid, quantity: 1}) : prodFind.quantity++
            carritos[idx] = cart
            await fs.promises.writeFile(this.path, JSON.stringify(carritos), 'utf-8')
            return carritos
        }
        catch(err){
            throw new Error(err.message)
        }
    }
}

module.exports = CartMaganer