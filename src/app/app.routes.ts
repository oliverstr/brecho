import { Routes } from '@angular/router';
import { HomeComponent } from './home/home.component';
import { AuthGuard } from './guards/auth.guard';
import { ProductsComponent } from './crud/products/products.component';
import { BrechoComponent } from './crud/brecho/brecho.component';
import { UsersComponent } from './crud/users/users.component';
import { AllSalesComponent } from './pdv/all-sales/all-sales.component';
import { PdvComponent } from './pdv/pdv.component';

export const ROUTES: Routes = [
    { path: 'home', component: HomeComponent, canActivate: [ AuthGuard ] },
    { path: 'users', component: UsersComponent, canActivate: [ AuthGuard ] },
    { path: 'products', component: ProductsComponent, canActivate: [ AuthGuard ] },
    { path: 'brechos', component: BrechoComponent, canActivate: [ AuthGuard ] },
    { path: 'pdv/new', component: PdvComponent, canActivate: [ AuthGuard ] },
    { path: 'pdv/new/:key', component: PdvComponent, canActivate: [ AuthGuard ] },
    { path: 'pdv', component: AllSalesComponent, canActivate: [ AuthGuard ] },
    { path: '**', redirectTo: 'home' }
];
