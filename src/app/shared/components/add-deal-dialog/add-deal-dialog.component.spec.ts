import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ReactiveFormsModule } from '@angular/forms';
import { MatDialogRef } from '@angular/material/dialog';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { provideMockStore, MockStore } from '@ngrx/store/testing';
import { Store } from '@ngrx/store';
import { AddDealDialogComponent } from './add-deal-dialog.component';
import { addDeal } from '../../../store/actions/deals.actions';

describe('AddDealDialogComponent', () => {
  let component: AddDealDialogComponent;
  let fixture: ComponentFixture<AddDealDialogComponent>;
  let mockDialogRef: jasmine.SpyObj<MatDialogRef<AddDealDialogComponent>>;
  let store: MockStore;

  beforeEach(async () => {
    mockDialogRef = jasmine.createSpyObj('MatDialogRef', ['close']);

    await TestBed.configureTestingModule({
      imports: [AddDealDialogComponent, ReactiveFormsModule, NoopAnimationsModule],
      providers: [
        { provide: MatDialogRef, useValue: mockDialogRef },
        provideMockStore(),
      ],
    }).compileComponents();

    store = TestBed.inject(Store) as MockStore;
    fixture = TestBed.createComponent(AddDealDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  describe('Component Initialization', () => {
    it('should create', () => {
      expect(component).toBeTruthy();
    });

    it('should initialize the form with all controls', () => {
      expect(component.dealForm.get('name')).toBeTruthy();
      expect(component.dealForm.get('purchasePrice')).toBeTruthy();
      expect(component.dealForm.get('address')).toBeTruthy();
      expect(component.dealForm.get('noi')).toBeTruthy();
    });

    it('should initialize capRate to 0', () => {
      expect(component.capRate).toBe(0);
    });

    it('should initialize form as invalid', () => {
      expect(component.dealForm.valid).toBeFalsy();
    });
  });

  describe('Form Validation - Name Field', () => {
    it('should require name field', () => {
      const nameControl = component.dealForm.get('name');
      nameControl?.setValue('');
      expect(nameControl?.hasError('required')).toBeTruthy();
    });

    it('should validate minimum length of 3 characters for name', () => {
      const nameControl = component.dealForm.get('name');
      nameControl?.setValue('ab');
      expect(nameControl?.hasError('minlength')).toBeTruthy();
    });

    it('should accept name with 3 or more characters', () => {
      const nameControl = component.dealForm.get('name');
      nameControl?.setValue('Valid Name');
      expect(nameControl?.valid).toBeTruthy();
    });
  });

  describe('Form Validation - Purchase Price', () => {
    it('should require purchase price', () => {
      const priceControl = component.dealForm.get('purchasePrice');
      priceControl?.setValue('');
      expect(priceControl?.hasError('required')).toBeTruthy();
    });

    it('should validate minimum value of 0 for purchase price', () => {
      const priceControl = component.dealForm.get('purchasePrice');
      priceControl?.setValue(-100);
      expect(priceControl?.hasError('min')).toBeTruthy();
    });

    it('should accept positive purchase price', () => {
      const priceControl = component.dealForm.get('purchasePrice');
      priceControl?.setValue(500000);
      expect(priceControl?.valid).toBeTruthy();
    });
  });

  describe('Form Validation - Address', () => {
    it('should require address field', () => {
      const addressControl = component.dealForm.get('address');
      addressControl?.setValue('');
      expect(addressControl?.hasError('required')).toBeTruthy();
    });

    it('should validate minimum length of 5 characters for address', () => {
      const addressControl = component.dealForm.get('address');
      addressControl?.setValue('Main');
      expect(addressControl?.hasError('minlength')).toBeTruthy();
    });

    it('should accept address with 5 or more characters', () => {
      const addressControl = component.dealForm.get('address');
      addressControl?.setValue('123 Main Street');
      expect(addressControl?.valid).toBeTruthy();
    });
  });

  describe('Form Validation - NOI', () => {
    it('should require noi field', () => {
      const noiControl = component.dealForm.get('noi');
      noiControl?.setValue('');
      expect(noiControl?.hasError('required')).toBeTruthy();
    });

    it('should validate minimum value of 0 for noi', () => {
      const noiControl = component.dealForm.get('noi');
      noiControl?.setValue(-50000);
      expect(noiControl?.hasError('min')).toBeTruthy();
    });

    it('should accept positive noi', () => {
      const noiControl = component.dealForm.get('noi');
      noiControl?.setValue(50000);
      expect(noiControl?.valid).toBeTruthy();
    });
  });

  describe('Cap Rate Calculation', () => {
    it('should initialize capRate to 0', () => {
      expect(component.capRate).toBe(0);
    });

    it('should calculate capRate when noi and purchasePrice are set', () => {
      component.dealForm.patchValue({
        noi: 50000,
        purchasePrice: 500000,
      });
      expect(component.capRate).toBe(10); // 50000 / 500000 * 100 = 10
    });

    it('should recalculate capRate when noi changes', () => {
      component.dealForm.patchValue({
        noi: 50000,
        purchasePrice: 500000,
      });
      expect(component.capRate).toBe(10);

      component.dealForm.patchValue({
        noi: 100000,
      });
      expect(component.capRate).toBe(20); // 100000 / 500000 * 100 = 20
    });

    it('should recalculate capRate when purchasePrice changes', () => {
      component.dealForm.patchValue({
        noi: 50000,
        purchasePrice: 500000,
      });
      expect(component.capRate).toBe(10);

      component.dealForm.patchValue({
        purchasePrice: 1000000,
      });
      expect(component.capRate).toBe(5); // 50000 / 1000000 * 100 = 5
    });

    it('should reset capRate to 0 if purchasePrice is 0', () => {
      component.dealForm.patchValue({
        noi: 50000,
        purchasePrice: 500000,
      });
      expect(component.capRate).toBe(10);

      component.dealForm.patchValue({
        purchasePrice: 0,
      });
      expect(component.capRate).toBe(0);
    });

    it('should handle decimal values in capRate calculation', () => {
      component.dealForm.patchValue({
        noi: 33333,
        purchasePrice: 1000000,
      });
      expect(component.capRate).toBeCloseTo(3.3333, 4);
    });
  });

  describe('Save Functionality', () => {
    it('should not save if form is invalid', () => {
      spyOn(store, 'dispatch');

      component.dealForm.patchValue({
        name: 'Test Deal',
        purchasePrice: 500000,
        address: '123 Main St',
        noi: 50000,
      });
      // Missing valid form, simulate invalid state
      component.dealForm.get('name')?.setValue('');

      component.onSave();

      expect(store.dispatch).not.toHaveBeenCalled();
      expect(mockDialogRef.close).not.toHaveBeenCalled();
    });

    it('should dispatch addDeal action when form is valid', () => {
      spyOn(store, 'dispatch');

      const dealData = {
        name: 'Downtown Office',
        purchasePrice: 500000,
        address: '123 Main Street',
        noi: 50000,
      };

      component.dealForm.patchValue(dealData);

      component.onSave();

      expect(store.dispatch).toHaveBeenCalledWith(
        jasmine.objectContaining({
          type: addDeal.type,
        })
      );
    });

    it('should generate unique ID based on timestamp', () => {
      spyOn(store, 'dispatch');

      const dealData = {
        name: 'Downtown Office',
        purchasePrice: 500000,
        address: '123 Main Street',
        noi: 50000,
      };

      component.dealForm.patchValue(dealData);
      const beforeTime = Date.now();
      component.onSave();
      const afterTime = Date.now();

      const dispatchCall = (store.dispatch as jasmine.Spy).calls.mostRecent();
      const dispatchedAction = dispatchCall?.args[0];
      
      expect(dispatchedAction.deal.id).toBeGreaterThanOrEqual(beforeTime);
      expect(dispatchedAction.deal.id).toBeLessThanOrEqual(afterTime);
    });

    it('should close dialog after successful save', () => {
      spyOn(store, 'dispatch');

      component.dealForm.patchValue({
        name: 'Downtown Office',
        purchasePrice: 500000,
        address: '123 Main Street',
        noi: 50000,
      });

      component.onSave();

      expect(mockDialogRef.close).toHaveBeenCalled();
    });
  });

  describe('Cancel Functionality', () => {
    it('should close dialog without saving when cancel is clicked', () => {
      component.dealForm.patchValue({
        name: 'Downtown Office',
        purchasePrice: 500000,
        address: '123 Main Street',
        noi: 50000,
      });

      component.onCancel();

      expect(mockDialogRef.close).toHaveBeenCalled();
    });

    it('should close dialog even with invalid form', () => {
      component.dealForm.patchValue({
        name: 'ab', // Invalid - too short
      });

      component.onCancel();

      expect(mockDialogRef.close).toHaveBeenCalled();
    });
  });

  describe('Template Rendering', () => {
    it('should render dialog title', () => {
      const title = fixture.nativeElement.querySelector('[mat-dialog-title]');
      expect(title?.textContent).toContain('Add New Deal');
    });

    it('should render all form fields', () => {
      const inputs = fixture.nativeElement.querySelectorAll('input[matInput]');
      expect(inputs.length).toBeGreaterThanOrEqual(5); // name, purchasePrice, address, noi, capRate
    });

    it('should render Cancel button', () => {
      const buttons = fixture.nativeElement.querySelectorAll('button');
      const cancelButton = Array.from(buttons).find((btn: any) =>
        btn.textContent.includes('Cancel')
      );
      expect(cancelButton).toBeTruthy();
    });

    it('should render Save button', () => {
      const buttons = fixture.nativeElement.querySelectorAll('button');
      const saveButton = Array.from(buttons).find((btn: any) =>
        btn.textContent.includes('Save')
      );
      expect(saveButton).toBeTruthy();
    });

    it('should disable Save button when form is invalid', () => {
      const buttons = fixture.nativeElement.querySelectorAll('button');
      const saveButton = Array.from(buttons).find((btn: any) =>
        btn.textContent.includes('Save')
      ) as HTMLButtonElement;

      expect(saveButton?.disabled).toBeTruthy();
    });

    it('should enable Save button when form is valid', () => {
      component.dealForm.patchValue({
        name: 'Downtown Office',
        purchasePrice: 500000,
        address: '123 Main Street',
        noi: 50000,
      });
      fixture.detectChanges();

      const buttons = fixture.nativeElement.querySelectorAll('button');
      const saveButton = Array.from(buttons).find((btn: any) =>
        btn.textContent.includes('Save')
      ) as HTMLButtonElement;

      expect(saveButton?.disabled).toBeFalsy();
    });
  });

  describe('updateCapRate Method', () => {
    it('should update capRate when called manually', () => {
      component.dealForm.patchValue({
        noi: 50000,
        purchasePrice: 500000,
      });

      component.updateCapRate();

      expect(component.capRate).toBe(10);
    });

    it('should set capRate to 0 if noi is missing', () => {
      component.dealForm.patchValue({
        purchasePrice: 500000,
        noi: null,
      });

      component.updateCapRate();

      expect(component.capRate).toBe(0);
    });

    it('should set capRate to 0 if purchasePrice is missing', () => {
      component.dealForm.patchValue({
        noi: 50000,
        purchasePrice: null,
      });

      component.updateCapRate();

      expect(component.capRate).toBe(0);
    });
  });

  describe('Full Workflow', () => {
    it('should complete full add deal workflow', () => {
      spyOn(store, 'dispatch');

      // Fill in form
      component.dealForm.patchValue({
        name: 'Premium Retail Center',
        purchasePrice: 2000000,
        address: '456 Commerce Boulevard',
        noi: 200000,
      });

      fixture.detectChanges();

      // Verify form is valid
      expect(component.dealForm.valid).toBeTruthy();

      // Verify cap rate calculation
      expect(component.capRate).toBe(10); // 200000 / 2000000 * 100

      // Save
      component.onSave();

      // Verify store dispatch
      expect(store.dispatch).toHaveBeenCalledWith(
        jasmine.objectContaining({
          type: addDeal.type,
        })
      );

      // Verify dialog closed
      expect(mockDialogRef.close).toHaveBeenCalled();
    });
  });
});
