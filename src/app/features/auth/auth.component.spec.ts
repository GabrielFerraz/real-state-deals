import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MockStore, provideMockStore } from '@ngrx/store/testing';

import { AuthComponent } from './auth.component';
import { loginSuccess } from '../../store/actions';

describe('AuthComponent', () => {
  let component: AuthComponent;
  let fixture: ComponentFixture<AuthComponent>;
  let store: MockStore;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AuthComponent],
      providers: [provideMockStore()],
    }).compileComponents();

    fixture = TestBed.createComponent(AuthComponent);
    component = fixture.componentInstance;
    store = TestBed.inject(MockStore);
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  // --- Initial state ---
  describe('initial state', () => {
    it('should initialize form with empty email and password', () => {
      expect(component.authForm.get('email')?.value).toBe('');
      expect(component.authForm.get('password')?.value).toBe('');
    });

    it('should have showPasswordStep as false', () => {
      expect(component.showPasswordStep).toBeFalse();
    });

    it('should have submitted as false', () => {
      expect(component.submitted).toBeFalse();
    });
  });

  // --- onNext() ---
  describe('onNext()', () => {
    it('should set showPasswordStep to true', () => {
      component.onNext();
      expect(component.showPasswordStep).toBeTrue();
    });
  });

  // --- onBack() ---
  describe('onBack()', () => {
    it('should set showPasswordStep to false', () => {
      component.showPasswordStep = true;
      component.onBack();
      expect(component.showPasswordStep).toBeFalse();
    });

    it('should reset submitted to false', () => {
      component.submitted = true;
      component.onBack();
      expect(component.submitted).toBeFalse();
    });
  });

  // --- onSignIn() ---
  describe('onSignIn()', () => {
    it('should set submitted to true', () => {
      component.onSignIn();
      expect(component.submitted).toBeTrue();
    });

    it('should not dispatch loginSuccess when form is empty', () => {
      const dispatchSpy = spyOn(store, 'dispatch');
      component.onSignIn();
      expect(dispatchSpy).not.toHaveBeenCalled();
    });

    it('should not dispatch loginSuccess when email has invalid format', () => {
      const dispatchSpy = spyOn(store, 'dispatch');
      component.authForm.setValue({ email: 'notanemail', password: 'secret' });
      component.onSignIn();
      expect(dispatchSpy).not.toHaveBeenCalled();
    });

    it('should not dispatch loginSuccess when password is empty', () => {
      const dispatchSpy = spyOn(store, 'dispatch');
      component.authForm.setValue({ email: 'user@example.com', password: '' });
      component.onSignIn();
      expect(dispatchSpy).not.toHaveBeenCalled();
    });

    it('should dispatch loginSuccess when form is valid', () => {
      const dispatchSpy = spyOn(store, 'dispatch');
      component.authForm.setValue({ email: 'user@example.com', password: 'secret' });
      component.onSignIn();
      expect(dispatchSpy).toHaveBeenCalledWith(loginSuccess());
    });
  });

  // --- Template ---
  describe('template', () => {
    it('should show email input initially', () => {
      const emailInput = fixture.nativeElement.querySelector('#email');
      expect(emailInput).toBeTruthy();
    });

    it('should show Next button initially', () => {
      const nextBtn: HTMLButtonElement = fixture.nativeElement.querySelector('button[type="button"]');
      expect(nextBtn?.textContent?.trim()).toBe('Next');
    });

    it('should not show password input initially', () => {
      const passwordInput = fixture.nativeElement.querySelector('#password');
      expect(passwordInput).toBeNull();
    });

    it('should not show Sign In button initially', () => {
      const signInBtn = fixture.nativeElement.querySelector('button[type="submit"]');
      expect(signInBtn).toBeNull();
    });

    it('should show password input after onNext()', () => {
      component.onNext();
      fixture.detectChanges();
      const passwordInput = fixture.nativeElement.querySelector('#password');
      expect(passwordInput).toBeTruthy();
    });

    it('should show Sign In button after onNext()', () => {
      component.onNext();
      fixture.detectChanges();
      const signInBtn = fixture.nativeElement.querySelector('button[type="submit"]');
      expect(signInBtn).toBeTruthy();
    });

    it('should show Back button after onNext()', () => {
      component.onNext();
      fixture.detectChanges();
      const buttons: NodeListOf<HTMLButtonElement> = fixture.nativeElement.querySelectorAll('button[type="button"]');
      const backBtn = Array.from(buttons).find(b => b.textContent?.trim() === 'Back');
      expect(backBtn).toBeTruthy();
    });

    it('should hide Next button after onNext()', () => {
      component.onNext();
      fixture.detectChanges();
      const buttons: NodeListOf<HTMLButtonElement> = fixture.nativeElement.querySelectorAll('button[type="button"]');
      const nextBtn = Array.from(buttons).find(b => b.textContent?.trim() === 'Next');
      expect(nextBtn).toBeUndefined();
    });

    it('should not show error message initially', () => {
      const errorEl = fixture.nativeElement.querySelector('p.text-red-500');
      expect(errorEl).toBeNull();
    });

    it('should show "Invalid credentials" when submitted with invalid form', () => {
      component.onSignIn();
      fixture.detectChanges();
      const errorEl = fixture.nativeElement.querySelector('p.text-red-500');
      expect(errorEl?.textContent?.trim()).toBe('Invalid credentials');
    });

    it('should not show error message when form is valid after submit', () => {
      component.authForm.setValue({ email: 'user@example.com', password: 'secret' });
      component.onSignIn();
      fixture.detectChanges();
      const errorEl = fixture.nativeElement.querySelector('p.text-red-500');
      expect(errorEl).toBeNull();
    });

    it('should apply red border to email input when submitted with invalid email', () => {
      component.onSignIn();
      fixture.detectChanges();
      const emailInput: HTMLInputElement = fixture.nativeElement.querySelector('#email');
      expect(emailInput.classList.contains('border-red-500')).toBeTrue();
    });

    it('should apply red border to password input when submitted with empty password', () => {
      component.authForm.setValue({ email: 'user@example.com', password: '' });
      component.onNext();
      component.onSignIn();
      fixture.detectChanges();
      const passwordInput: HTMLInputElement = fixture.nativeElement.querySelector('#password');
      expect(passwordInput.classList.contains('border-red-500')).toBeTrue();
    });

    it('should hide password step and clear submitted after onBack()', () => {
      component.onNext();
      component.onSignIn();
      fixture.detectChanges();
      component.onBack();
      fixture.detectChanges();
      expect(fixture.nativeElement.querySelector('#password')).toBeNull();
      expect(component.submitted).toBeFalse();
    });
  });
});
