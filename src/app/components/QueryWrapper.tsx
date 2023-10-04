"use client"
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import React, { ReactNode } from 'react'
import { Toaster } from 'react-hot-toast'

interface QueryProps {
    children?: ReactNode
}
const queryClient = new QueryClient();

const QueryWrapper = ({children}:QueryProps) => {
  return (
    <QueryClientProvider client={queryClient}><Toaster />{children}</QueryClientProvider>
  )
}

export default QueryWrapper