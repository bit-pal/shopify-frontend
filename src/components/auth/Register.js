import React, { useState } from 'react';
import { useNavigate, Link as RouterLink } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import {
  Box,
  Button,
  TextField,
  Typography,
  Container,
  Alert,
  Grid,
  Link,
  Paper,
  Stack
} from '@mui/material';

const Register = () => {
  const navigate = useNavigate();
  const { register, error } = useAuth();
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    firstName: '',
    lastName: '',
    state: ''
  });
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await register(formData);
      navigate('/');
    } catch (err) {
      // Error is handled by the auth context
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container component="main" maxWidth="xs" sx={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <Paper elevation={6} sx={{ p: 4, width: '100%', borderRadius: 3 }}>
        <Stack spacing={2} alignItems="center">
          <Typography component="h1" variant="h4" fontWeight={700} color="primary.main" gutterBottom>
            Create Account
          </Typography>
          <Typography variant="subtitle1" color="text.secondary">
            Sign up to get started
          </Typography>
          {error && <Alert severity="error" sx={{ width: '100%' }}>{error}</Alert>}
          <Box component="form" onSubmit={handleSubmit} sx={{ mt: 1}}>
            <Grid container spacing={2}>
              <TextField
                required
                fullWidth
                placeholder="First Name"
                name="firstName"
                value={formData.firstName}
                onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
              />
              <TextField
                required
                fullWidth
                placeholder="Last Name"
                name="lastName"
                value={formData.lastName}
                onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
              />
              <TextField
                required
                fullWidth
                placeholder="Email Address"
                name="email"
                type="email"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              />
              <TextField
                required
                fullWidth
                placeholder="Password"
                name="password"
                type="password"
                value={formData.password}
                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
              />
              <TextField
                required
                fullWidth
                placeholder="State"
                name="state"
                value={formData.state}
                onChange={(e) => setFormData({ ...formData, state: e.target.value })}
              />
            </Grid>
            <Button
              type="submit"
              fullWidth
              variant="contained"
              size="large"
              sx={{ mt: 3, mb: 2, borderRadius: 2 }}
              disabled={loading}
            >
              {loading ? 'Signing up...' : 'Sign Up'}
            </Button>
            <Box display="flex" justifyContent="center">
              <Typography variant="body2" color="text.secondary">
                Already have an account?{' '}
                <Link component={RouterLink} to="/login" variant="body2" underline="hover" color="primary">
                  Sign In
                </Link>
              </Typography>
            </Box>
          </Box>
        </Stack>
      </Paper>
    </Container>
  );
};

export default Register;