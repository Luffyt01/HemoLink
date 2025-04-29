'use server'

import { z } from 'zod'




export async function completeHospitalProfile(prevState: any, formData: FormData) {
  // For debugging:
  console.log('Raw FormData entries:')
  for (const [key, value] of formData.entries()) {
    console.log(key, value)
  }

  try {
    // Parse form data into structured object
    const parsedData = {
      hospitalName: formData.get('hospitalName'),
      licenseNumber: formData.get('licenseNumber'),
      hospitalType: formData.get('hospitalType'),
      establishmentYear: Number(formData.get('establishmentYear')),
      address: formData.get('address'),
      location: {
        lat: Number(formData.get('location[lat]')),
        lng: Number(formData.get('location[lng]'))
      },
      mainPhone: formData.get('mainPhone'),
      emergencyPhone: formData.get('emergencyPhone'),
      email: formData.get('email'),
      website: formData.get('website'),
      operatingHours: formData.get('operatingHours'),
      description: formData.get('description')
    }

    console.log('Parsed Data Before Validation:', parsedData)

  

    // Here you would typically save to database
    // Example:
    // const hospital = await db.hospital.create({
    //   data: {
    //     ...validatedData,
    //     latitude: validatedData.location.lat,
    //     longitude: validatedData.location.lng
    //   }
    // })

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