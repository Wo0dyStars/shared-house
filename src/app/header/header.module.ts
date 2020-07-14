import { NgModule } from '@angular/core';
import { HeaderComponent } from './header.component';
import { CommonModule } from '@angular/common';
import { SharedModule } from '../shared/shared.module';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';

@NgModule({
	declarations: [ HeaderComponent ],
	imports: [ CommonModule, SharedModule, FormsModule, RouterModule ],
	exports: [ HeaderComponent ]
})
export class HeaderModule {}
