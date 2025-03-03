import Category from "../category/category.model.js";
import Product from "./product.model.js";


export const createProduct = async (req, res) => {
    try {
        //desestructuramos los objetos del req.body de producto.
        const { name, stock, text, price, category } = req.body;
        const user = req.usuario

        // validacion para confirmar que el rol del usuario para crear productos sea unicamente el admin.
        if (user.role !== 'ADMIN_ROLE') {
            return res.status(403).json({ message: 'Los productos los pueden crear unicamente los admin' });
        }

        const existingCategory = await Category.findOne({ name: category })
        if (!existingCategory) {
            return res.status(404).json({ message: "No se encontro categoria en la db" });
        }

        const product = new Product({
            name,
            stock,
            text,
            price,
            category: existingCategory._id
        });

        await product.save();

        res.status(200).json({
            success: true,
            product
        });
    } catch (error) {
        res.status(500).json({ message: 'Error al crear el producto.', error: error.message });
    }
};


export const getProduct = async (req, res) => {
    try {

        const query = { status: true };
        const product = await Product.find(query)
            //Buscamos el atributo name y description por medio del campo que hace referenca a categorias dentro de producto
            .populate("category", "name description")

        return res.status(200).json({
            success: true,
            product
        })
    } catch (err) {
        return res.status(500).json({
            success: false,
            message: "Error al obtener los productos",
            error: err.message
        })
    }
}

export const getProductById = async (req, res) => {
    try {
        const { id } = req.params
        const product = await Product.findById(id)

            //Buscamos el atributo name y description por medio del campo que hace referenca a categorias dentro de publicacion
            .populate("category", "name description")

            //Envio un 200 para dar un ok.
        return res.status(200).json({
            success: true,
            product
        })
    } catch (err) {
        return res.status(500).json({
            success: false,
            message: "Error al obtener el producto",
            error: err.message
        })
    }
}

export const getProductOutStock = async (req, res) => {
    try {
        const products = await Product.find({ stock: 0 })

            //Buscamos el atributo name y description por medio del campo que hace referenca a categorias dentro de publicacion
            .populate("category", "name description")

            //Si todo funciona enviamos un 200 o ok.
        return res.status(200).json({
            success: true,
            products
        })
    } catch (err) {
        return res.status(500).json({
            success: false,
            message: "Error al obtener los productos agotados.",
            error: err.message
        })
    }
}


export const getProductMoreSeller = async (req, res) => {
    try {
        const products = await Product.find()
            .sort({ soldQuantity: -1 })
            //Buscamos el atributo name y description por medio del campo que hace referenca a categorias dentro de publicacion
            .populate("category", "name description")

            //Si todo funciona enviamos un 200 o ok.
        return res.status(200).json({
            success: true,
            products
        })
    } catch (err) {
        return res.status(500).json({
            success: false,
            message: "Error al obtener los productos mas vendidos.",
            error: err.message
        })
    }
}


export const updateProduct = async (req, res) => {
    try {
        //extraemos el id del params
        const { id } = req.params;
        // desestructuramos los campos del body
        const { name, stock, text, price, category } = req.body;
        
        //Buscamos un producto por medio del id del params
        const product = await Product.findById(id)

        if (!product) {
            return res.status(404).json({
                success: false,
                msg: "Producto no encontrada",
            });
        }

        //Busco la categoria por nombre y la guardo en "existingCategory" para poder actualizarla
        const existingCategory = await Category.findOne({ name: category })
        if (!existingCategory) {
            return res.status(404).json({ message: "No se encontro categoria en la db, es necesario colocar la categoria" });
        }

        //Actualizo los parametros dentro de la base de datos. 
        product.name = name || product.name;
        product.stock = stock || product.stock;
        product.text = text || product.text;
        product.price = price || product.price;
        product.category = existingCategory._id;

        //Guardo el producto en la base de datos
        await product.save();

        res.status(200).json({
            success: true,
            msg: 'Producto Actualizado',
            product,
        });

    } catch (error) {
        return res.status(500).json({
            success: false,
            msg: "Error al actualizar el producto",
            error,
        });
    }
}


export const deleteProduct = async (req, res) => {
    try {
        const { id } = req.params;

        const product = await Product.findById(id)

        //validamos que la publicacion no venga vacia.
        if (!product) {
            return res.status(404).json({
                success: false,
                message: "Producto no encontrado"
            });
        }

        //Validamos para ver si la publicacion ya esta eliminada.
        if (product.status == "false") {
            return res.status(400).json({
                success: false,
                message: "El producto ya ha sido eliminada previamente."
            })
        }

        const updateProduct = await Product.findByIdAndUpdate(
            id,
            { status: false },
            { new: true }
        )
        return res.status(200).json({
            success: true,
            message: "Producto eliminado.",
            product: updateProduct
        })

    } catch (error) {
        return res.status(500).json({
            success: false,
            msg: "Error al eliminar le producto",
            error,
        });
    }
}

















