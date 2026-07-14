import { createReducer, on } from '@ngrx/store';
import { Deal } from '../../models/deal.model';
import { loadDealsSuccess, addDeal, setNameFilter, setPriceFilter, resetFilters } from '../actions/deals.actions';


export interface DealsState {
  deals: Deal[];
  nameFilter: string;
  priceFilter: { value: number; operator: 'gt' | 'lt' } | null;
}

export const initialDealsState: DealsState = {
  deals: [],
  nameFilter: '',
  priceFilter: null,
};

export const dealsReducer = createReducer(
  initialDealsState,
  on(loadDealsSuccess, (state, { deals }) => ({
    ...state,
    deals: deals.map((d) => ({ ...d, capRate: (d.noi / d.purchasePrice) * 100 })),
  })),
  on(addDeal, (state, { deal }) => ({
    ...state,
    deals: [...state.deals, { ...deal, capRate: (deal.noi / deal.purchasePrice) * 100 }],
  })),
  on(setNameFilter, (state, { name }) => ({ ...state, nameFilter: name })),
  on(setPriceFilter, (state, { value, operator }) => ({ ...state, priceFilter: { value, operator } })),
  on(resetFilters, (state) => ({ ...state, nameFilter: '', priceFilter: null }))
);
