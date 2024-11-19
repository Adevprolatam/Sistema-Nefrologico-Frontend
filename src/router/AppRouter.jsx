// IMPORTS
import { Routes, Route, Navigate } from "react-router-dom";

import { HomeComponent } from "../Nefrologico/pages/Home.Component";
import { VisitaComponent } from "../Nefrologico/components/visita/Visita";
import { NavbarComponent, SidebarComponent } from '../shared';
import { PacienteComponent } from "../Nefrologico/components/paciente/Paciente";
import { RegistroPacienteComponent } from "../Nefrologico/components/paciente/RegistroPaciente";
import { RegistroVisitaComponent } from "../Nefrologico/components/visita/RegistroVisitaComponent";
import {PacienteDetalleComponent}from "../Nefrologico/components/paciente/PacienteComponent"; // Asegúrate de que esta ruta es correcta
import EstadisticaComponent from "../Nefrologico/components/estadisticas/Estadistica";

export const AppRouter = () => {
    return (
        <>
            <NavbarComponent />
            <SidebarComponent />
            <Routes>
                <Route path="/" element={<Navigate to='/dashboard' />} />
                <Route path="dashboard" element={<HomeComponent />} />
                <Route path="dashboard/visita" element={<VisitaComponent />} />
                <Route path="dashboard/visita/nuevo" element={<RegistroVisitaComponent />} />
                <Route path="dashboard/paciente" element={<PacienteComponent />} />
                <Route path="paciente/:id" element={<PacienteDetalleComponent />} />
                <Route path="dashboard/paciente/nuevo" element={<RegistroPacienteComponent />} />
                <Route path="dashboard/estadistica" element={<EstadisticaComponent />} />
            </Routes>
        </>
    );
};
