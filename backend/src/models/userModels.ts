import mongoose from "mongoose";  

//registrar a los admin de la app

const userSchema = new mongoose.Schema({
    auth0Id:{
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true
    },
    name: {
        type: String,
    },
    address: {
        type: String
    },
    city: {
        type : String
    },
    country: {
        type: String
    }

});

export default mongoose.model('User',userSchema);