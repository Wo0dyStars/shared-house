import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { FormsModule } from '@angular/forms';
import { AppComponent } from './app.component';
import { HeaderComponent } from './header/header.component';
import { AppRoutingModule } from './app-routing.module';
import { AuthorizationComponent } from './authorization/authorization.component';

@NgModule({
	declarations: [ AppComponent, HeaderComponent, AuthorizationComponent ],
	imports: [ BrowserModule, FormsModule, AppRoutingModule ],
	providers: [],
	bootstrap: [ AppComponent ]
})
export class AppModule {}
