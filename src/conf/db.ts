import mongoose from "mongoose";
import colors from "colors";

//console.log( process.env);

export const connectDB = async () => {

    try {        

        const url = process.env.MONGO_URI || "mongodb://localhost:27017/express-ts";

        const { connection } = await mongoose.connect( url);
        
        console.log(colors.blue(`${connection.host}:${connection.port}`));
        
    } catch (error) {

        console.log(colors.bgRed.white.bold(error.message));

        process.exit(1);
        
    }
} 