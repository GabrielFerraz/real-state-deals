import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Router } from '@angular/router';
import { MockStore, provideMockStore } from '@ngrx/store/testing';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';

import { DealsComponent } from './deals.component';
import { Deal } from '../../models/deal.model';
import { selectFilteredDeals } from '../../store/selector/deals.selector';
import { loadDeals, resetFilters, setNameFilter, setPriceFilter } from '../../store/actions/deals.actions';
import { logout } from '../../store/actions/auth.actions';

const MOCK_DEALS: Deal[] = [
  { id: 1, name: 'Northeast Pipeline', purchasePrice: 2500000, address: '123 Main St, Boston, MA', noi: 175000, capRate: 7 },
  { id: 2, name: 'Sunset Portfolio', purchasePrice: 4200000, address: '456 Oak Ave, Los Angeles, CA', noi: 336000, capRate: 8 },
];

describe('DealsComponent', () => {
  let component: DealsComponent;
  let fixture: ComponentFixture<DealsComponent>;
  let store: MockStore;
  let routerSpy: jasmine.SpyObj<Router>;

  beforeEach(async () => {
    routerSpy = jasmine.createSpyObj('Router', ['navigate']);

    await TestBed.configureTestingModule({
      imports: [DealsComponent, NoopAnimationsModule],
      providers: [
        provideMockStore({
          initialState: {
            deals: { deals: MOCK_DEALS, nameFilter: '', priceFilter: null },
            auth: { isLoggedIn: true },
          },
        }),
        { provide: Router, useValue: routerSpy },
      ],
    }).compileComponents();

    store = TestBed.inject(MockStore);
    store.overrideSelector(selectFilteredDeals, MOCK_DEALS);
    store.refreshState();

    fixture = TestBed.createComponent(DealsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  // --- Initial state ---
  describe('initial state', () => {
    it('should dispatch loadDeals on init', () => {
      const dispatchSpy = spyOn(store, 'dispatch');
      component.ngOnInit();
      expect(dispatchSpy).toHaveBeenCalledWith(loadDeals());
    });

    it('should display the correct columns', () => {
      expect(component.displayedColumns).toEqual(['name', 'purchasePrice', 'address', 'noi', 'capRate']);
    });

    it('should initialize nameFilter as empty string', () => {
      expect(component.nameFilter.value).toBe('');
    });

    it('should initialize priceForm operator as gt', () => {
      expect(component.priceForm.get('operator')?.value).toBe('gt');
    });
  });

  // --- onLogout() ---
  describe('onLogout()', () => {
    it('should dispatch logout', () => {
      const dispatchSpy = spyOn(store, 'dispatch');
      component.onLogout();
      expect(dispatchSpy).toHaveBeenCalledWith(logout());
    });

    it('should navigate to /login', () => {
      component.onLogout();
      expect(routerSpy.navigate).toHaveBeenCalledWith(['/login']);
    });
  });

  // --- setNameFilter ---
  describe('nameFilter valueChanges', () => {
    it('should dispatch setNameFilter when value changes', () => {
      const dispatchSpy = spyOn(store, 'dispatch');
      component.nameFilter.setValue('Northeast');
      expect(dispatchSpy).toHaveBeenCalledWith(setNameFilter({ name: 'Northeast' }));
    });
  });

  // --- onSetPriceFilter() ---
  describe('onSetPriceFilter()', () => {
    it('should dispatch setPriceFilter when form is valid', () => {
      const dispatchSpy = spyOn(store, 'dispatch');
      component.priceForm.setValue({ value: 3000000.50, operator: 'gt' });
      component.onSetPriceFilter();
      expect(dispatchSpy).toHaveBeenCalledWith(setPriceFilter({ value: 3000000.50, operator: 'gt' }));
    });

    it('should not dispatch setPriceFilter when value is null', () => {
      const dispatchSpy = spyOn(store, 'dispatch');
      component.priceForm.setValue({ value: null, operator: 'gt' });
      component.onSetPriceFilter();
      expect(dispatchSpy).not.toHaveBeenCalled();
    });

    it('should not dispatch setPriceFilter when value is negative', () => {
      const dispatchSpy = spyOn(store, 'dispatch');
      component.priceForm.setValue({ value: -100, operator: 'gt' });
      component.onSetPriceFilter();
      expect(dispatchSpy).not.toHaveBeenCalled();
    });

    it('should dispatch with float value', () => {
      const dispatchSpy = spyOn(store, 'dispatch');
      component.priceForm.setValue({ value: 1500000.75, operator: 'lt' });
      component.onSetPriceFilter();
      expect(dispatchSpy).toHaveBeenCalledWith(setPriceFilter({ value: 1500000.75, operator: 'lt' }));
    });
  });

  // --- onResetFilters() ---
  describe('onResetFilters()', () => {
    it('should dispatch resetFilters', () => {
      const dispatchSpy = spyOn(store, 'dispatch');
      component.onResetFilters();
      expect(dispatchSpy).toHaveBeenCalledWith(resetFilters());
    });

    it('should reset nameFilter to empty string', () => {
      component.nameFilter.setValue('test');
      component.onResetFilters();
      expect(component.nameFilter.value).toBe('');
    });

    it('should reset priceForm', () => {
      component.priceForm.setValue({ value: 1000000, operator: 'lt' });
      component.onResetFilters();
      expect(component.priceForm.get('value')?.value).toBeNull();
      expect(component.priceForm.get('operator')?.value).toBe('gt');
    });
  });

  // --- cap rate in table ---
  describe('cap rate display', () => {
    it('should render cap rate value from store in the table', () => {
      const cells: NodeListOf<HTMLElement> = fixture.nativeElement.querySelectorAll('mat-cell');
      const text = Array.from(cells).map((c) => c.textContent?.trim() ?? '');
      expect(text.some((t) => t.includes('7.00'))).toBeTrue();
    });
  });

  // --- Template ---
  describe('template', () => {
    it('should render the TermSheet header', () => {
      const header: HTMLElement = fixture.nativeElement.querySelector('header');
      expect(header?.textContent).toContain('TermSheet');
    });

    it('should render the Deals title', () => {
      const h1: HTMLElement = fixture.nativeElement.querySelector('h1');
      expect(h1?.textContent?.trim()).toBe('Deals');
    });

    it('should render a table row for each deal', () => {
      const rows = fixture.nativeElement.querySelectorAll('mat-row');
      expect(rows.length).toBe(MOCK_DEALS.length);
    });

    it('should render deal names in the table', () => {
      const cells = fixture.nativeElement.querySelectorAll('mat-cell');
      const text = Array.from(cells).map((c: any) => c.textContent?.trim());
      expect(text).toContain('Northeast Pipeline');
    });
  });
});
