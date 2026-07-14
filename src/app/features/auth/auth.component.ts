import { Component } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { Store } from '@ngrx/store';
import { loginSuccess } from '../../store/actions';

@Component({
  selector: 'app-auth',
  standalone: true,
  imports: [ReactiveFormsModule],
  templateUrl: './auth.component.html',
  styleUrl: './auth.component.scss',
})
export class AuthComponent {
  authForm: FormGroup;
  showPasswordStep = false;
  submitted = false;

  constructor(private fb: FormBuilder, private store: Store, private router: Router) {
    this.authForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', Validators.required],
    });
  }

  onNext(): void {
    this.showPasswordStep = true;
  }

  onBack(): void {
    this.showPasswordStep = false;
    this.submitted = false;
  }

  onSignIn(): void {
    this.submitted = true;
    if (this.authForm.valid) {
      this.store.dispatch(loginSuccess());
      this.router.navigate(['/deals']);
    }
  }
}
