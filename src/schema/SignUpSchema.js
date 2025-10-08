import * as Yup from 'yup';

export const SignUpSchema = Yup.object({
  name: Yup.string()
    .min(2, 'Name must be at least 2 characters')
    .required('Please enter your name'),

  phone: Yup.string()
    .matches(/^\d{10}$/, 'Please enter a valid 10-digit phone number')
    .required('Please enter your phone number'),

  password: Yup.string()
    .min(8, 'Password must be at least 8 characters')
    .max(20, 'Password must be less than 20 characters')
    .matches(/[A-Z]/, 'Password must have at least one uppercase letter')
    .matches(/[a-z]/, 'Password must have at least one lowercase letter')
    .matches(/[0-9]/, 'Password must have at least one number')
    .matches(/[^A-Za-z0-9]/, 'Password must have at least one special character')
    .required('Please enter your password'),
});