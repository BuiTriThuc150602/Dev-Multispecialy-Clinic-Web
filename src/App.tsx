import { Route, Routes } from "react-router-dom";
import { Header } from "./layouts/Header";
import {
  Appointment,
  Authentication,
  Home,
  PatientRecord,
  PatientInfo,
  AppointmentList,
} from "./pages";
import { PrivateRoute } from "./routes/PrivateRoute";

export default function App() {
  return (
    <>
      <Header />
      <main className="mt-24">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="auth" element={<Authentication />} />
          <Route element={<PrivateRoute />}>
            <Route path="booking" element={<Appointment />} />
            <Route path="patient-record" element={<PatientRecord />} />
            <Route path="patient-info" element={<PatientInfo />} />
            <Route path="appointments" element={<AppointmentList />} />
          </Route>
        </Routes>
      </main>
    </>
  );
}
