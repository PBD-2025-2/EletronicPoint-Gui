import { Routes } from '@angular/router';
import { Login } from './pages/login/login';
import { Signup } from './pages/signup/signup';
import { Roles } from './pages/roles/roles';
import { Employee } from './pages/employee/employee';

import { DefaultMenuLayout } from './components/default-menu-layout/default-menu-layout';
import { CompanyComponent } from './pages/company/company';



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
        { path: 'roles', component: Roles },
        { path: 'employee', component: Employee },
        { path: '', redirectTo: 'company', pathMatch: 'full' }
        ]
    },
    {
        path: "signup",
        component: Signup
    }
];
