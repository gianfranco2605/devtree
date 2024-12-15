import { Router } from 'express';

const router = Router();

//Routing
router.post( '/auth/register', ( req, res ) => {

    console.log(req.body);
    
    res.send( "Hola register" );

} )

export default router;