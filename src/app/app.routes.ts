import { Routes } from '@angular/router';
import { AuthComponent } from './features/auth/auth.component';
import { DealsComponent } from './features/deals/deals.component';
import { authGuard } from './guards/auth.guard';
import { loggedInGuard } from './guards/logged-in.guard';

export const routes: Routes = [
    { path: '', redirectTo: '/login', pathMatch: 'full' },
    { path: 'login', component: AuthComponent, canActivate: [loggedInGuard] },
    { path: 'deals', component: DealsComponent, canActivate: [authGuard] },
];
