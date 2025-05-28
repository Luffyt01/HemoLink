

"use server"

import axios, { AxiosError } from "axios"

export const HospitalNewRequestAction = async (pre: any, formData: any) => {



    try {
        const Data = {
            bloodType: formData.bloodType,
            unitsRequired: formData.unitsRequired,
            urgency: formData.urgency,
            expiryTime: formData.expiryTime
        }
        const token = formData.token || null;
        console.log(token)
        console.log(Data)

        
            const response = await axios.post(`${process.env.BACKEND_APP_URL1}/requests/create`,
                Data
                , {
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                }
            })
            console.log(response.data)
            return{
                status:200,
                message:"Request created successfully",
                data:response.data
            }


    } catch (error) {
        console.error("Error creating request:", error.response.data);
        if(error instanceof AxiosError){
            return{
                status:400,
                message:error.response?.data.statusCode || "Error creating request",
                // data:error.response.data
            }
        }
        return{
            status:500,
            message:"Internal server error",
            // data:error
        }

    }

}