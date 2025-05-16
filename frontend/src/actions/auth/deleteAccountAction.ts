"use server"

import axios from "axios";

export const deleteAccountAction = async (state: any, formData: FormData) => {

    try {
        const accessToken = formData.get("accessToken") as string;

        console.log(accessToken);
        if (!accessToken) {
            throw new Error("Access token is required");
        }
        const response = await axios.delete(`${process.env.BACKEND_APP_URL}/profile/delete`, {
            headers: {
                Authorization: `Bearer ${accessToken}`,
                "Content-Type": "application/json"
            }
        })

        console.log(response);


        return { success: true, message: "Account deleted successfully" };

    } catch (error) {
        // console.log(error.response.data);
        return { success: false, message: "Failed to delete account" };
    }

}
