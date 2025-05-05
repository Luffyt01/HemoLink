'use server'

import axios from 'axios';
import { z } from 'zod'




export async function completeHospitalProfile(prevState: any, formData: FormData) {
  // For debugging:
  console.log('Raw FormData entries:')
  for (const [key, value] of formData.entries()) {
    console.log(key, value)
  }
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
      establishmentYear:{ 
       value: Number(formData.get('establishmentYear')),
       leap:false
      } ,
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

  

    const response =axios.post(`${process.env.BACKEND_APP_URL}/hospitals/completeProfile`, parsedData,{
      headers: {
        'Authorization': `${formData.get('token')}`,
        'Content-Type': 'application/json'
      }
    })

    return { 
      success: true,
      message: 'Hospital profile saved successfully' 
    }
  } catch (error) {
    console.error('Validation Error:', error)
    
    if (error instanceof z.ZodError) {
      // Format Zod errors into a more usable structure
      const fieldErrors = error.flatten().fieldErrors
      return { 
        success: false,
        error: 'Validation failed',
        fieldErrors,
        message: 'Please correct the errors in the form'
      }
    }
    
    return { 
      success: false,
      error: error instanceof Error ? error.message : 'Something went wrong',
      message: 'Failed to save hospital profile'
    }
  }
}