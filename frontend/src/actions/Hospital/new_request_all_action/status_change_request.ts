"use server"
import axios, { AxiosError } from "axios"

export const statusChangeRequest = async (requestId: string, requestStatus: string,token :string) => {
    try {
        const response  = await axios.patch(`${process.env.BACKEND_APP_URL1}/requests/${requestId}/status/${requestStatus}`,{},{
            headers:{
                Authorization :`Bearer${token}`
            }
        })

        return {
            status :200,
            message:"status change successfully",
            data:response.data
        }


        
    } catch (error) {
        if (error instanceof AxiosError) {
            if (error.response?.status === 403) {
                return {
                    status: 403,
                    message: "You don't have permission to cancel this request",
                    data: error.response?.data
                }
            }
            return {
                status: error.response?.status || 400,
                message: error.response?.data?.message || "Error status change request",
                data: error.response?.data
            }
        }
        return {
            status: 500,
            message: "Internal server error",
            data: error
        }
    }
}
    