import ProtectedRoute from '../components/auth/ProtectedRoute';
import MainLayout from '../components/MainLayout';
import WomensHealth from '../pages/WomensHealth';
import MensHealth from '../pages/MensHealth';
import MentalHealth from '../pages/MentalHealth';
import VideoConsultation from '../components/VideoConsultation';
import Dashboard from '../pages/Dashboard';
import UserManagement from '../pages/UserManagement';
import DoctorManagement from '../pages/DoctorManagement';
import BookingSystem from '../components/BookingSystem/PatientBooking';
import DoctorCalendar from '../components/BookingSystem/DoctorCalendar';
import Products from '../pages/Products';
// Define routes for each role
export const routes = {
  patient: [
    {
      path: '/womens-health',
      element: <ProtectedRoute allowedRoles={['patient']}><MainLayout><WomensHealth /></MainLayout></ProtectedRoute>
    },
    {
      path: '/mens-health',
      element: <ProtectedRoute allowedRoles={['patient']}><MainLayout><MensHealth /></MainLayout></ProtectedRoute>
    },
    {
      path: '/mental-health',
      element: <ProtectedRoute allowedRoles={['patient']}><MainLayout><MentalHealth /></MainLayout></ProtectedRoute>
    },
    {
      path: '/video-consultation',
      element: <ProtectedRoute allowedRoles={['patient']}><MainLayout><VideoConsultation /></MainLayout></ProtectedRoute>
    },
    {
      path: '/book-appointment',
      element: <ProtectedRoute allowedRoles={['patient']}><MainLayout><BookingSystem /></MainLayout></ProtectedRoute>
    },
    {
      path: '/products',
      element: <ProtectedRoute allowedRoles={['patient']}><MainLayout><Products /></MainLayout></ProtectedRoute>
    }, 
    {
      path: '/dashboard',
      element: <ProtectedRoute allowedRoles={['patient']}><MainLayout><Dashboard /></MainLayout></ProtectedRoute>
    }
  ],
  doctor: [
    {
      path: '/video-consultation',
      element: <ProtectedRoute allowedRoles={['doctor']}><MainLayout><VideoConsultation /></MainLayout></ProtectedRoute>
    },
    {
      path: '/doctor/calendar',
      element: <ProtectedRoute allowedRoles={['doctor']}><MainLayout><DoctorCalendar /></MainLayout></ProtectedRoute>
    }
  ],
  admin: [
    {
      path: '/dashboard',
      element: <ProtectedRoute allowedRoles={['admin']}><MainLayout><Dashboard /></MainLayout></ProtectedRoute>
    },
    {
      path: '/user-management',
      element: <ProtectedRoute allowedRoles={['admin']}><MainLayout><UserManagement /></MainLayout></ProtectedRoute>
    },
    {
      path: '/doctor-management',
      element: <ProtectedRoute allowedRoles={['admin']}><MainLayout><DoctorManagement /></MainLayout></ProtectedRoute>
    },
    {
      path: '/womens-health',
      element: <ProtectedRoute allowedRoles={['admin']}><MainLayout><WomensHealth /></MainLayout></ProtectedRoute>
    },
    {
      path: '/mens-health',
      element: <ProtectedRoute allowedRoles={['admin']}><MainLayout><MensHealth /></MainLayout></ProtectedRoute>
    },
    {
      path: '/mental-health',
      element: <ProtectedRoute allowedRoles={['admin']}><MainLayout><MentalHealth /></MainLayout></ProtectedRoute>
    },
    {
      path: '/video-consultation',
      element: <ProtectedRoute allowedRoles={['admin']}><MainLayout><VideoConsultation /></MainLayout></ProtectedRoute>
    },
    {
      path: '/book-appointment',
      element: <ProtectedRoute allowedRoles={['admin']}><MainLayout><BookingSystem /></MainLayout></ProtectedRoute>
    },
    {
      path: '/doctor/calendar',
      element: <ProtectedRoute allowedRoles={['admin']}><MainLayout><DoctorCalendar /></MainLayout></ProtectedRoute>
    }
  ]
};

// Helper function to get allowed routes for a user
export const getAllowedRoutes = (user) => {
  if (!user) return [];
  
  if (user.role === 'admin') {
    return routes.admin;
  } else if (user.role === 'doctor') {
    return routes.doctor;
  } else if (user.role === 'patient') {
    // For patients in California, filter out mental health
    if (user.state === 'California') {
      return routes.patient.filter(route => route.path !== '/mental-health');
    }
    return routes.patient;
  }
  
  return [];
}; 