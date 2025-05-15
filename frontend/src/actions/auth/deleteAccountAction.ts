"use server"

export const deleteAccountAction = async (state: any, formData: FormData) => {

    try {
        const accessToken = formData.get("accessToken") as string;

        console.log(accessToken);
        if (!accessToken) {
            throw new Error("Access token is required");
        }


        return { success: true, message: "Account deleted successfully" };




    } catch (error) {

        return { success: false, message: "Failed to delete account" };
    }

}
