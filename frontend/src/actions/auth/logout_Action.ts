"use server";

import axios from "axios";

interface LogoutResponse {
  message: string;
  status: number;
}

interface ErrorResponse {
  message: string;
  status: number;
  error?: any;
}

const logout_Action = async ({ token }: { token: string }): Promise<LogoutResponse | ErrorResponse> => {
  // Validate token exists
  console.log("token",token)
  try {
    const response = await axios.post(
      `${process.env.BACKEND_APP_URL}/auth/logout`,
      {}, // Explicit empty body
      {
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`
        },
        
       
      }
    );
    // console.log(    "sdqd",response.data)

    // Handle different successful status codes
    if (response.status === 204 || response.status === 200) {
      return {
        message: response.data?.message || "Logout successful",
        status: 200,
      };
    }

    // Handle other 2xx status codes if needed
    return {
      message: response.data?.message || "Logout completed",
      status: 200,

    };

  } catch (error: any) {
    console.log("error logout",error.response?.data)  
    // Type-safe error handling
    if (axios.isAxiosError(error)) {
      return {
        error: error.response?.data?.error || "Logout failed",
        status:  500,
        message: error.response?.data?.statusCode|| "Logout failed",


      };
    }

    // Handle non-Axios errors
    // console.error("Logout failed - Unexpected Error:", error);
    return {
      message: "Unexpected error during logout",
      status: 500,
      error: error instanceof Error ? error.message : String(error),
    };
  }
};

export default logout_Action;