import { BrowserRouter, Route, Routes } from 'react-router'
import { ProtectedRoute } from './ProtectedRoute'
import App from '../App'
import { PublicRoute } from './PublicRoute'
import { SignIn } from '../components/auth/SignIn'
import { SignUp } from '../components/auth/SignUp'
import { VerificacionPendiente } from '../components/auth/VerificacionPendiente'
import { Verificado } from '../components/auth/Verificado'
import { UnirHogar } from '../components/hogar/UnirHogar'
import { Home } from '../pages/Home'
import { Statistics } from '../pages/Statistics'
import { Settings } from '../pages/Settings'
import { AddExpense } from '../pages/AddExpense'

export const AppRouter = () => {
    return (
        <BrowserRouter>
            <Routes>
                <Route element={<ProtectedRoute />}>
                    <Route path="/" element={<App />}>
                        <Route path="home" element={<Home />} />
                        <Route path="statistics" element={<Statistics />} />
                        <Route path="settings" element={<Settings />} />
                        <Route path="add-expense" element={<AddExpense />} />
                    </Route>
                    <Route path="/unir-hogar" element={<UnirHogar />} />
                </Route>
                <Route element={<PublicRoute />}>
                    <Route path="/signin" element={<SignIn />} />
                    <Route path="/signup" element={<SignUp />} />
                    <Route path="/verificacion-pendiente" element={<VerificacionPendiente />} />
                    <Route path="/verificado" element={<Verificado />} />
                </Route>
            </Routes>
        </BrowserRouter>
    )
}