import { NgModule } from '@angular/core';
import { ShoppingListComponent } from './shopping-list.component';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { SharedModule } from 'src/app/shared/shared.module';

@NgModule({
	declarations: [ ShoppingListComponent ],
	imports: [ CommonModule, FormsModule, SharedModule ]
})
export class ShoppingListModule {}
