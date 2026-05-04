import { type Request, type Response, type NextFunction } from "express";
import { auth } from "express-oauth2-jwt-bearer";
import dotenv from 'dotenv';
import jwt from "jsonwebtoken";
import User from '../models/userModels'


//Instanceamos dotenv para leer las variables de entorno del archivo .env
dotenv.config();

declare global{
  namespace Express {
    interface Request{
      userId: string,
      auth0Id: string
    }
  }
}

export const jwtCheck = auth({
  audience: process.env.AUTH0_AUDIENCE,
  issuerBaseURL: process.env.AUTH0_ISSUER_BASE_URL,
  tokenSigningAlg: 'RS256'
});

export const jwtParse = async (req: Request, res:Response, next: NextFunction): Promise<any>=>{
  const { authorization } =req.headers;

  //los headers comenzaran con una cadena
  //Bearer token, por ejemplo
  //bearer 12435xshcgvdjhfshag
  //por lo tanto es ecesario verificar que la autorizacion comience
  //con la cadena bearer
  if (!authorization || !authorization.startsWith('Bearer ')){
    console.log("jwtParse - Authorization Deneged")
    return res.sendStatus(401)
    .json({message: 'Authorization deneged'})
  }//fin de if

  //obtenemos el token del header
  //Bearer 123fhdvhdfj
  //       [   0         1       ]
  //split = ["bearer", "123fhdvhdfj"]
  const token =authorization.split(" ")[1];

  try{
    //console.log("jwtParse-Analizando token");
    //Analizamos el token para validar que sea correcto
    //decoded decodificada el token dividiendolo en partes
    const decoded= jwt.decode(token) as jwt.JwtPayload;

    //el elemento sub del token contiene el id del usuario
    //que inicio sesion en la api auth0
    const auth0Id = decoded.sub;
    
    //comprobar que exista el usuario en la bd
    const user= await User.findOne({ auth0Id })
    
    if(!user){
      console.log("jwtParse - !user find Autorizacion denegada")
      return res.sendStatus(401)
        .json({message: 'Autorizacion denegada'})
    }
    req.auth0Id = auth0Id as string;
    req.userId =user._id.toString();
    console.log("jwtParse - Autorizacion concedida")
    next();

  }catch(error){
    console.log("jwtParse - catch Autorizacion denegada")
    return res.sendStatus(401)
    .json({message: 'Autorizacion denegada'})
  }//Fin del catch
}//fin de jwt parse