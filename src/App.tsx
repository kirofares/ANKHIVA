import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom';
import HomePage from './pages/HomePage';
import PatientPortal from './pages/PatientPortal';
import AdminDashboard from './pages/AdminDashboard';
import Providers from './pages/Providers';
import Packages from './pages/Packages';
import Intake from './pages/Intake';

export default function App(){
  return <BrowserRouter><Routes>
    <Route path="/" element={<HomePage/>}/>
    <Route path="/intake" element={<Intake/>}/>
    <Route path="/patient" element={<PatientPortal/>}/>
    <Route path="/admin" element={<AdminDashboard/>}/>
    <Route path="/admin/cases" element={<AdminDashboard/>}/>
    <Route path="/providers" element={<Providers/>}/>
    <Route path="/packages" element={<Packages/>}/>
    <Route path="*" element={<Navigate to="/" replace/>}/>
  </Routes></BrowserRouter>;
}
