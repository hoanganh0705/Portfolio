export interface FeedbackState {
  status: 'idle' | 'success' | 'error'
  message: string
  timestamp: number
}

export interface ContactFormData {
  firstName: string
  lastName: string
  email: string
  phone: string
  service: string
  message: string
}