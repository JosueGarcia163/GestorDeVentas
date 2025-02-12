import { config } from "dotenv"
import { initServer } from "./configs/server.js"
import {createDefaultUser}  from "./src/user/user.controller.js";

config()
const startServer = async () => {
    try {
        await initServer();
        //Llamamos la funcion de crear un usuario.
        await createDefaultUser();
    } catch (error) {
        console.error("Error al iniciar el servidor:", error);
    }
};

startServer();

