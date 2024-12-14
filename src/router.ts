import { Router } from 'express';

const router = Router();

//Routing
router.get( '/', ( req, res ) => {

    res.send( "Hola Mundo" );

} )

router.get( '/nosotros', ( req, res ) => {

    res.send( "Hola nosotros" );

} )

export default router;