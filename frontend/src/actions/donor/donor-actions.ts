'use server'

import { z } from 'zod'

export async function completeDonorProfile(prevState: any, formData: FormData) {
  // console.log('Raw FormData entries:')
  // for (const [key, value] of formData.entries()) {
  //   console.log(key, value)
  // }

  try {
    const parsedData = {
      name: formData.get('name'),
      age: Number(formData.get('age')),
      address: formData.get('address'),
      bloodType: formData.get('bloodType'),
      location: {
        lat: Number(formData.get('location[lat]')),
        lng: Number(formData.get('location[lng]'))
      },
      isAvailable: formData.get('isAvailable') === 'true',
      phone: formData.get('phone'),
      emergencyContact: formData.get('emergencyContact')
    }

    console.log('Parsed Data Before Validation:', parsedData)

    // const validatedData = schema.parse(parsedData)
    // console.log('Validated Data:', validatedData)

  

    return { success: true }
  } catch (error) {
    console.error('Validation Error:', error)
    
    if (error instanceof z.ZodError) {
      return { 
        error: error.errors[0]?.message || 'Validation failed',
        details: error.errors 
      }
    }
    
    return { 
      error: error instanceof Error ? error.message : 'Something went wrong' 
    }
  }
}