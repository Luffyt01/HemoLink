"use client"
import { useState } from 'react'
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { MoreHorizontal } from "lucide-react"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

interface RequestActionsProps {
  request: {
    id: string
    status: "PENDING" | "FULFILLED" | "EXPIRED"
    urgency: "LOW" | "MEDIUM" | "HIGH"
  }
 
}

export function RequestActions({ request }: RequestActionsProps) {
    
  const [showCancelDialog, setShowCancelDialog] = useState(false)
  const [showStatusSelect, setShowStatusSelect] = useState(false)
  const [showUrgencySelect, setShowUrgencySelect] = useState(false)
   const handleStatusChange = (id: string, status: "PENDING" | "FULFILLED" | "EXPIRED") => {
    // Update the request status in your state
    // You'll need to implement this based on your data structure
  }

  const handleUrgencyChange = (id: string, urgency: "LOW" | "MEDIUM" | "HIGH") => {
    // Update the request urgency in your state
    // You'll need to implement this based on your data structure
  }

  const handleCancel = (id: string) => {
    // Cancel the request in your state
    // You'll need to implement this based on your data structure
  }

  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" className="h-8 w-8 p-0">
            <MoreHorizontal className="h-4 w-4" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuItem onClick={() => setShowUrgencySelect(true)}>
            Change Urgency
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => setShowStatusSelect(true)}>
            Change Status
          </DropdownMenuItem>
          <DropdownMenuItem 
            className="text-red-600"
            onClick={() => setShowCancelDialog(true)}
          >
            Cancel Request
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      {/* Change Urgency Dialog */}
      {showUrgencySelect && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg w-80">
            <h3 className="text-lg font-medium mb-4">Change Urgency Level</h3>
            <Select
              defaultValue={request.urgency}
              onValueChange={(value: "LOW" | "MEDIUM" | "HIGH") => {
                handleUrgencyChange(request.id, value)
                setShowUrgencySelect(false)
              }}
            >
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Select urgency" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="LOW">Low</SelectItem>
                <SelectItem value="MEDIUM">Medium</SelectItem>
                <SelectItem value="HIGH">High</SelectItem>
              </SelectContent>
            </Select>
            <div className="flex justify-end gap-2 mt-4">
              <Button 
                variant="outline" 
                onClick={() => setShowUrgencySelect(false)}
              >
                Cancel
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Change Status Dialog */}
      {showStatusSelect && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg w-80">
            <h3 className="text-lg font-medium mb-4">Change Request Status</h3>
            <Select
              defaultValue={request.status}
              onValueChange={(value: "PENDING" | "FULFILLED" | "EXPIRED") => {
                handleStatusChange(request.id, value)
                setShowStatusSelect(false)
              }}
            >
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Select status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="PENDING">Pending</SelectItem>
                <SelectItem value="FULFILLED">Fulfilled</SelectItem>
                <SelectItem value="EXPIRED">Expired</SelectItem>
              </SelectContent>
            </Select>
            <div className="flex justify-end gap-2 mt-4">
              <Button 
                variant="outline" 
                onClick={() => setShowStatusSelect(false)}
              >
                Cancel
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Cancel Request Dialog */}
      <AlertDialog open={showCancelDialog} onOpenChange={setShowCancelDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently cancel the blood request.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction 
            
              className="bg-red-600 hover:bg-red-700"
              onClick={() => {
                handleCancel(request.id)
                setShowCancelDialog(false)
              }}
            >
              Confirm Cancel
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  )
}