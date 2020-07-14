import { NgModule } from '@angular/core';
import { NewsComponent } from './news.component';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { SharedModule } from 'src/app/shared/shared.module';

@NgModule({
	declarations: [ NewsComponent ],
	imports: [ CommonModule, FormsModule, SharedModule ]
})
export class NewsModule {}
