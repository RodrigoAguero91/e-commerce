import express from "express"
import { __dirname } from "./utils.js"
import handlebars from "express-handlebars"
import {Server} from "socket.io"
import bcrypt from "bcrypt";

import routerP from "./routes/product.router.js";
import routerV from "./routes/views.router.js";
import routerC from "./routes/carts.router.js";
import routerSessions from "./routes/sessions.router.js";

import socketProducts from "./Socket/socketProducts.js";
import socketChat from "./Socket/socketChat.js";

import connectToDB from "./Dao/db/config/configServer.js";
import MongoStore from "connect-mongo";
import { UserSchema } from "./Dao/db/models/user.model.js";

import session from "express-session";

import passport from "passport";
import { initPassport } from "./Dao/db/config/passport.config.js";

import { auth } from "./middleware/auth.js";




const app = express()
const PORT=8080
// Middleware para analizar el cuerpo JSON de la solicitud
app.use(express.json());
app.use(express.urlencoded({extended:true}));
app.use(express.static(__dirname + "/public"))
//handlebars
app.engine("handlebars",handlebars.engine())
app.set("views", __dirname+"/views")
app.set("view engine","handlebars")
//rutas
app.use("/api",routerP)
app.use('/', routerV);
app.use("/api",routerC)
app.use("/api/sessions", routerSessions)
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
    secret:'coderSecret',
    resave: true,
    saveUninitialized: true
}))
initPassport()
app.use(passport.initialize())
app.use(passport.session())



app.get('/login',(req, res)=>{
    res.render('login');
})

app.get('/signup', (req, res)=>{
    res.render('signup');
})

app.post('/signup', async (req, res)=>{
    const data = {
        name: req.body.username,
        lastname: req.body.lastname,
        email: req.body.email,
        password: req.body.password,
        age: req.body.age
       
    }
    const existingUser= await UserSchema.findOne({name: data.name})
    if(existingUser){
        res.send("El usuario ya existe. Registrarse con otro nombre.")
    }else{
        const saltRounds = 10;
        const hashedPassword = await bcrypt.hash(data.password, saltRounds);
        data.password= hashedPassword;
        const userdata = await UserSchema.insertMany(data);
        console.log(userdata)
    }
   
    

}) ;


app.post('/login', async (req, res)=>{
    try{
        const check = await UserSchema.findOne({email: req.body.email});
        if(!check){
            res.send("user name cannot found");
        }
        const isPasswordMatch = await bcrypt.compare(req.body.password, check.password)
        if(isPasswordMatch){
            res.render('products');
        }else{
            req.send("wrong password");
        }
    }catch{
        res.send("wrong password");
    }
})

app.get('/perfil', auth, (req, res)=>{
    res.setHeader('content-Type','application/json');
    res.status(200).json({
        mensaje:'Perfil de usuario',usuario:req.user
    });
})



const socketServer = new Server(httpServer)

socketProducts(socketServer)
socketChat(socketServer)