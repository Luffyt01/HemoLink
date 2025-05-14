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
  if (!token || typeof token !== "string") {
    console.error("Invalid token provided");
    return {
      message: "Invalid token",
      status: 400,
    };
  }

  try {
    const response = await axios.post(
      `${process.env.BACKEND_APP_URL}/auth/logout`,
      {}, // Explicit empty body
      {
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`
        },
        timeout: 5000,
        withCredentials: true,
       
      }
    );
    console.log(    "sdqd",response.data)

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

  } catch (error: unknown) {
    console.log(error)  
    // Type-safe error handling
    if (axios.isAxiosError(error)) {
      console.error("Logout failed - API Error:", {
        status: error.response?.status,
        data: error.response?.data,
      });

      return {
        message: error.response?.data?.message || "Logout failed",
        status: error.response?.status || 500,
        error: error.response?.data,
      };
    }

    // Handle non-Axios errors
    console.error("Logout failed - Unexpected Error:", error);
    return {
      message: "Unexpected error during logout",
      status: 500,
      error: error instanceof Error ? error.message : String(error),
    };
  }
};

export default logout_Action;