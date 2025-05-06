'use server'

import axios from 'axios';
import { z } from 'zod'




export async function completeHospitalProfile(prevState: any, formData: FormData) {
  // For debugging:

  interface ServiceArea1 {
    coordinates: [number, number]; // Tuple of two numbers
    type: string; // Typically "Point" for GeoJSON
  }
  
  try {
    // Parse form data into structured object
    const parsedData = {
      hospitalName: formData.get('hospitalName'),
      licenceNumber: formData.get('licenseNumber'),
      hospitalType: formData.get('hospitalType'),
      establishmentYear:Number(formData.get('establishmentYear')) ,
      address: formData.get('address'),
      serviceArea: {
        coordinates: [
          Number(formData.get('location[lat]')), // Convert to number
          Number(formData.get('location[lng]'))  // Convert to number
        ],
        type: "Point" // Standard GeoJSON type for point coordinates
      } as ServiceArea1,
      // mainPhone: formData.get('mainPhone'),
      emergencyPhoneNo: formData.get('emergencyPhone'),
      // email: formData.get('email'),
      website: formData.get('website'),
      hospitalStatus: formData.get('hospitalStatus'),
      workingHours: formData.get('operatingHours'),
      description: formData.get('description')
    }

    console.log('Parsed Data Before Validation:', parsedData)

  

    const response = await axios.post(`${process.env.BACKEND_APP_URL}/hospitals/completeProfile`, parsedData,{
      headers: {
        'Authorization': `Bearer ${formData.get('token')}`,
        'Content-Type': 'application/json'
      }
    })

    return { 
      status:200,
      success: true,
      message: 'Hospital profile saved successfully' 
    }
  } catch (error) {
    console.error('Validation Error:', error.response?.data)
    
    
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
      error: error instanceof Error ? error.message : 'Something went wrong',
      message: 'Failed to save hospital profile'
    }
  }
}