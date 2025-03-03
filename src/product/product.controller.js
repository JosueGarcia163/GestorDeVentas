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








