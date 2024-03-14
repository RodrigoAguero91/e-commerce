import mongoose from "mongoose";
const URI="mongodb+srv://aguerorodrigo91:takuara47@proyectocoderhouse.pxcbns7.mongodb.net/Ecommerce"
const connectToDB = () => {
    try {
        mongoose.connect(URI)
        console.log('connectado a la base de datos de mongo')
    } catch (error) {
        console.log(error);
    }
};

export default connectToDB