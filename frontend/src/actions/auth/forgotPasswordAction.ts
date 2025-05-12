"use server"
import axios from 'axios'
import React from 'react'
import { z } from 'zod'

const FormSchema = z.object({
    email: z.string().email("Please enter a valid email address"),
})

const forgotPasswordAction = (prevState: any, formData: FormData) => {




    try {
        const validatedFields = FormSchema.safeParse({
            email: formData.get("email"),
        })

        if (!validatedFields.success) {
            return { error: "Invalid fields",email:validatedFields.error.flatten().fieldErrors.email }
        }

        const { email } = validatedFields.data;

        console.log(email)
        // const response  = await axios.post()

        return{
            status:200,
            success:"Email sent successfully"
        }


    } catch (error) {
       
        console.log(error)
        return{
            status:500,
            error:"Something went wrong"
        }

    }









}

export default forgotPasswordAction