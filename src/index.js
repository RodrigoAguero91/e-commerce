import express from 'express'
import { Server } from 'socket.io'
import handlebars from 'express-handlebars'
import productsRouter from './routers/products.router.js'
import cartsRouter from './routers/carts.routers.js'
import viewsRouter from './routers/views.router.js'
import chatRouter from './routers/chat.router.js'
import sessionsRouter from './routers/sessions.router.js'
import viewsUserRouter from './routers/viewsUser.router.js'
import mongoose from 'mongoose'
import Message from './dao/models/message.model.js'
import session from 'express-session'
import MongoStore from 'connect-mongo'
import passport from 'passport'
import initializePassport from './dao/config/passport.config.js'

const PORT = 8080; 

const app = express(); 
app.use(express.json()); 
app.use(express.static('./src/public')); 

// configuracion de la sesion
app.use(session({
    store: MongoStore.create({
      mongoUrl: 'mongodb+srv://aguerorodrigo91:takuara47@proyectocoderhouse.pxcbns7.mongodb.net/Ecommerce',
      dbName: 'Ecommerce',
      mongoOptions: {
        useNewUrlParser: true,
        useUnifiedTopology: true
      }
  }),
  secret: 'secret',
  resave: true,
  saveUninitialized: true
}))

// configuracion de passport
initializePassport();
app.use(passport.initialize());
app.use(passport.session());

// configuracion del motor de plantillas handlebars
app.engine('handlebars', handlebars.engine());
app.set('views', './src/views');
app.set('view engine', 'handlebars');


// Inicialización del servidor
try {
    await mongoose.connect('mongodb+srv://aguerorodrigo91:takuara47@proyectocoderhouse.pxcbns7.mongodb.net/Ecommerce') 
    const serverHttp = app.listen(PORT, () => console.log(`conectado al puerto :${PORT}`)) 
    const io = new Server(serverHttp) 
    app.use((req, res, next) => {
        req.io = io;
        next();
    }); 
    
    // Rutas
    app.get('/', (req, res) => {
      if (req.session.user) {
         
          res.render('index');
      } else {
          
          res.redirect('/login');
      }
    })
    
    app.use('/', viewsUserRouter); 
    app.use('/chat', chatRouter); 
    app.use('/products', viewsRouter); 
    app.use('/api/products', productsRouter); 
    app.use('/api/carts', cartsRouter); 
    app.use('/api/sessions', sessionsRouter); 
    
    io.on('connection', socket => {
        console.log('Nuevo cliente conectado!')

        socket.broadcast.emit('Alerta');

        
        Message.find()
          .then(messages => {
            socket.emit('messages', messages); 
          })
          .catch(error => {
            console.log(error.message);
          });
    
        socket.on('message', data => {
          
          const newMessage = new Message({
            user: data.user,
            message: data.message
          });
    
          newMessage.save()
            .then(() => {
              
              Message.find()
                .then(messages => {
                  io.emit('messages', messages);
                })
                .catch(error => {
                  console.log(error.message);
                });
            })
            .catch(error => {
              console.log(error.message);
            });
        });

        socket.on('productList', async (data) => { 
            io.emit('updatedProducts', data ) 
        }) 
    }) 
} catch (error) {
    console.log(error.message)
}
