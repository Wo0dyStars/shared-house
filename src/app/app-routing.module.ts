import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AuthorizationComponent } from './authorization/authorization.component';

const routes: Routes = [
	{
		path: 'authorization',
		loadChildren: () => import('./authorization/authorization.module').then((m) => m.AuthorizationModule)
	},
	{ path: 'confirmation/:id', component: AuthorizationComponent },
	{ path: 'users', loadChildren: () => import('./users/users.module').then((m) => m.UsersModule) }
];

@NgModule({
	imports: [ RouterModule.forRoot(routes) ],
	exports: [ RouterModule ]
})
export class AppRoutingModule {}
