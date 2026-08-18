import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { DashboardLayout } from './components/layout/DashboardLayout.jsx'
import { ProtectedRoute } from './components/auth/ProtectedRoute.jsx'
import { LandingPage } from './pages/landing/LandingPage.jsx'
import { LoginPage } from './pages/auth/LoginPage.jsx'
import { RegisterPage } from './pages/auth/RegisterPage.jsx'
import { ForgotPasswordPage } from './pages/auth/ForgotPasswordPage.jsx'
import { ResetPasswordPage } from './pages/auth/ResetPasswordPage.jsx'
import { AdminDashboard } from './pages/admin/AdminDashboard.jsx'
import { MembersManagement } from './pages/admin/MembersManagement.jsx'
import { TrainersManagement } from './pages/admin/TrainersManagement.jsx'
import { StaffManagement } from './pages/admin/StaffManagement.jsx'
import { AdminReports } from './pages/admin/AdminReports.jsx'
import { AdminSubscriptions } from './pages/admin/AdminSubscriptions.jsx'
import { AdminFeedback } from './pages/admin/AdminFeedback.jsx'
import { AdminClasses } from './pages/admin/AdminClasses.jsx'
import { TrainerDashboard } from './pages/trainer/TrainerDashboard.jsx'
import { MyClients } from './pages/trainer/MyClients.jsx'
import { TrainerSchedule } from './pages/trainer/TrainerSchedule.jsx'
import { WorkoutBuilder } from './pages/trainer/WorkoutBuilder.jsx'
import { MealPlanBuilder } from './pages/trainer/MealPlanBuilder.jsx'
import { MyRatings } from './pages/trainer/MyRatings.jsx'
import { ReceptionistDashboard } from './pages/receptionist/ReceptionistDashboard.jsx'
import { EquipmentTracking } from './pages/receptionist/EquipmentTracking.jsx'
import { LockerManagement } from './pages/receptionist/LockerManagement.jsx'
import { WalkInRegistration } from './pages/receptionist/WalkInRegistration.jsx'
import { MembersDirectory } from './pages/receptionist/MembersDirectory.jsx'
import { MemberDashboard } from './pages/member/MemberDashboard.jsx'
import { ProfileSettings } from './pages/settings/ProfileSettings.jsx'
import { MemberWorkouts } from './pages/member/MemberWorkouts.jsx'
import { MemberMeals } from './pages/member/MemberMeals.jsx'
import { MemberClasses } from './pages/member/MemberClasses.jsx'
import { MemberTrainers } from './pages/member/MemberTrainers.jsx'
import { MemberSubscriptions } from './pages/member/MemberSubscriptions.jsx'
import { MemberFeedback } from './pages/member/MemberFeedback.jsx'

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/forgot-password" element={<ForgotPasswordPage />} />
        <Route path="/reset-password" element={<ResetPasswordPage />} />
        <Route path="/reset-password/:token" element={<ResetPasswordPage />} />

        <Route
          path="/admin"
          element={
            <ProtectedRoute allowedRole="admin">
              <DashboardLayout role="admin" />
            </ProtectedRoute>
          }
        >
          <Route index element={<AdminDashboard />} />
          <Route path="staff" element={<StaffManagement />} />
          <Route path="members" element={<MembersManagement />} />
          <Route path="trainers" element={<TrainersManagement />} />
          <Route path="classes" element={<AdminClasses />} />
          <Route path="reports" element={<AdminReports />} />
          <Route path="subscriptions" element={<AdminSubscriptions />} />
          <Route path="feedback" element={<AdminFeedback />} />
          <Route path="settings" element={<ProfileSettings />} />
        </Route>

        <Route
          path="/trainer"
          element={
            <ProtectedRoute allowedRole="trainer">
              <DashboardLayout role="trainer" />
            </ProtectedRoute>
          }
        >
          <Route index element={<TrainerDashboard />} />
          <Route path="clients" element={<MyClients />} />
          <Route path="schedule" element={<TrainerSchedule />} />
          <Route path="workouts" element={<WorkoutBuilder />} />
          <Route path="meals" element={<MealPlanBuilder />} />
          <Route path="ratings" element={<MyRatings />} />
          <Route path="settings" element={<ProfileSettings />} />
        </Route>

        <Route
          path="/receptionist"
          element={
            <ProtectedRoute allowedRole="receptionist">
              <DashboardLayout role="receptionist" />
            </ProtectedRoute>
          }
        >
          <Route index element={<ReceptionistDashboard />} />
          <Route path="staff" element={<StaffManagement />} />
          <Route path="equipment" element={<EquipmentTracking />} />
          <Route path="lockers" element={<LockerManagement />} />
          <Route path="walk-in" element={<WalkInRegistration />} />
          <Route path="members" element={<MembersDirectory />} />
          <Route path="settings" element={<ProfileSettings />} />
        </Route>

        <Route
          path="/member"
          element={
            <ProtectedRoute allowedRole="member">
              <DashboardLayout role="member" />
            </ProtectedRoute>
          }
        >
          <Route index element={<MemberDashboard />} />
          <Route path="workouts" element={<MemberWorkouts />} />
          <Route path="meals" element={<MemberMeals />} />
          <Route path="classes" element={<MemberClasses />} />
          <Route path="trainers" element={<MemberTrainers />} />
          <Route path="subscriptions" element={<MemberSubscriptions />} />
          <Route path="feedback" element={<MemberFeedback />} />
          <Route path="settings" element={<ProfileSettings />} />
          <Route path="profile" element={<ProfileSettings />} />
        </Route>
      </Routes>
    </BrowserRouter>
  )
}
