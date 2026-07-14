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
  { id: 6, name: 'Downtown Seattle Hub', purchasePrice: 3800000, address: '999 Commerce St, Seattle, WA', noi: 304000 },
  { id: 7, name: 'Miami Waterfront', purchasePrice: 4900000, address: '1200 Bay Dr, Miami, FL', noi: 367500 },
  { id: 8, name: 'Denver Tech Center', purchasePrice: 2200000, address: '2500 Tech Blvd, Denver, CO', noi: 176000 },
  { id: 9, name: 'Austin Tech Plaza', purchasePrice: 1900000, address: '3100 Innovation Dr, Austin, TX', noi: 152000 },
  { id: 10, name: 'Brooklyn Heights', purchasePrice: 6200000, address: '450 Atlantic Ave, Brooklyn, NY', noi: 434000 },
  { id: 11, name: 'Portland Central', purchasePrice: 2100000, address: '501 Market St, Portland, OR', noi: 168000 },
  { id: 12, name: 'Nashville Metro', purchasePrice: 1700000, address: '600 Broadway, Nashville, TN', noi: 119000 },
  { id: 13, name: 'Phoenix Corporate', purchasePrice: 2700000, address: '2800 Fashion Center, Phoenix, AZ', noi: 189000 },
  { id: 14, name: 'San Diego Bay', purchasePrice: 3400000, address: '1500 Harbor Dr, San Diego, CA', noi: 272000 },
  { id: 15, name: 'Dallas Premium', purchasePrice: 2300000, address: '1900 McKinney Ave, Dallas, TX', noi: 184000 },
  { id: 16, name: 'Houston Energy', purchasePrice: 2900000, address: '3500 Post Oak Blvd, Houston, TX', noi: 203000 },
  { id: 17, name: 'Philadelphia Historic', purchasePrice: 2400000, address: '1600 Market St, Philadelphia, PA', noi: 168000 },
  { id: 18, name: 'Baltimore Harbor', purchasePrice: 1900000, address: '1300 Harbor St, Baltimore, MD', noi: 133000 },
  { id: 19, name: 'Charlotte Uptown', purchasePrice: 2000000, address: '200 South Tryon St, Charlotte, NC', noi: 160000 },
  { id: 20, name: 'New Orleans Arts', purchasePrice: 1600000, address: '525 Arts St, New Orleans, LA', noi: 112000 },
  { id: 21, name: 'Vegas Strip Adjacent', purchasePrice: 3500000, address: '3600 Strip Blvd, Las Vegas, NV', noi: 280000 },
  { id: 22, name: 'Memphis Corridor', purchasePrice: 1400000, address: '165 Main St, Memphis, TN', noi: 98000 },
  { id: 23, name: 'Louisville Riverfront', purchasePrice: 1800000, address: '401 South 4th St, Louisville, KY', noi: 126000 },
  { id: 24, name: 'Detroit Renaissance', purchasePrice: 1500000, address: '100 Renaissance Ctr, Detroit, MI', noi: 105000 },
  { id: 25, name: 'Boston Innovation', purchasePrice: 3200000, address: '222 Berkeley St, Boston, MA', noi: 256000 },
  { id: 26, name: 'Minneapolis Tech', purchasePrice: 2100000, address: '701 Fifth Ave, Minneapolis, MN', noi: 168000 },
  { id: 27, name: 'Milwaukee Landmark', purchasePrice: 1700000, address: '628 N Water St, Milwaukee, WI', noi: 119000 },
  { id: 28, name: 'Las Vegas Downtown', purchasePrice: 2800000, address: '123 Fremont St, Las Vegas, NV', noi: 196000 },
  { id: 29, name: 'Portland Pearl', purchasePrice: 2300000, address: '1010 NW Couch St, Portland, OR', noi: 184000 },
  { id: 30, name: 'Tucson Desert', purchasePrice: 1300000, address: '111 E Broadway Blvd, Tucson, AZ', noi: 91000 },
  { id: 31, name: 'Sacramento Capitol', purchasePrice: 1900000, address: '1 Capitol Mall, Sacramento, CA', noi: 133000 },
  { id: 32, name: 'Long Beach Port', purchasePrice: 2600000, address: '100 Promenade North, Long Beach, CA', noi: 182000 },
  { id: 33, name: 'Kansas City Central', purchasePrice: 1800000, address: '901 Main St, Kansas City, MO', noi: 126000 },
  { id: 34, name: 'Mesa Sunrise', purchasePrice: 1200000, address: '1 S Mesa Dr, Mesa, AZ', noi: 84000 },
  { id: 35, name: 'Virginia Beach Naval', purchasePrice: 1700000, address: '2501 Atlantic Ave, Virginia Beach, VA', noi: 119000 },
];

@Injectable({ providedIn: 'root' })
export class DealsService {
  getDeals(): Observable<RawDeal[]> {
    return of(MOCK_DEALS).pipe(delay(500));
  }
}
