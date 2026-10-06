import { HashRouter, Navigate, Route, Routes } from 'react-router-dom';
import HomePage from './pages/HomePage';
import PatientPortal from './pages/PatientPortal';
import AdminDashboard from './pages/AdminDashboard';
import Providers from './pages/Providers';
import Packages from './pages/Packages';
import Intake from './pages/Intake';
import Treatments from './pages/Treatments';
import TreatmentDetail from './pages/TreatmentDetail';
import ProviderDetail from './pages/ProviderDetail';
import PackageDetail from './pages/PackageDetail';
import InfoPage from './pages/InfoPage';
import Contact from './pages/Contact';
import Auth from './pages/Auth';
import PatientCase from './pages/PatientCase';
import PatientQuote from './pages/PatientQuote';
import AdminSection from './pages/AdminSection';

export default function App(){
  return <HashRouter><Routes>
    <Route path="/" element={<HomePage/>}/>
    <Route path="/treatments" element={<Treatments/>}/>
    <Route path="/treatments/:slug" element={<TreatmentDetail/>}/>
    <Route path="/providers" element={<Providers/>}/>
    <Route path="/providers/:id" element={<ProviderDetail/>}/>
    <Route path="/packages" element={<Packages/>}/>
    <Route path="/packages/:id" element={<PackageDetail/>}/>
    <Route path="/about" element={<InfoPage/>}/>
    <Route path="/why-egypt" element={<InfoPage/>}/>
    <Route path="/faq" element={<InfoPage/>}/>
    <Route path="/privacy" element={<InfoPage/>}/>
    <Route path="/terms" element={<InfoPage/>}/>
    <Route path="/medical-disclaimer" element={<InfoPage/>}/>
    <Route path="/contact" element={<Contact/>}/>
    <Route path="/login" element={<Auth/>}/>
    <Route path="/intake" element={<Intake/>}/>
    <Route path="/patient" element={<PatientPortal/>}/>
    <Route path="/patient/case" element={<PatientCase/>}/>
    <Route path="/patient/quote" element={<PatientQuote/>}/>
    <Route path="/admin" element={<AdminDashboard/>}/>
    <Route path="/admin/cases" element={<AdminSection/>}/>
    <Route path="/admin/patients" element={<AdminSection/>}/>
    <Route path="/admin/providers" element={<AdminSection/>}/>
    <Route path="/admin/packages" element={<AdminSection/>}/>
    <Route path="/admin/quotes" element={<AdminSection/>}/>
    <Route path="/admin/messages" element={<AdminSection/>}/>
    <Route path="/admin/settings" element={<AdminSection/>}/>
    <Route path="*" element={<Navigate to="/" replace/>}/>
  </Routes></HashRouter>;
}
