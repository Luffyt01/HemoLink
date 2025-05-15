"use server"
import axios from 'axios'
import { z } from 'zod'

const FormSchema = z.object({
    email: z.string().email("Please enter a valid email address"),
})

const forgotPasswordAction = async (prevState: any, formData: FormData) => {
    try {
        // Validate form data
        const validatedFields = FormSchema.safeParse({
            email: formData.get("email"),
        })

        if (!validatedFields.success) {
            return { 
                error: "Invalid fields",
                email: validatedFields.error.flatten().fieldErrors.email 
            }
        }

        const { email } = validatedFields.data;

        // Make API request with email as query parameter
        const response = await axios.post(
            `${process.env.BACKEND_APP_URL}/auth/forgot-password`,
            {},  // Empty body since we're using params
            {
                params: {  // This is where query params go
                    email: email
                },
                headers: {
                    "Content-Type": "application/json"
                }
            }
        )

        return {
            status: 200,
            success: "Email sent successfully",
            data: response.data,
            message: response.data.message || "Email sent successfully"
        }

    } catch (error: any) {
        console.error("Forgot password error:", error.response?.data || error.message)
        
        return {
            status:  500,
            error: error.response?.data?.error || "Something went wrong"
        }
    }
}

export default forgotPasswordAction