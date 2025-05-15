"use server"

import axios from "axios"

const fetchHospitalData = async ({ accessToken }: { accessToken: string }) => {
    try {

        const response = await axios.get(`${process.env.BACKEND_APP_URL}/profile/me`,
            {
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${accessToken}`
                }
            }
        )

        console.log(response.data);

        return {

            status: 200,
            data: response.data,
            message: "Hospital data fetched successfully"
        }
    } catch (error: any) {
        console.log(error.response.data);
        return {
            data: null,
            status: 500,
            error: error?.response?.data.error,
            message: "Failed to fetch hospital data"
        }
    }
}

export default fetchHospitalData;
