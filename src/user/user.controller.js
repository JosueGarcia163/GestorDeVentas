import { hash, verify } from "argon2";
import User from "./user.model.js"
import fs from "fs/promises"
import { join, dirname } from "path"
import { fileURLToPath } from "url"
import bcrypt from "bcryptjs";


const __dirname = dirname(fileURLToPath(import.meta.url))

export const getUserById = async (req, res) => {
    try {
        const { uid } = req.params;
        const user = await User.findById(uid)

        if (!user) {
            return res.status(404).json({
                success: false,
                message: "Usuario no encontrado"
            })
        }

        return res.status(200).json({
            success: true,
            user
        })

    } catch (err) {
        return res.status(500).json({
            success: false,
            message: "Error al obtener el usuario",
            error: err.message
        })
    }
}

export const getUsers = async (req, res) => {
    try {
        const { limite = 5, desde = 0 } = req.query
        const query = { status: true }

        const [total, users] = await Promise.all([
            User.countDocuments(query),
            User.find(query)
                .skip(Number(desde))
                .limit(Number(limite))
        ])

        return res.status(200).json({
            success: true,
            total,
            users
        })
    } catch (err) {
        return res.status(500).json({
            success: false,
            message: "Error al obtener los usuarios",
            error: err.message
        })
    }
}

export const deleteUser = async (req, res) => {
    try {
        const { usuario } = req

        const user = await User.findByIdAndUpdate(usuario.uid, {status: false}, {new: true})

        return res.status(200).json({
            success: true,
            message: "Usuario eliminado",
            user
        })
    } catch (err) {
        return res.status(500).json({
            success: false,
            message: "Error al eliminar el usuario",
            error: err.message
        })
    }
}

export const updatePassword = async (req, res) => {
    try {
        const { uid } = req.params
        const { newPassword } = req.body

        const user = await User.findById(uid)

        const matchOldAndNewPassword = await verify(user.password, newPassword)

        if (matchOldAndNewPassword) {
            return res.status(400).json({
                success: false,
                message: "La nueva contraseña no puede ser igual a la anterior"
            })
        }

        const encryptedPassword = await hash(newPassword)

        await User.findByIdAndUpdate(uid, { password: encryptedPassword }, { new: true })

        return res.status(200).json({
            success: true,
            message: "Contraseña actualizada",
        })

    } catch (err) {
        return res.status(500).json({
            success: false,
            message: "Error al actualizar contraseña",
            error: err.message
        })
    }
}

export const updateUser = async (req, res) => {
    try {
        const { uid } = req.params;
        const data = req.body;
        const loggedInUserId = req.usuario.id
        

        //Sencilla validacion para confirmar que el id del token sea el mismo que el id que se esta colocando en el params.
        if (uid !== loggedInUserId) {
            return res.status(403).json({
                success: false,
                message: "No puedes modificar la información de otro usuario."
            });
        }

        const user = await User.findByIdAndUpdate(uid, data, { new: true });

        res.status(200).json({
            success: true,
            msg: 'Usuario Actualizado',
            user,
        });
    } catch (err) {
        res.status(500).json({
            success: false,
            msg: 'Error al actualizar usuario',
            error: err.message
        });
    }
}

//Agregamos metodo para actualizar imagen
export const updateProfilePicture = async (req, res) => {
    try {
        const { uid } = req.params
        let newProfilePicture = req.file ? req.file.filename : null
        if (!newProfilePicture) {
            return res.status(400).json({
                success: false,
                message: "No hay archivo en la petición"
            })
        }
        const user = await User.findById(uid)
        if (user.profilePicture) {
            const oldProfilePicture = join(__dirname, "../../public/uploads/profile-pictures", user.profilePicture)
            await fs.unlink(oldProfilePicture)
        }
        user.profilePicture = newProfilePicture
        await user.save()
        return res.status(200).json({
            success: true,
            message: "Foto actualizada",
            profilePicture: user.profilePicture,
        })
    } catch (err) {
        return res.status(500).json({
            success: false,
            message: "Error al actualizar la foto",
            error: err.message
        })
    }
}

/*Funcion para crear usuario por default*/ 
export const createDefaultUser = async () => {
    try {
        /*Agregamos la constante de email por default antes 
        debido a que necesitamos este email para buscar si ya existe.
        */
        const defaultEmail = "admin@example.com";

        /*Aqui en este apartado buscamos si existe el usuario en la base de datos
        por medio de defaultEmail.
        */ 
        const existingUser = await User.findOne({ email: defaultEmail });
        //Si ya existe tira esta validacion y no hara nada.
        if (existingUser) {
            console.log("El usuario administrador ya existe. No se creará nuevamente.");
            return;
        }

        //Si no esta el usuario creado encriptara esta password con bycrypt.
        const hashedPassword = await bcrypt.hash("Admin1234#/SFDS=)", 10);

        /*Definimos los valores por default del usuario.*/ 
        const defaultUser = new User({
            name: "Admin",
            surname: "User",
            username: "admin",
            email: defaultEmail,
            password: hashedPassword,
            phone: "12345678",
            role: "ADMIN_ROLE",
            status: true,
        });

        //Lo guardamos en la base de datos.
        await defaultUser.save();

        //Mandamos un console log en consola para dar a entender de que se creo perfectamente.
        console.log("Usuario administrador creado exitosamente.");
    } catch (error) {
        console.error("Error al crear el usuario administrador:", error.message);
    }
};


