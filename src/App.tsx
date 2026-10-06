import type { ReactNode } from 'react';
import { HashRouter, Navigate, Route, Routes } from 'react-router-dom';
import { AuthProvider, RequireAuth, RequireRoles } from './auth';
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
import AdminCaseDetail from './pages/AdminCaseDetail';

const patient=(element:ReactNode)=><RequireAuth>{element}</RequireAuth>;
const staff=(element:ReactNode)=><RequireRoles roles={['coordinator','clinician','admin']}>{element}</RequireRoles>;

export default function App(){
  return <AuthProvider><HashRouter><Routes>
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
    <Route path="/patient" element={patient(<PatientPortal/>)}/>
    <Route path="/patient/case" element={patient(<PatientCase/>)}/>
    <Route path="/patient/quote" element={patient(<PatientQuote/>)}/>
    <Route path="/admin" element={staff(<AdminDashboard/>)}/>
    <Route path="/admin/cases" element={staff(<AdminSection/>)}/>
    <Route path="/admin/cases/:id" element={staff(<AdminCaseDetail/>)}/>
    <Route path="/admin/patients" element={staff(<AdminSection/>)}/>
    <Route path="/admin/providers" element={staff(<AdminSection/>)}/>
    <Route path="/admin/packages" element={staff(<AdminSection/>)}/>
    <Route path="/admin/quotes" element={staff(<AdminSection/>)}/>
    <Route path="/admin/messages" element={staff(<AdminSection/>)}/>
    <Route path="/admin/settings" element={staff(<AdminSection/>)}/>
    <Route path="*" element={<Navigate to="/" replace/>}/>
  </Routes></HashRouter></AuthProvider>;
}
