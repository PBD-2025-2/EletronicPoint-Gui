import { Routes } from '@angular/router';
import { Login } from './pages/login/login';
import { Signup } from './pages/signup/signup';
import { RoleComponent } from './pages/role/role';
import { EmployeeComponent } from './pages/employee/employee';
import { DefaultMenuLayout } from './components/default-menu-layout/default-menu-layout';
import { CompanyComponent } from './pages/company/company';
import { RegisterRoster } from './components/register-roster/register-roster';
import { EletronicPoints } from './pages/eletronic-points/eletronic-points';

export const routes: Routes = [

    {
        path: "login",
        component: Login
    },
    {
        path: "menu",
        component: DefaultMenuLayout,
        children: [
        { path: 'company', component: CompanyComponent },
        { path: 'roles', component: RoleComponent },
        { path: 'employee', component: EmployeeComponent },
        { path: 'roster', component: RegisterRoster },
        { path: 'eletronicPoint', component: EletronicPoints },
        { path: '', redirectTo: 'company', pathMatch: 'full' },
        ]
    },
    {
        path: "signup",
        component: Signup
    }
];
