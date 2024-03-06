import express from "express"
import { __dirname } from "./utils.js"
import handlebars from "express-handlebars"
import {Server} from "socket.io"

import routerP from "./routes/product.router.js";
import routerV from "./routes/views.router.js";
import socketProducts from "./Socket/socketProducts.js";

import connectToDB from "./Dao/db/config/configServer.js";
import socketChat from "./Socket/socketChat.js";
import routerC from "./routes/carts.router.js";
import AuthRouter from "../src/routes/auth.router.js"

import session from "express-session";

import MongoStore from "connect-mongo";

;


const app = express()
const PORT=8080
// Middleware para analizar el cuerpo JSON de la solicitud
app.use(express.json());
app.use(express.static(__dirname + "/public"))
//handlebars
app.engine("handlebars",handlebars.engine())
app.set("views", __dirname+"/views")
app.set("view engine","handlebars")
//rutas
app.use("/api",routerP)
app.use('/', routerV);
app.use("/api",routerC)
connectToDB()
const httpServer=app.listen(PORT, () => {
    try {
        console.log(`Conectado al puerto: ${PORT}`);
      
    }
    catch (err) {
        console.log(err);
    }
});

//Session
app.use(session({
    store: MongoStore.create({
        mongoUrl:'mongodb+srv://aguerorodrigo91:takuara47@proyectocoderhouse.pxcbns7.mongodb.net/Ecommerce',
        
    }),
    secret:'secretCoder',
    resave: true,
    saveUninitialized: true
}))
app.get('/sessionSet', (req,res) => {
    req.session.user = 'Rodrigo',
    req.session.age = 32

    res.send('Session ok!')
})
app.get('/sessionGet', (req,res) =>{
    res.send(req.session)
})


app.use('/view', routerV)
app.use('/auth', AuthRouter)



const socketServer = new Server(httpServer)

socketProducts(socketServer)
socketChat(socketServer)