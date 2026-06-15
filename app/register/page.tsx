'use client'
import { useEffect } from 'react'

export default function RegisterPage() {
  useEffect(() => {
    // Redirect to app.fiscit.com dashboard
    window.location.href = 'https://app.fiscit.com/register'
  }, [])

  return null
}