import mongoose from "mongoose";
import colors from "colors";

//console.log( process.env);

export const connectDB = async () => {

    try {

        const {connection} = await mongoose.connect( process.env.MONGO_URI );

        const url = `${connection.host}:${connection.port}`
        
        console.log(colors.blue.bold(`Connect to mongo en ${url}`));
        
    } catch (error) {

        console.log(colors.bgRed.white.bold(error.message));

        process.exit(1);
        
    }
} 