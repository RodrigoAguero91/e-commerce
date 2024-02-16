import express from "express"
import { __dirname } from "../src/utils.js"
import handlebars from "express-handlebars"
import {Server} from "socket.io"

import routerP from "../src/routers/product.router.js";
import routerV from "../src/routers/views.router.js";
import socketProducts from "../src/public/js/socket/socketProducts.js";
import socketChat from "../src/public/js/socket/socketChat.js";
import connectToDB from "../src/dao/db/database.js";

const app = express()
const PORT=8080
app.use(express.json())
app.use(express.static(__dirname + "/public"))

//handlebars
app.engine("handlebars",handlebars.engine())
app.set("views", __dirname+"/views")
app.set("view engine","handlebars")



app.use("/api",routerP)
app.use('/', routerV);

connectToDB()
const httpServer=app.listen(PORT, () => {
    try {
        console.log(`Usuario conectado al puerto ${PORT}`);
        
    }
    catch (err) {
        console.log(err);
    }
});

const socketServer = new Server(httpServer)

socketProducts(socketServer)
socketChat(socketServer)