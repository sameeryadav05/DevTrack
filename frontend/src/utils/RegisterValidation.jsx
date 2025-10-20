import * as yup from 'yup'

export  const RegisterSchema = yup.object({
    username:yup.string().required('username is required').min(3,"username must have at least 3 characters"),
    email:yup.string().email("Enter a valid email").required("email is required"),
    password:yup.string().required('password is required').min(6,"password must have atleast 6 characters").max(15,"password exceeds 15 character")
})

