import { createAction, props } from '@ngrx/store';
import { RawDeal } from '../../models/deal.model';

export const loadDeals = createAction('[Deals] Load Deals');
export const loadDealsSuccess = createAction('[Deals] Load Deals Success', props<{ deals: RawDeal[] }>());
export const setNameFilter = createAction('[Deals] Set Name Filter', props<{ name: string }>());
export const setPriceFilter = createAction('[Deals] Set Price Filter', props<{ value: number; operator: 'gt' | 'lt' }>());
export const resetFilters = createAction('[Deals] Reset Filters');
