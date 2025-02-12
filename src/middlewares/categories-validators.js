import { body, param } from "express-validator";
import { categoriesExists } from "../helpers/db-validators.js";
import { validarCampos } from "./validate-fields.js";
import { deleteFileOnError } from "./delete-file-on-error.js";
import { handleErrors } from "./handle-errors.js";
import { validateJWT } from "./validate-jwt.js";
import { hasRoles } from "./validate-roles.js";

export const createValidator = [
    validateJWT,
    //Utilizamos el metodo para validar o permitir varios roles.
    hasRoles("ADMIN_ROLE"),
    body("name").notEmpty().withMessage("El nombre es requerido"),
    validarCampos,
    deleteFileOnError,
    handleErrors
]

export const getCategoriesValidator = [
    validateJWT,
    //Utilizamos el metodo para validar o permitir varios roles.
    hasRoles("ADMIN_ROLE"),
    validarCampos,
    handleErrors
]

export const deleteCategoriesValidator = [
    validateJWT,
    //Utilizamos el metodo para validar o permitir varios roles.
    hasRoles("ADMIN_ROLE"),
    param("uid").isMongoId().withMessage("No es un ID válido de MongoDB"),
    param("uid").custom(categoriesExists),
    validarCampos,
    handleErrors
]


export const updateCategoriesValidator = [
    validateJWT,
    //Utilizamos el metodo para validar o permitir varios roles.
    hasRoles("ADMIN_ROLE"),
    param("uid", "No es un ID válido").isMongoId(),
    param("uid").custom(categoriesExists),
    validarCampos,
    handleErrors
]







