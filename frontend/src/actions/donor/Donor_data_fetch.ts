"use server"

import axios from "axios"

export const Donor_data_fetch = async ({donorId,accessToken}:{donorId: string,accessToken: string}) => {
 try {
    // const response  = await axios.get(`${process.env.BACKEND_APP_URL}/donors/${{donorId}}`,
    //     {
    //         params: {
    //             donorId
    //         },
    //         headers: {
    //             "Content-Type": "application/json",
    //             "Authorization": `Bearer ${accessToken}`
    //         }
    //     }
    // )

    // console.log(response.data);

    return {
        // data: response.data,
        status:200,
        message: "Donor data fetched successfully"
    }
 } catch (error) {
    console.log(error);
    return {
        data: null,
        status: 500,
        message: "Failed to fetch donor data"
    }
 }
}
