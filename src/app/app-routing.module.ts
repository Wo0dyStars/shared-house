import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { RegisterComponent } from './Authorization/register/register.component';
import { HeaderComponent } from './header/header.component';

const routes: Routes = [ { path: 'register', component: RegisterComponent } ];

@NgModule({
	imports: [ RouterModule.forRoot(routes) ],
	exports: [ RouterModule ]
})
export class AppRoutingModule {}
