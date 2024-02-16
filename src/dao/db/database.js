import mongoose from "mongoose";
const URI="mongodb+srv://aguerorodrigo91:takuara47@proyectocoderhouse.pxcbns7.mongodb.net/?retryWrites=true&w=majority/Ecommerce"
const connectToDB = () => {
    try {
        mongoose.connect(URI)
        console.log('Base de datos conectada')
    } catch (error) {
        console.log(error);
    }
};

export default connectToDB