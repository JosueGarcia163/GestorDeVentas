import Invoice from "./invoice.model.js";
import Cart from "../cart/cart.model.js";
import Product from "../product/product.model.js";
import PDFDocument from "pdfkit";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url"
import User from "../user/user.model.js";


const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);


export const createInvoice = async (req, res) => {
    try {

        const user = req.usuario

        const cart = await Cart.findOne({ user: user._id }).populate("products.product")
        if (!cart) {
            return res.status(404).json({ message: "No se encontró un carrito para este usuario" });
        }

        let totalAmount = 0;
        const invoiceItems = [];

        for (const item of cart.products) {
            const { product, quantity } = item;
            const foundProduct = await Product.findById(product);

            if (!foundProduct) {
                return res.status(404).json({ message: `Producto con ID ${product} no encontrado` });
            }


            foundProduct.stock -= quantity;
            foundProduct.soldQuantity += quantity;
            await foundProduct.save();

            const price = (foundProduct.price);
            if (isNaN(price)) {
                return res.status(400).json({ message: `El precio del producto ${foundProduct.name} no es válido` });
            }

            const subtotal = price * quantity;
            totalAmount += subtotal;

            /*Esto es lo que se colocara en el array de invoiceItems para que aparezca de esta
            forma en el pdf que generaremos.*/
            invoiceItems.push({
                name: foundProduct.name,
                price: foundProduct.price,
                quantity,
                subtotal
            });
        }

        /*Aca hacemos la funcion para crear la factura dentro de la base de datos para despues proceder a 
        descargar el pdf a base de lo guardado.*/

        const newInvoice = new Invoice({
            user: user._id,
            cart: cart._id,
            totalAmount
        })

        await newInvoice.save();

        const doc = new PDFDocument();
        const invoicesDir = path.join(__dirname, "invoices");


        if (!fs.existsSync(invoicesDir)) {
            fs.mkdirSync(invoicesDir, { recursive: true });
        }

        const filePath = path.join(invoicesDir, `invoice_${newInvoice._id}.pdf`);
        const stream = fs.createWriteStream(filePath);

        doc.pipe(stream);

        //Aqui configuro el diseño del pdf que aparecera en la factura.
        doc.fontSize(20).text("Factura de Compra", { align: "center" }).moveDown();
        doc.fontSize(12).text(`Usuario: ${user.name}`);
        doc.text(`Fecha: ${new Date().toLocaleString()}`).moveDown();


        doc.text("Productos:").moveDown();
        invoiceItems.forEach((item) => {
            doc.text(`${item.name} - ${item.quantity} x Q${item.price} = Q${item.subtotal}`);
        });

        doc.moveDown();
        doc.text(`Total: Q${totalAmount}`, { bold: true });

        doc.end();


        stream.on("finish", () => {
            res.download(filePath, `invoice_${newInvoice._id}.pdf`, (err) => {
                if (err) {
                    res.status(500).json({ message: "Error al descargar la factura", error: err.message });
                }


            });
        });

    } catch (error) {
        res.status(500).json({ message: 'Error al crear el factura.', error: error.message });
    }
};

export const updateInvoice = async (req, res) => {
    try {
        const { id } = req.params;
        const { products } = req.body;
        let totalAmount = 0;


        const invoice = await Invoice.findById(id).populate("cart");
        if (!invoice) {
            return res.status(404).json({ success: false, msg: "Factura no encontrada" });
        }


        const cart = await Cart.findById(invoice.cart).populate("products.product");
        if (!cart) {
            return res.status(404).json({ success: false, msg: "Carrito no encontrado" });
        }


        const updatedProducts = [];

        for (const item of products) {
            const { name, quantity } = item;


            const product = await Product.findOne({ name });

            if (!product) {
                return res.status(404).json({ msg: `Producto con nombre "${name}" no encontrado` });
            }

            if (quantity > product.stock) {
                return res.status(400).json({ msg: `Stock insuficiente para "${product.name}"` });
            }

            //Aqui disminuyo la cantidad de stock del producto y aumento la cantidad vendida.
            product.stock -= quantity;
            await product.save();

            totalAmount += product.price * quantity;


            updatedProducts.push({
                product: product._id,
                quantity
            });
        }


        cart.products = updatedProducts;
        await cart.save();


        invoice.totalAmount = totalAmount;
        await invoice.save();

        res.status(200).json({
            success: true,
            msg: "Factura actualizada correctamente",
            invoice,
        });

    } catch (error) {
        res.status(500).json({ success: false, msg: "Error al actualizar la factura", error: error.message });
    }
};


export const getInvoiceById = async (req, res) => {
    try {
        const { _id } = req.usuario;

        const invoice = await Invoice.find({ user: _id })
            /*Aqui populo el carrito para que aparezca en la factura.
            ademas de esto populo tambien el array de productos que tiene
            adentro esto con el fin de poder traer los nombre y precio que 
            estan dentro del array de productos.
            */
            .populate({
                path: "cart",
                populate: {
                    path: "products.product",
                    select: "name price"
                }
            })
            .populate("user")
            .populate("totalAmount");

        if (!invoice) {
            return res.status(404).json({
                success: false,
                message: "Carrito no encontrado"
            });
        }

        return res.status(200).json({
            success: true,
            invoice
        });

    } catch (err) {
        return res.status(500).json({
            success: false,
            message: "Error al obtener su factura",
            error: err.message
        });
    }
};


export const getInvoiceOfUser = async (req, res) => {
    try {

        const { username } = req.body

        const user = await User.findOne({ username });

        if (!user) {
            return res.status(404).json({
                success: false,
                message: "Usuario no encontrado"
            });
        }

        const invoice = await Invoice.find({ user: user._id })
            .populate({
                path: "cart",
                populate: {
                    path: "products.product",
                    select: "name price"
                }
            })
            .populate("user")
            .populate("totalAmount");

        if (!invoice) {
            return res.status(404).json({
                success: false,
                message: "Carrito no encontrado"
            });
        }

        return res.status(200).json({
            success: true,
            invoice
        });

    } catch (err) {
        return res.status(500).json({
            success: false,
            message: "Error al obtener la factura",
            error: err.message
        });
    }
};

export const getProductsByInvoiceId = async (req, res) => {
    try {
        const { id } = req.params;


        const invoice = await Invoice.findById(id)
            .populate({
                path: "cart",
                populate: {
                    path: "products.product",
                    select: "name price description"
                }
            });


        if (!invoice) {
            return res.status(404).json({
                success: false,
                message: "Factura no encontrada"
            });
        }

        /*Aqui obtenemos los productos que estan dentro del carrito que a la vez 
        esta dentro de factura entonces lo que hacemos es un recorrido por medio 
        de item el cual nos va retornando los datos del producto que necesitamos
        segun el id de la factura que recibimos el params*/
        const products = invoice.cart.products.map(item => ({
            name: item.product.name,
            price: item.product.price,
            description: item.product.description,
            quantity: item.quantity
        }));

        return res.status(200).json({
            success: true,
            products
        });

    } catch (err) {
        return res.status(500).json({
            success: false,
            message: "Error al obtener los productos de la factura",
            error: err.message
        });
    }
};













