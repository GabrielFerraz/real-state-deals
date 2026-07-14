import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { catchError, map, switchMap } from 'rxjs/operators';
import { of } from 'rxjs';
import { DealsService } from '../../services/deals.service';
import { loadDeals, loadDealsSuccess } from '../actions/deals.actions';

@Injectable()
export class DealsEffects {
  loadDeals$ = createEffect(() =>
    this.actions$.pipe(
      ofType(loadDeals),
      switchMap(() =>
        this.dealsService.getDeals().pipe(
          map((deals) => loadDealsSuccess({ deals })),
          catchError(() => of(loadDealsSuccess({ deals: [] })))
        )
      )
    )
  );

  constructor(private actions$: Actions, private dealsService: DealsService) {}
}
