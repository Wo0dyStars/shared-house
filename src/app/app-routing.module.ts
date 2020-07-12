import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AuthorizationComponent } from './authorization/authorization.component';
import { UsersComponent } from './users/users.component';
import { UserProfileComponent } from './users/user-profile/user-profile.component';
import { ShoppingListComponent } from './users/shopping-list/shopping-list.component';
import { TaskComponent } from './users/task/task.component';
import { AvailableTaskComponent } from './users/task/available-task/available-task.component';
import { NewsComponent } from './users/news/news.component';
import { LeaderboardComponent } from './users/leaderboard/leaderboard.component';

const routes: Routes = [
	{ path: 'authorization', component: AuthorizationComponent },
	{ path: 'confirmation/:id', component: AuthorizationComponent },
	{ path: 'users', component: UsersComponent },
	{ path: 'users/shopping-list', component: ShoppingListComponent },
	{ path: 'users/task', component: TaskComponent },
	{ path: 'users/news', component: NewsComponent },
	{ path: 'users/availabletask', component: AvailableTaskComponent },
	{ path: 'users/leaderboard', component: LeaderboardComponent },
	{ path: 'users/:id', component: UserProfileComponent }
];

@NgModule({
	imports: [ RouterModule.forRoot(routes) ],
	exports: [ RouterModule ]
})
export class AppRoutingModule {}
