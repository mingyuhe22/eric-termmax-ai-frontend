// components/curator/PendingRequests.tsx
'use client'

import React from 'react'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'

interface PendingRequest {
  id: string
  type: string
  name: string
  market: string
  newValue: string
  validAt: string
  currentValue?: string
  status: 'unlocked' | 'locked' | 'pending'
}

interface PendingRequestsProps {
  requests: PendingRequest[]
  onApprove: (request: PendingRequest) => void
  onReject: (request: PendingRequest) => void
}

export default function PendingRequests({
  requests,
  onApprove,
  onReject
}: PendingRequestsProps) {
  return (
    <div className="space-y-6">
      {requests.map((request) => (
        <div 
          key={request.id}
          className="bg-[#0c1624] border border-[#1e2c3b] rounded-lg p-4 overflow-hidden"
        >
          <div className="flex justify-between items-start mb-2">
            <div className="flex flex-col">
              <h3 className="text-white font-medium">{request.name}</h3>
              {request.currentValue && (
                <div className="text-sm text-gray-400 mt-1">
                  Current: {request.currentValue}
                </div>
              )}
              <div className="text-xs text-gray-400 mt-1">
                {request.market}
              </div>
            </div>
            <Badge 
              className={`
                ${request.status === 'unlocked' 
                  ? 'bg-green-500/20 text-green-400 border-green-500/30' 
                  : request.status === 'locked'
                    ? 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30'
                    : 'bg-blue-500/20 text-blue-400 border-blue-500/30'
                }
              `}
            >
              {request.status === 'unlocked' ? 'Unlocked' : request.status === 'locked' ? 'Locked' : 'Pending'}
            </Badge>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
            <div>
              <div className="text-sm text-gray-400 mb-2">New Value:</div>
              <Input 
                value={request.newValue} 
                readOnly
                className="bg-[#081020] border-[#1e2c3b]"
              />
            </div>
            <div>
              <div className="text-sm text-gray-400 mb-2">Valid At:</div>
              <Input 
                value={request.validAt} 
                readOnly
                className="bg-[#081020] border-[#1e2c3b]"
              />
            </div>
          </div>
          
          {request.status === 'unlocked' && (
            <div className="flex justify-end gap-3 mt-4">
              <Button 
                variant="outline" 
                className="border-red-500/30 text-red-400 hover:bg-red-500/10"
                onClick={() => onReject(request)}
              >
                Reject
              </Button>
              <Button 
                className="bg-[#2a4365] hover:bg-[#2c5282] text-white border-[#3182CE]/30"
                onClick={() => onApprove(request)}
              >
                Approve
              </Button>
            </div>
          )}
        </div>
      ))}
      
      {requests.length === 0 && (
        <div className="bg-[#0c1624] border border-[#1e2c3b] rounded-lg p-8 text-center">
          <div className="p-8 flex flex-col items-center">
            <div className="h-16 w-16 rounded-full bg-[#1e2c3b] flex items-center justify-center mb-4">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-gray-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path>
                <circle cx="9" cy="7" r="4"></circle>
                <path d="M23 21v-2a4 4 0 0 0-3-3.87"></path>
                <path d="M16 3.13a4 4 0 0 1 0 7.75"></path>
              </svg>
            </div>
            <h3 className="text-xl font-medium text-white mb-2">No Pending Requests</h3>
            <p className="text-gray-400 max-w-md">
              There are no pending requests for this vault at the moment.
            </p>
          </div>
        </div>
      )}
    </div>
  )
}