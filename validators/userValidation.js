import { check, body } from 'express-validator';

export const updateUserValidator = () => {
  const updateUserSchema = [
    check('email')
      .isEmail()
      .optional()
      .withMessage("Invalid email address"),
    check('username')  
      .optional()
      .isLength({min: 3})
      .isLength({max: 15})
  ]
}

export const deleteUserValidator = () => {
  const deleteUserSchema =  []
}