import React, { lazy, Suspense } from 'react'
import { Routes, Route } from 'react-router-dom'
import Navbar from './components/Navbar'
import AdminRoute from './components/AdminRoute'
import TrainerRoute from './components/TrainerRoute'
import StudentRoute from './components/StudentRoute'
import { ToastContainer } from 'react-toastify'
import Footer from './components/Footer'
import LoadingScreen from './components/LoadingScreen'

// Lazy loaded pages
const Home = lazy(() => import('./pages/Home'))
const Auth = lazy(() => import('./pages/Auth'))
const Course = lazy(() => import('./pages/Course'))
const CourseDetails = lazy(() => import('./pages/CourseDetails'))
const AdminDashboard = lazy(() => import('./pages/AdminDashboard'))
const TrainerDashboard = lazy(() => import('./pages/TrainerDashboard'))
const StudentDashboard = lazy(() => import('./pages/StudentDashboard'))
const HeroDashboard = lazy(() => import('./pages/HeroDashboard'))
const StudentAttendance = lazy(() => import('./components/StudentAttendance'))


export default function App(){
  return (
    <div className="relative min-h-screen font-sans selection:bg-blue-100 selection:text-blue-900">
      <div className="robust-bg">
        <div className="robust-bg-blob top-0 left-0"></div>
        <div className="robust-bg-blob bottom-0 right-0" style={{ animationDelay: '-10s' }}></div>
      </div>
      
      <Navbar />
      <div className="relative z-10">
        <Suspense fallback={<LoadingScreen />}>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/auth" element={<Auth />} />
            <Route path="/courses" element={<Course />} />
            <Route path="/courses/:id" element={<CourseDetails />} />
            <Route path="/about" element={<HeroDashboard/>} />
            
            {/* Student's own attendance view */}
            <Route path="/my-attendance" element={<StudentRoute><StudentAttendance /></StudentRoute>} />
            
            {/* Universal attendance view (for trainers/admins to view any student) */}
            <Route path="/student-attendance" element={<StudentAttendance />} />
          
            <Route path="/admin" element={<AdminRoute><AdminDashboard /></AdminRoute>} />
            <Route path="/trainer" element={<TrainerRoute><TrainerDashboard /></TrainerRoute>} />
            <Route path="/student" element={<StudentRoute><StudentDashboard /></StudentRoute>} />
          </Routes>
        </Suspense>
      </div>
      <ToastContainer 
        position="top-right" 
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="light"
      />
      <Footer/>
    </div>
  )
}