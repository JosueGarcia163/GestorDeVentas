import { Router } from "express"
import { createInvoice, updateInvoice, getInvoiceById, getInvoiceOfUser, getProductsByInvoiceId } from "./invoice.controller.js"
import { createInvoiceValidator, updateInvoiceValidator, getInvoiceValidator, getInvoiceOfUserValidator } from "../middlewares/invoice-validator.js"


const router = Router()

/**
 * @swagger
 * /createInvoice:
 *   post:
 *     summary: Crear una nueva factura.
 *     description: Crea una nueva factura para el usuario autenticado.
 *     tags:
 *       - Invoice
 *     responses:
 *       200:
 *         description: Factura creada exitosamente.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 message:
 *                   type: string
 *                 invoice:
 *                   type: object
 *                   properties:
 *                     _id:
 *                       type: string
 *                     user:
 *                       type: string
 *                     cart:
 *                       type: string
 *                     totalAmount:
 *                       type: number
 *       400:
 *         description: Error en la solicitud.
 *       500:
 *         description: Error al crear la factura.
 */

router.post("/createInvoice", createInvoiceValidator, createInvoice)

/**
 * @swagger
 * /updateInvoice/{id}:
 *   put:
 *     summary: Actualizar una factura.
 *     description: Actualiza los detalles de una factura existente.
 *     tags:
 *       - Invoice
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         description: ID de la factura a actualizar.
 *         schema:
 *           type: string
 *     requestBody:
 *       description: Los datos necesarios para actualizar la factura.
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               products:
 *                 type: array
 *                 items:
 *                   type: object
 *                   properties:
 *                     name:
 *                       type: string
 *                     quantity:
 *                       type: integer
 *             required:
 *               - products
 *     responses:
 *       200:
 *         description: Factura actualizada exitosamente.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 message:
 *                   type: string
 *                 invoice:
 *                   type: object
 *                   properties:
 *                     _id:
 *                       type: string
 *                     user:
 *                       type: string
 *                     cart:
 *                       type: string
 *                     totalAmount:
 *                       type: number
 *       400:
 *         description: Error en la solicitud.
 *       404:
 *         description: Factura no encontrada.
 *       500:
 *         description: Error al actualizar la factura.
 */
router.put("/updateInvoice/:id", updateInvoiceValidator, updateInvoice)

/**
 * @swagger
 * /getInvoice:
 *   get:
 *     summary: Obtener la factura del usuario.
 *     description: Obtiene la factura del usuario autenticado.
 *     tags:
 *       - Invoice
 *     responses:
 *       200:
 *         description: Factura obtenida exitosamente.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 invoice:
 *                   type: object
 *                   properties:
 *                     _id:
 *                       type: string
 *                     user:
 *                       type: string
 *                     cart:
 *                       type: string
 *                     totalAmount:
 *                       type: number
 *       404:
 *         description: Factura no encontrada.
 *       500:
 *         description: Error al obtener la factura.
 */
router.get("/getInvoice", getInvoiceValidator, getInvoiceById)


/**
 * @swagger
 * /getInvoiceUser:
 *   get:
 *     summary: Obtener las facturas de un usuario.
 *     description: Obtiene todas las facturas de un usuario específico.
 *     tags:
 *       - Invoice
 *     requestBody:
 *       description: El nombre de usuario para buscar las facturas.
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               username:
 *                 type: string
 *             required:
 *               - username
 *     responses:
 *       200:
 *         description: Facturas obtenidas exitosamente.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 invoice:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       _id:
 *                         type: string
 *                       user:
 *                         type: string
 *                       cart:
 *                         type: string
 *                       totalAmount:
 *                         type: number
 *       404:
 *         description: Usuario o facturas no encontradas.
 *       500:
 *         description: Error al obtener las facturas.
 */
router.get("/getInvoiceUser", getInvoiceOfUserValidator, getInvoiceOfUser)

/**
 * @swagger
 * /getProductByInvoice/{id}:
 *   get:
 *     summary: Obtener productos por ID de factura.
 *     description: Obtiene los productos de una factura específica.
 *     tags:
 *       - Invoice
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         description: ID de la factura.
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Productos obtenidos exitosamente.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 products:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       name:
 *                         type: string
 *                       price:
 *                         type: number
 *                       description:
 *                         type: string
 *                       quantity:
 *                         type: integer
 *       404:
 *         description: Factura no encontrada.
 *       500:
 *         description: Error al obtener los productos de la factura.
 */
router.get("/getProductByInvoice/:id", getInvoiceOfUserValidator, getProductsByInvoiceId)

export default router