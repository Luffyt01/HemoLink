

"use server"

import axios from "axios"

export const HospitalNewRequestAction = async (pre: any, formdata: FormData) => {
    console.log(formdata)
   

    try{
 const formData = {
        bloodType: formdata.get("bloodType"),
        unitsRequired: formdata.get("unitsRequired"),
        urgency: formdata.get("urgency"),
        expiryTime: formdata.get("expiryTime")
    }
    const token = formdata.get("token") || null;
    console.log(token)
    const response = await axios.post(`${process.env.BACKEND_APP_URL1}/requests/create`,
        formData
        , {
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            }
        })

        
    }catch(error){
        console.error("Error creating request:", error);
       
    }

}