'use server'

import axios from 'axios'
import { z } from 'zod'

export async function completeDonorProfile(prevState: any, formData: FormData) {
  // console.log('Raw FormData entries:')
  // for (const [key, value] of formData.entries()) {
  //   console.log(key, value)
  // }

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

    console.log('Parsed Data Before Validation:', parsedData)
    interface location1 {
      coordinates: [number, number]; // Tuple of two numbers
      type: string; // Typically "Point" for GeoJSON
    }
    // const validatedData = schema.parse(parsedData)
    // console.log('Validated Data:', validatedData)
    const response  = axios.post (`${process.env.BACKEND_APP_URL}/donors/completeProfile`,{
      name: parsedData.name,
      age: parsedData.age,
      emergencyContact: parsedData.emergencyContact,
      address:parsedData.address,
      bloodType: parsedData.bloodType,
      location: {
        coordinates: [
          parsedData.location.lng,
         parsedData.location.lat
        ],
        type: "Point"
      } as location1,
      isAvailable: parsedData.isAvailable,
    },{
      headers: {
        'Authorization': `${parsedData.token}`,
        'Content-Type': 'application/json'
      }
    }
  )

    console.log('Response:', response.data)
    


  

    return { success: true }
  } catch (error) {
    console.error('Validation Error:', error)
    
    if (error instanceof z.ZodError) {
      return { 
        error: error.errors[0]?.message || 'Validation failed',
        details: error.errors 
      }
    }
    if(error instanceof axios.AxiosError) {
      return { 
        error: error.response?.data?.message || 'Network error',
        details: error.response?.data 
      }
    }
    
    return { 
      error: error instanceof Error ? error.message : 'Something went wrong' 
    }
  }
}