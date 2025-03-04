import Invoice from "./invoice.model.js";
import Cart from "../cart/cart.model.js";
import Product from "../product/product.model.js";
import PDFDocument from "pdfkit";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url"


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
            doc.text(`${item.name} - ${item.quantity} x $${item.price} = $${item.subtotal}`);
        });

        doc.moveDown();
        doc.text(`Total: $${totalAmount}`, { bold: true });

        doc.end();


        stream.on("finish", () => {
            res.download(filePath, `invoice_${newInvoice._id}.pdf`, (err) => {
                if (err) {
                    res.status(500).json({ message: "Error al descargar la factura", error: err.message });
                }

                fs.unlinkSync(filePath);
            });
        });

    } catch (error) {
        res.status(500).json({ message: 'Error al crear el factura.', error: error.message });
    }
};
