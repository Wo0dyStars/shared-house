import { NgModule } from '@angular/core';
import { LeaderboardComponent } from './leaderboard.component';
import { SharedModule } from 'src/app/shared/shared.module';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@NgModule({
	declarations: [ LeaderboardComponent ],
	imports: [ CommonModule, FormsModule, SharedModule ]
})
export class LeaderboardModule {}
