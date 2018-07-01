import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { QuickActionsPage } from './quick-actions';

@NgModule({
  declarations: [
    QuickActionsPage,
  ],
  imports: [
    IonicPageModule.forChild(QuickActionsPage),
  ],
})
export class QuickActionsPageModule {}
