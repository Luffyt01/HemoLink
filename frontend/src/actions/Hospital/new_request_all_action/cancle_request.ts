"use server"
import axios, { AxiosError } from "axios"

export const cancel_Blood_Request_Hospital = async (requestId: string,token:string) => {
    try {
        const response = await axios.patch(
            `${process.env.BACKEND_APP_URL1}/requests/${requestId}/cancel`,
            {}, // empty body if needed
            {
                headers: {
                    'Authorization': `Bearer ${token}` // if needed
                }
            }
        )
        return {
            status: 200,
            message: "Request cancelled successfully",
            data: response.data
        }
    } catch (error) {
        console.log(error.response.data)
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
                message: error.response?.data?.message || "Error cancelling request",
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