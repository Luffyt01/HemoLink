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
import { toast } from 'sonner'
import { cancel_Blood_Request_Hospital } from '@/actions/Hospital/new_request_all_action/cancle_request'
import { useAuthStore } from '@/lib/stores/useAuthStore'
import { urgencyChangeRequest } from '@/actions/Hospital/new_request_all_action/urgency_change_request'
import { statusChangeRequest } from '@/actions/Hospital/new_request_all_action/status_change_request'

interface RequestActionsProps {
  request: {
    id: string
    status: "PENDING" | "FULFILLED" | "EXPIRED"
    urgency: "LOW" | "MEDIUM" | "HIGH"
  }
 f
}

export function RequestActions({ request }: RequestActionsProps) {
  const [showCancelDialog, setShowCancelDialog] = useState(false)
  const [showStatusSelect, setShowStatusSelect] = useState(false)
  const [showUrgencySelect, setShowUrgencySelect] = useState(false)
  const [selectedStatus, setSelectedStatus] = useState(request.status)
  const [selectedUrgency, setSelectedUrgency] = useState(request.urgency)
  const [isLoading, setIsLoading] = useState(false)
  const [isLoadingCancel, setIsLoadingCancel] = useState(false)
  const {session } = useAuthStore()


  const updateStatus = async () => {
    setIsLoading(true)
    try {
      const response:any = await  statusChangeRequest(request.id,selectedStatus,session?.token||"")

      if(response.status === 200){
        toast.success(response.message)
      }
      if(response.status === 400){
        toast.error(response.message)
      }
      if(response.status === 500){
        toast.error(response.message)
      }
      
     // Trigger parent to refresh data
      setShowStatusSelect(false)
    } catch (error) {
      console.error('Error updating status:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const updateUrgency = async () => {
    setIsLoading(true)
    try {
      const response:any = await urgencyChangeRequest(request.id,selectedUrgency,session?.token||"");
      if(response.status === 200){
        toast.success(response.message)
      }
      if(response.status === 400){
        toast.error(response.message)
      }
      if(response.status === 500){
        toast.error(response.message)
      }
      
      
     // Trigger parent to refresh data
      setShowUrgencySelect(false)
    } catch (error) {
      console.error('Error updating urgency:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const cancelRequest = async () => {
    setIsLoadingCancel(true)
    try {
      console.log(request)
      const response:any = await cancel_Blood_Request_Hospital(request.id,session?.token||"")
      if(response.status === 200){
        toast.success(response.message)
      }
      if(response.status === 400){
        toast.error(response.message)
      }
      if(response.status === 500){
        toast.error(response.message)
      }
      setShowCancelDialog(false)
    } catch (error) {
      console.error('Error canceling request:', error)
     
    } finally {
      setIsLoadingCancel(false)
    }
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
          <DropdownMenuItem onClick={() => {
            setSelectedUrgency(request.urgency)
            setShowUrgencySelect(true)
          }}>
            Change Urgency
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => {
            setSelectedStatus(request.status)
            setShowStatusSelect(true)
          }}>
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

      {/* Cancel Dialog */}
      {showCancelDialog && (
        <div className="fixed inset-0 text-black bg-black/80 flex items-center justify-center z-50 ">
          <div className="bg-white p-6 rounded-lg w-96 mx-2 ">
            <h3 className="text-lg font-semibold mb-2">Are you sure?</h3>
            <p className="text-gray-600 mb-4 text-wrap">
              This action cannot be undone. This will permanently cancel the blood request.
            </p>
            <div className="flex justify-end gap-2">
              <Button 
                variant="outline" 
                onClick={() => setShowCancelDialog(false)}
                
                className='text-black hover:text-black/75 cursor-pointer'

              >
                Cancel
              </Button>
              <Button 
                
                onClick={cancelRequest}
                className='text-white bg-red-600 hover:bg-red-700 cursor-pointer'
                
              >
                {isLoadingCancel   ? "Processing..." : "Confirm Cancel"}
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Urgency Dialog */}
      {showUrgencySelect && (
        <div className="fixed inset-0 bg-black/80  text-black flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg w-80 mx-2 ">
            <h3 className="text-lg font-medium mb-4">Change Urgency Level</h3>
            <select
              value={selectedUrgency}
              onChange={(e) => setSelectedUrgency(e.target.value as "LOW" | "MEDIUM" | "HIGH")}
              className="w-full p-2 border rounded mb-4"
              disabled={isLoading}
            >
              <option value="LOW">Low</option>
              <option value="MEDIUM">Medium</option>
              <option value="HIGH">High</option>
            </select>
            <div className="flex justify-end gap-2">
              <Button 
                variant="outline" 
                onClick={() => setShowUrgencySelect(false)}
                disabled={isLoading}
                className='text-black hover:text-black/75'

              >
                Cancel
              </Button>
              <Button 
                onClick={updateUrgency}
                disabled={isLoading || selectedUrgency === request.urgency}
              >
                {isLoading ? "Updating..." : "Update"}
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Status Dialog */}
      {showStatusSelect && (
        <div className="fixed inset-0 bg-black/80 text-black flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg w-80 mx-2">
            <h3 className="text-lg font-medium mb-4">Change Request Status</h3>
            <select
              value={selectedStatus}
              onChange={(e) => setSelectedStatus(e.target.value as "PENDING" | "FULFILLED" | "EXPIRED")}
              className="w-full p-2 border rounded mb-4"
              disabled={isLoading}
            >
              <option value="PENDING">Pending</option>
              <option value="FULFILLED">Fulfilled</option>
              <option value="EXPIRED">Expired</option>
            </select>
            <div className="flex justify-end gap-2">
              <Button 
                variant="outline" 
                onClick={() => setShowStatusSelect(false)}
                disabled={isLoading}
                className='text-black hover:text-black/75'
              >
                Cancel
              </Button>
              <Button 
                onClick={updateStatus}
                disabled={isLoading || selectedStatus === request.status}
              >
                {isLoading ? "Updating..." : "Update"}
              </Button>
            </div>
          </div>
        </div>
      )}
    </>
  )
}