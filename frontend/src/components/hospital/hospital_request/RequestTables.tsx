"use client"

import {
    Table,
    TableBody,
    TableCaption,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
  } from "@/components/ui/table";
  import { Badge } from "@/components/ui/badge";
  
  interface Request {
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
  
  interface RequestTablesProps {
    activeRequests: Request[];
    completedRequests: Request[];
  }
  
  export function RequestTables({ activeRequests, completedRequests }: RequestTablesProps) {
    const formatBloodType = (type: string) => {
      const map: Record<string, string> = {
        "A_POSITIVE": "A+",
        "A_NEGATIVE": "A-",
        "B_POSITIVE": "B+",
        "B_NEGATIVE": "B-",
        "AB_POSITIVE": "AB+",
        "AB_NEGATIVE": "AB-",
        "O_POSITIVE": "O+",
        "O_NEGATIVE": "O-"
      };
      return map[type] || type;
    };
  
    const getUrgencyColor = (urgency: string) => {
      switch (urgency) {
        case "HIGH": return "bg-red-500/20 text-red-600";
        case "MEDIUM": return "bg-yellow-500/20 text-yellow-600";
        case "LOW": return "bg-green-500/20 text-green-600";
        default: return "bg-gray-500/20 text-gray-600";
      }
    };
  
    const getStatusColor = (status: string) => {
      switch (status) {
        case "PENDING": return "bg-blue-500/20 text-blue-600";
        case "FULFILLED": return "bg-green-500/20 text-green-600";
        case "EXPIRED": return "bg-purple-500/20 text-purple-600";
        case "CANCELLED": return "bg-gray-500/20 text-gray-600";
        default: return "bg-gray-500/20 text-gray-600";
      }
    };
  
    return (
      <div className="space-y-12">
        {/* Active Requests */}
        <div className="bg-white rounded-xl shadow-md overflow-hidden">
          <div className="p-6 border-b border-gray-200">
            <h2 className="text-xl font-semibold text-gray-800">Active Requests</h2>
            <p className="text-gray-600 mt-1">Requests currently seeking donors</p>
          </div>
          <div className="overflow-x-auto">
            <Table>
              <TableHeader className="bg-gray-50">
                <TableRow>
                  <TableHead className="text-gray-700">Blood Type</TableHead>
                  <TableHead className="text-gray-700">Units</TableHead>
                  <TableHead className="text-gray-700">Urgency</TableHead>
                  <TableHead className="text-gray-700">Created</TableHead>
                  <TableHead className="text-gray-700">Expires</TableHead>
                  <TableHead className="text-gray-700">Status</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {activeRequests.map((request) => (
                  <TableRow key={request.id} className="hover:bg-gray-50">
                    <TableCell className="font-medium">
                      {formatBloodType(request.bloodType)}
                    </TableCell>
                    <TableCell>{request.unitsRequired}</TableCell>
                    <TableCell>
                      <Badge className={getUrgencyColor(request.urgency)}>
                        {request.urgency}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      {new Date(request.createdAt).toLocaleDateString()}
                    </TableCell>
                    <TableCell>
                      {new Date(request.expiryTime).toLocaleDateString()}
                    </TableCell>
                    <TableCell>
                      <Badge className={getStatusColor(request.status)}>
                        {request.status}
                      </Badge>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </div>
  
        {/* Completed Requests */}
        <div className="bg-white rounded-xl shadow-md overflow-hidden">
          <div className="p-6 border-b border-gray-200">
            <h2 className="text-xl font-semibold text-gray-800">Completed Requests</h2>
            <p className="text-gray-600 mt-1">Historical fulfilled or expired requests</p>
          </div>
          <div className="overflow-x-auto">
            <Table>
              <TableHeader className="bg-gray-50">
                <TableRow>
                  <TableHead className="text-gray-700">Blood Type</TableHead>
                  <TableHead className="text-gray-700">Units</TableHead>
                  <TableHead className="text-gray-700">Urgency</TableHead>
                  <TableHead className="text-gray-700">Created</TableHead>
                  <TableHead className="text-gray-700">Completed</TableHead>
                  <TableHead className="text-gray-700">Status</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {completedRequests.map((request) => (
                  <TableRow key={request.id} className="hover:bg-gray-50">
                    <TableCell className="font-medium">
                      {formatBloodType(request.bloodType)}
                    </TableCell>
                    <TableCell>{request.unitsRequired}</TableCell>
                    <TableCell>
                      <Badge className={getUrgencyColor(request.urgency)}>
                        {request.urgency}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      {new Date(request.createdAt).toLocaleDateString()}
                    </TableCell>
                    <TableCell>
                      {new Date(request.expiryTime).toLocaleDateString()}
                    </TableCell>
                    <TableCell>
                      <Badge className={getStatusColor(request.status)}>
                        {request.status}
                      </Badge>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </div>
      </div>
    );
  } 