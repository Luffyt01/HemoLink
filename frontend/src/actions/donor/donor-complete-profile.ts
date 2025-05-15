'use server'

import axios from 'axios'
import { stat } from 'fs'
import { z } from 'zod'

export async function completeDonorProfile(prevState: any, formData: FormData) {
  // console.log('Raw FormData entries:')
  // for (const [key, value] of formData.entries()) {
  //   console.log(key, value)
  // }
  // console.log("dddddddddddddddddddddddddddddddddddddddddddddd")

  try {
    const parsedData = {
      token: formData.get('token'),
      name: formData.get('name'),
      age: Number(formData.get('age')),
      address: formData.get('address'),
      bloodType: formData.get('bloodType'),
      location: {
        lat: Number(formData.get('location[lat]')),
        lng:Number(formData.get('location[lng]'))
      },
      isAvailable: formData.get('isAvailable') === 'true',
      phone: formData.get('phone'),
      emergencyContact: formData.get('emergencyContact')
    }

    // console.log('Parsed Data Before Validation:', parsedData)
    interface location1 {
      coordinates: [number, number]; // Tuple of two numbers
     
    }
   
    const inputData  = {
      name: parsedData.name,
      age: parsedData.age,
      emergencyContact: parsedData.emergencyContact,
      address:parsedData.address,
      bloodType: parsedData.bloodType,
      location: {
        coordinates: [
          parsedData.location.lat,
          parsedData.location.lng,
        ],
      
      } as location1,
      isAvailable: parsedData.isAvailable,
    }
    console.log(inputData.location.coordinates)
    const response  = await axios.post(`${process.env.BACKEND_APP_URL}/donors/completeProfile`,inputData,{
      headers: {
        'Authorization': `Bearer ${parsedData.token}`,
        'Content-Type': 'application/json'
      }
    }
  )

    // console.log('Response:', response)
    // console.log('Response:222222222222222222222222222222222222',response.data)
    


  

    return { 
      success: true,
      sataus:200
     }
  } catch (error) {
    // console.error('Validation Error:', error.response)
    
  
    if(error instanceof axios.AxiosError) {
      
      if(error?.response?.data.statusCode === 'PRECONDITION_FAILED'){
        return { 
          success: false,
          status: 400,
          error: error?.response?.data?.error.split(':')[0] || 'Network error',
          details: error?.response?.data 
        }
      }
      if(error?.response?.data.statusCode === 'UNAUTHORIZED' ){
        return { 
          status: 401,
          success: false,
          error: error?.response?.data?.error.split(':')[0] || 'Network error',
          details: error?.response?.data 
        }
      }
      if(error?.response?.data.statusCode === 'FORBIDDEN'){
        return { 
          status: 403,
          success: false,
          error: error?.response?.data?.error.split(':')[0] || 'Network error',
          details: error?.response?.data 
        }
      }
      if(error?.response?.data.statusCode === 'NOT_FOUND'){
        return { 
          status: 404,
          success: false,
          error: error?.response?.data?.error.split(':')[0] || 'Network error',
          details: error?.response?.data 
        }
      }
    }
    
    return { 
      success: false,
      status: 500,
      error: error instanceof Error ? error.message : 'Something went wrong' 
    }
  }
}