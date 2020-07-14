import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { FormsModule } from '@angular/forms';
import { AppComponent } from './app.component';
import { HeaderComponent } from './header/header.component';
import { AppRoutingModule } from './app-routing.module';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { AuthorizationInterceptor } from './authorization/authorization.interceptor';
import { TasksModule } from './users/task/tasks.module';
import { SharedModule } from './shared/shared.module';
import { ShoppingListModule } from './users/shopping-list/shopping-list.module';
import { AuthorizationModule } from './authorization/authorization.module';
import { NewsModule } from './users/news/news.module';
import { LeaderboardModule } from './users/leaderboard/leaderboard.module';
import { UsersModule } from './users/users.module';

@NgModule({
	declarations: [ AppComponent, HeaderComponent ],
	imports: [
		BrowserModule,
		FormsModule,
		AppRoutingModule,
		HttpClientModule,
		TasksModule,
		SharedModule,
		ShoppingListModule,
		AuthorizationModule,
		NewsModule,
		LeaderboardModule,
		UsersModule
	],
	providers: [
		{
			provide: HTTP_INTERCEPTORS,
			useClass: AuthorizationInterceptor,
			multi: true
		}
	],
	bootstrap: [ AppComponent ]
})
export class AppModule {}
