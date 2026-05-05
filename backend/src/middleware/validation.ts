import { body, validationResult } from 'express-validator';
import { Request, Response, NextFunction } from 'express';


const handValidationErrors = async(
    req: Request,
    res: Response,
    next: NextFunction
) : Promise<any>=>{
    const errors = validationResult(req);

    if(!errors.isEmpty()){
        return res.status(400)
        .json({errors: errors.array()});
    }
    next();
}//fin de handleVALIDATIONS


// Validaciones para los datos del usuario
export const validateUserRequest = [
  body('name')
    .isString()
    .notEmpty()
    .withMessage('El nombre es requerido'),
  body('address')
    .isString()
    .notEmpty()
    .withMessage('La dirección es requerida'),
  body('city')
    .isString()
    .notEmpty()
    .withMessage('La ciudad es requerida'),
  body('country')
    .isString()
    .notEmpty()
    .withMessage('El país es requerido'),
    handValidationErrors
];