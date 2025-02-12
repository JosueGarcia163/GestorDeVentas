import { Router } from "express"
import {getCategories, createCategories } from "./categorios.controller.js"
import { createValidator, getCategoriesValidator, deleteCategoriesValidator, updateCategoriesValidator } from "../middlewares/categories-validators.js"

const router = Router()

/**
* @swagger
* /categories/createCategories:
*   post:
*     summary: Crea una nueva categoría
*     tags: [Categories]
*     requestBody:
*       required: true
*       content:
*         application/json:
*           schema:
*             type: object
*             properties:
*               name:
*                 type: string
*                 description: Nombre de la categoría
*     responses:
*       201:
*         description: Categoría creada exitosamente
*       400:
*         description: Error en la solicitud
*       403:
*         description: No autorizado para crear categorías
*       500:
*         description: Error en el servidor
*/

router.post("/createCategories", createValidator, createCategories)

/**
 * @swagger
 * /categories:
 *   get:
 *     summary: Obtiene todas las categorías
 *     tags: [Categories]
 *     responses:
 *       200:
 *         description: Lista de categorías obtenida con éxito
 *       500:
 *         description: Error al obtener las categorías
 */


router.get("/", getCategoriesValidator, getCategories)



export default router

