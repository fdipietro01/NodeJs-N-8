const { Types } = require("mongoose");
const modeloCarrito = require("../../models/carritoModel");

class CartMaganer {
  addCart = async () => {
    try {
      return await modeloCarrito.create({});
    } catch (err) {
      throw new Error("Error al crear el carrito", err);
    }
  };

  getProductsfromCart = async (cid) => {
    try {
      const carrito = await modeloCarrito.findOne({ _id: cid }).lean();
      if (!carrito) throw new Error("No existe el carrito con ese Id");
      //mapping response
      let products;
      if (carrito.productos.length === 0) products = [];
      else {
        products = carrito.productos.map(({ product, quantity }) => {
          const newProd = { ...product, _id: product._id.toString(), quantity };
          return newProd;
        });
      }
      return products;
    } catch (err) {
      console.log(err.message);
      throw new Error("Error al leer productos", err);
    }
  };

  updateProductQuantityFromCart = async (cid, pid, quantity) => {
    try {
      const cart = await modeloCarrito.findOne({ _id: cid });

      const index = cart.productos.findIndex(
        (obj) => obj.product._id.toString() === pid
      );
      if (index !== -1) {
        cart.productos[index].quantity = quantity;
      } else {
        cart.productos.push({ product: pid, quantity });
      }
      await modeloCarrito.findByIdAndUpdate({ _id: cid }, cart);
    } catch (err) {
      console.log(err);
      throw new Error("Error al actualizar cantidad en productos", err.message);
    }
  };

  updateProductsFromCart = async (cid, productos) => {
    productos.forEach(element => {element.product = Types.ObjectId(element.product)
    });
    try {
      await modeloCarrito.findOneAndUpdate({ _id: cid }, { productos });
    } catch (err) {
      console.log(err);
      throw new Error("Error al actualizar colección productos", err.message);
    }
  };

  deleteSingleProductFromCart = async (cid, pid) => {
    try {
      const cart = await modeloCarrito.findOne({ _id: cid });
      cart.productos = cart.productos.filter(
        (prod) => prod.product._id.toString() !== pid
      );
      await modeloCarrito.findByIdAndUpdate({ _id: cid }, cart);
    } catch (err) {
      console.log(err);
      throw new Error("Error al eleminar producto en carrito", err.message);
    }
  };

  deleteAllProductsFromCart = async (cid) => {
    try {
      await modeloCarrito.findByIdAndUpdate({ _id: cid }, { productos: [] });
    } catch (err) {
      console.log(err);
      throw new Error("Error al eliminar productos en carrito", err.message);
    }
  };
}

module.exports = CartMaganer;
