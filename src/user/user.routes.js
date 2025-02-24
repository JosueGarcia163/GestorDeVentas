import { Router } from "express"
import { getUserById, getUsers, updatePassword, updateUser, updateProfilePicture } from "./user.controller.js"
import { getUserByIdValidator, updatePasswordValidator, updateUserValidator, updateProfilePictureValidator } from "../middlewares/user-validators.js"
import { uploadProfilePicture } from "../middlewares/multer-uploads.js"

const router = Router()


/**
 * @swagger
 * /findUser:
 *   get:
 *     summary: Obtiene los detalles del usuario autenticado
 *     tags: [User]
 *     responses:
 *       200:
 *         description: Usuario encontrado
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 user:
 *                   type: object
 *                   properties:
 *                     uid:
 *                       type: string
 *                       example: "12345"
 *                     name:
 *                       type: string
 *                       example: "John"
 *                     surname:
 *                       type: string
 *                       example: "Doe"
 *                     email:
 *                       type: string
 *                       example: "john.doe@example.com"
 *                     phone:
 *                       type: string
 *                       example: "12345678"
 *                     role:
 *                       type: string
 *                       enum: [USER_ROLE, ADMIN_ROLE]
 *                       example: "USER_ROLE"
 *       401:
 *         description: No autorizado, token no proporcionado o inválido
 *       404:
 *         description: Usuario no encontrado
 *       500:
 *         description: Error interno del servidor
 */



router.get("/findUser", getUserByIdValidator, getUserById)

/**
 * @swagger
 * /users:
 *   get:
 *     summary: Obtiene todos los usuarios con paginación
 *     tags: [User]
 *     parameters:
 *       - in: query
 *         name: limite
 *         description: Número de usuarios por página (opcional)
 *         required: false
 *         schema:
 *           type: integer
 *           example: 5
 *       - in: query
 *         name: desde
 *         description: El índice de inicio para la paginación (opcional)
 *         required: false
 *         schema:
 *           type: integer
 *           example: 0
 *     responses:
 *       200:
 *         description: Lista de usuarios obtenida con éxito
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 total:
 *                   type: integer
 *                   example: 100  # Total de usuarios en la base de datos
 *                 users:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       id:
 *                         type: string
 *                         example: "60d0fe4f5311236168a109f1"
 *                       name:
 *                         type: string
 *                         example: "Juan"
 *                       surname:
 *                         type: string
 *                         example: "Perez"
 *                       username:
 *                         type: string
 *                         example: "juanperez"
 *                       email:
 *                         type: string
 *                         example: "juanperez@gmail.com"
 *                       phone:
 *                         type: string
 *                         example: "58496741"
 *                       role:
 *                         type: string
 *                         enum: ["USER_ROLE", "ADMIN_ROLE"]
 *                         example: "USER_ROLE"
 *                       status:
 *                         type: boolean
 *                         example: true
 *       500:
 *         description: Error interno del servidor
 */


router.get("/", getUsers)



/**
 * @swagger
 * /updatePassword:
 *   patch:
 *     summary: Actualiza la contraseña de un usuario
 *     tags: [User]
 *     parameters:
 *       - in: body
 *         name: password
 *         required: true
 *         schema:
 *           type: object
 *           properties:
 *             oldPassword:
 *               type: string
 *             newPassword:
 *               type: string
 *     responses:
 *       200:
 *         description: Contraseña actualizada con éxito
 *       400:
 *         description: La contraseña anterior es incorrecta o la nueva contraseña no cumple con los requisitos
 *       500:
 *         description: Error al actualizar la contraseña
 */

router.patch("/updatePassword", updatePasswordValidator, updatePassword)

/**
 * @swagger
 * /updateUser:
 *   put:
 *     summary: Actualiza los datos de un usuario
 *     tags: [User]
 *     parameters:
 *       - in: body
 *         name: user
 *         required: true
 *         schema:
 *           type: object
 *           properties:
 *             name:
 *               type: string
 *               example: "NuevoNombresasdfa"
 *             surname:
 *               type: string
 *               example: "mendezsasdfasf"
 *             username:
 *               type: string
 *               example: "nuevoUsernamesasdfafs"
 *             email:
 *               type: string
 *               example: "nuevossasdfas@gmail.com"
 *             phone:
 *               type: string
 *               example: "58496741"
 *             role:
 *               type: string
 *               enum: [USER_ROLE, ADMIN_ROLE]
 *               example: "USER_ROLE"
 *     responses:
 *       200:
 *         description: Usuario actualizado con éxito
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Usuario actualizado correctamente."
 *       400:
 *         description: Datos incorrectos o no permitidos (por ejemplo, rol no permitido)
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Rol no permitido."
 *       403:
 *         description: El usuario no tiene permisos para modificar los datos
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "No tienes permiso para actualizar este usuario."
 *       500:
 *         description: Error interno al actualizar el usuario
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Hubo un error interno al actualizar los datos del usuario."
 */



router.put("/updateUser", updateUserValidator, updateUser)


/**
 * @swagger
 * /updateProfilePicture:
 *   patch:
 *     summary: Actualiza la foto de perfil de un usuario
 *     tags: [User]
 *     parameters:
 *       - in: formData
 *         name: profilePicture
 *         type: file
 *         required: true
 *         description: La nueva foto de perfil del usuario
 *     responses:
 *       200:
 *         description: Foto de perfil actualizada con éxito
 *       400:
 *         description: El archivo no es válido o no se pudo procesar
 *       500:
 *         description: Error al actualizar la foto de perfil
 */
router.patch("/updateProfilePicture", uploadProfilePicture.single("profilePicture"), updateProfilePictureValidator, updateProfilePicture)

export default router