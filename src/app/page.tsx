'use client';

import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import { useEffect } from 'react'
import { Container, Typography, Box, Button, CircularProgress } from '@mui/material';

export default function Home() {
  const { data: session, status } = useSession()
  const router = useRouter()

  useEffect(() => {
    if (status === 'loading') return // Still loading

    if (session) {
      // Redirect based on user role
      if (['ADMIN', 'STAFF'].includes(session.user.role)) {
        router.push('/dashboard')
      } else {
        router.push('/animals')
      }
    }
  }, [session, status, router])

  if (status === 'loading') {
    return (
      <Container>
        <Box display="flex" justifyContent="center" alignItems="center" minHeight="50vh">
          <CircularProgress />
        </Box>
      </Container>
    )
  }

  return (
    <Container maxWidth="lg">
      <Box sx={{ my: 4, textAlign: 'center' }}>
        <Typography variant="h2" component="h1" gutterBottom>
          Animal Shelter Management System
        </Typography>
        <Typography variant="h5" component="h2" gutterBottom>
          Welcome to the comprehensive platform for managing animal shelters
        </Typography>
        <Typography variant="body1" sx={{ mb: 4 }}>
          This system helps manage animals, volunteers, adoptions, and resources efficiently.
        </Typography>
        
        <Box display="flex" gap={2} justifyContent="center">
          <Button 
            variant="contained" 
            size="large"
            onClick={() => router.push('/auth/signin')}
          >
            Sign In
          </Button>
          <Button 
            variant="outlined" 
            size="large"
            onClick={() => router.push('/auth/signup')}
          >
            Sign Up
          </Button>
        </Box>
      </Box>
    </Container>
  );
}