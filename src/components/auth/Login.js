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
  Link,
  Paper,
  Stack
} from '@mui/material';

const Login = () => {
  const navigate = useNavigate();
  const { login, error } = useAuth();
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await login(formData.email, formData.password);
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
            Welcome Back
          </Typography>
          <Typography variant="subtitle1" color="text.secondary">
            Sign in to your account
          </Typography>
          {error && <Alert severity="error" sx={{ width: '100%' }}>{error}</Alert>}
          <Box component="form" onSubmit={handleSubmit} sx={{ mt: 1, width: '100%' }}>
            <TextField
              margin="normal"
              required
              fullWidth
              placeholder="Email Address"
              name="email"
              autoComplete="email"
              autoFocus
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
            />
            <TextField
              margin="normal"
              required
              fullWidth
              placeholder="Password"
              name="password"
              type="password"
              autoComplete="current-password"
              value={formData.password}
              onChange={(e) => setFormData({ ...formData, password: e.target.value })}
            />
            <Box display="flex" justifyContent="flex-end" mb={2}>
              <Link component={RouterLink} to="#" variant="body2" underline="hover" color="primary">
                Forgot password?
              </Link>
            </Box>
            <Button
              type="submit"
              fullWidth
              variant="contained"
              size="large"
              sx={{ mt: 1, mb: 2, borderRadius: 2 }}
              disabled={loading}
            >
              {loading ? 'Signing in...' : 'Sign In'}
            </Button>
            <Box display="flex" justifyContent="center">
              <Typography variant="body2" color="text.secondary">
                Don't have an account?{' '}
                <Link component={RouterLink} to="/register" variant="body2" underline="hover" color="primary">
                  Sign Up
                </Link>
              </Typography>
            </Box>
          </Box>
        </Stack>
      </Paper>
    </Container>
  );
};

export default Login;