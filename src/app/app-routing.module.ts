import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AuthorizationComponent } from './authorization/authorization.component';
import { UsersComponent } from './users/users.component';
import { UserProfileComponent } from './users/user-profile/user-profile.component';

const routes: Routes = [
	{ path: 'authorization', component: AuthorizationComponent },
	{ path: 'confirmation/:id', component: AuthorizationComponent },
	{ path: 'users', component: UsersComponent },
	{ path: 'users/:id', component: UserProfileComponent }
];

@NgModule({
	imports: [ RouterModule.forRoot(routes) ],
	exports: [ RouterModule ]
})
export class AppRoutingModule {}
