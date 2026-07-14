import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { StoreModule } from '@ngrx/store';
import { EffectsModule } from '@ngrx/effects';
import { authReducer } from './reducers/auth.reducer';
import { dealsReducer } from './reducers/deals.reducer';
import { DealsEffects } from './effects/deals.effects';

@NgModule({
  declarations: [],
  imports: [
    CommonModule,
    StoreModule.forRoot({ auth: authReducer, deals: dealsReducer }),
    EffectsModule.forRoot([DealsEffects]),
  ],
})
export class AppStoreModule { }
