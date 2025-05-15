"use server"    
import axios from 'axios'


export const editProfileAction =async (prevState:any,formData:FormData) => {

    try {
        const data={
            name:formData.get("name"),
            age:formData.get("age"),
            phone:formData.get("phone"),
            address:formData.get("address"),
            isAvailable:formData.get("isAvailable"),
            location: {
                lat: Number(formData.get('location[lat]')),
                lng:Number(formData.get('location[lng]'))
              },
        }
console.log(data)
        // const res = await axios.post(`${process.env.}/donors/EditProfile`,data,{
        //     headers:{
        //         "Content-Type":"application/json",
               
        //     }
        // })
        return {
            status:200,
            message:"Profile updated successfully"
        }
       
    } catch (error) {
        return {
            status:500,
            message:"Failed to update profile"
        }
        
    }
    
 
}
