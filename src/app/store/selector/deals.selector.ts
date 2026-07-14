import { createFeatureSelector, createSelector } from '@ngrx/store';
import { DealsState } from '../reducers/deals.reducer';

export const selectDealsFeature = createFeatureSelector<DealsState>('deals');

export const selectAllDeals = createSelector(selectDealsFeature, (state) => state.deals);
export const selectNameFilter = createSelector(selectDealsFeature, (state) => state.nameFilter);
export const selectPriceFilter = createSelector(selectDealsFeature, (state) => state.priceFilter);

export const selectFilteredDeals = createSelector(
  selectAllDeals,
  selectNameFilter,
  selectPriceFilter,
  (deals, nameFilter, priceFilter) => {
    let filtered = deals;

    if (nameFilter) {
      filtered = filtered.filter((d) =>
        d.name.toLowerCase().includes(nameFilter.toLowerCase())
      );
    }

    if (priceFilter) {
      filtered = filtered.filter((d) =>
        priceFilter.operator === 'gt'
          ? d.purchasePrice > priceFilter.value
          : d.purchasePrice < priceFilter.value
      );
    }

    return filtered;
  }
);
