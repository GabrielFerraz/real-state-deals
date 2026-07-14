import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { delay } from 'rxjs/operators';
import { RawDeal } from '../models/deal.model';

const MOCK_DEALS: RawDeal[] = [
  { id: 1, name: 'Northeast Pipeline', purchasePrice: 2500000, address: '123 Main St, Boston, MA', noi: 175000 },
  { id: 2, name: 'Sunset Portfolio', purchasePrice: 4200000, address: '456 Oak Ave, Los Angeles, CA', noi: 336000 },
  { id: 3, name: 'Midwest Acquisition', purchasePrice: 1800000, address: '789 Elm Dr, Chicago, IL', noi: 126000 },
  { id: 4, name: 'Southern Gateway', purchasePrice: 3100000, address: '321 Pine Rd, Atlanta, GA', noi: 248000 },
  { id: 5, name: 'Pacific Heights', purchasePrice: 5600000, address: '654 Cedar Blvd, San Francisco, CA', noi: 392000 },
];

@Injectable({ providedIn: 'root' })
export class DealsService {
  getDeals(): Observable<RawDeal[]> {
    return of(MOCK_DEALS).pipe(delay(500));
  }
}
