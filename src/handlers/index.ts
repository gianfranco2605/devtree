import type { Request, Response } from 'express';
import User from "../models/Users";

export const createAccount = async ( req: Request, res:Response ) => {

    const { email } = req.body;

    const userExist = await User.findOne({ email });

    if( userExist ) {
        console.log('El usuario ya existe');
        
    }else {
        console.log('El usuario no existe');
    }
    
    

    return;

    const user = new User( req.body );

    await user.save();

    //Another way to save data
    // await User.create( req.body);

    res.send('Registro creado con éxito');

}