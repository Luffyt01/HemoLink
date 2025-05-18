export interface Request {
    id: string;
    hospitalId: string;
    hospitalName: string;
    bloodType: string;
    unitsRequired: number;
    urgency: string;
    location: {
      coordinates: number[];
      type: string;
    };
    createdAt: string;
    expiryTime: string;
    status: "PENDING" | "FULFILLED" | "EXPIRED" | "CANCELLED";
  }