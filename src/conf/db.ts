import mongoose from "mongoose";
import colors from "colors";

//console.log( process.env);

export const connectDB = async () => {

    try {        

        const url = 'mongodb+srv://root:8rEDmgrlvQBeIVoh@devtree.kfrpv.mongodb.net/?retryWrites=true&w=majority&appName=devtree';

        const { connection } = await mongoose.connect( url);
        
        console.log(colors.blue(`${connection.host}:${connection.port}`));
        
    } catch (error) {

        console.log(colors.bgRed.white.bold(error.message));

        process.exit(1);
        
    }
} 