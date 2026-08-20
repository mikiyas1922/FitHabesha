import { useCallback, useEffect, useState } from 'react'
import { memberService } from '../services/memberService'
import { unwrapResource, getApiErrorMessage } from '../utils/apiHelpers'
import { authService } from '../services/authService'

/**
 * Hook for fetching and managing the current member's profile.
 * Handles GET /members/me and PATCH /members/{id} endpoints.
 */
export function useMemberProfile() {
  const [profile, setProfile] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  const fetchProfile = useCallback(async () => {
    setLoading(true)
    setError(null)

    // Check authentication first
    if (!authService.isAuthenticated()) {
      setError('You must be logged in to view your profile.')
      setLoading(false)
      return null
    }

    const currentUser = authService.getCurrentUser()
    console.log('Current user:', currentUser)
    console.log('User role:', currentUser?.role)

    // Check if user has member role
    if (currentUser?.role && currentUser.role !== 'member') {
      console.warn('User is not a member, role:', currentUser.role)
      setError(`Access denied. The member profile endpoint is only accessible to members. Your current role is: ${currentUser.role}`)
      setLoading(false)
      return null
    }

    try {
      const response = await memberService.getCurrentMemberProfile()
      console.log('Member profile response:', response)
      
      const unwrapped = unwrapResource(response)
      console.log('Unwrapped response:', unwrapped)
      
      // Handle both direct data and nested data formats
      const profileData = unwrapped?.data || unwrapped || response?.data || response
      console.log('Profile data:', profileData)
      
      setProfile(profileData)
      return profileData
    } catch (err) {
      console.error('Error fetching member profile:', err)
      console.error('Error status:', err?.status)
      console.error('Error details:', err?.details)
      
      // Handle specific error cases
      if (err?.status === 403) {
        setError('Access denied. You may not have permission to access member profiles. Please ensure you are logged in as a member.')
      } else if (err?.status === 401) {
        setError('Your session has expired. Please log in again.')
        authService.clearSession()
        window.location.href = '/login'
      } else if (err?.status === 404) {
        setError('Member profile not found. Please contact support.')
      } else {
        const message = getApiErrorMessage(err, 'Failed to load member profile')
        setError(message)
      }
      return null
    } finally {
      setLoading(false)
    }
  }, [])

  const updateProfile = useCallback(async (profileId, updates) => {
    setLoading(true)
    setError(null)

    try {
      const response = await memberService.updateMember(profileId, updates)
      console.log('Update profile response:', response)
      
      const unwrapped = unwrapResource(response)
      
      // Handle both direct data and nested data formats
      const updatedData = unwrapped?.data || unwrapped || response?.data || response
      setProfile(updatedData)
      return updatedData
    } catch (err) {
      console.error('Error updating member profile:', err)
      
      if (err?.status === 403) {
        setError('Access denied. You do not have permission to update this profile.')
      } else if (err?.status === 401) {
        setError('Your session has expired. Please log in again.')
        authService.clearSession()
        window.location.href = '/login'
      } else {
        const message = getApiErrorMessage(err, 'Failed to update member profile')
        setError(message)
      }
      throw err
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    fetchProfile()
  }, [fetchProfile])

  return {
    profile,
    loading,
    error,
    fetchProfile,
    updateProfile,
  }
}
