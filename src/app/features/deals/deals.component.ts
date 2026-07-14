import { Component, DestroyRef, inject, OnInit } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { FormBuilder, FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs';
import { AsyncPipe, DecimalPipe } from '@angular/common';
import { MatTableModule } from '@angular/material/table';
import { MatMenuModule } from '@angular/material/menu';
import { MatButtonModule } from '@angular/material/button';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatIconModule } from '@angular/material/icon';
import { MatFormFieldModule } from '@angular/material/form-field';
import { Deal } from '../../models/deal.model';
import { logout } from '../../store/actions/auth.actions';
import { loadDeals, resetFilters, setNameFilter, setPriceFilter } from '../../store/actions/deals.actions';
import { selectFilteredDeals } from '../../store/selector/deals.selector';

@Component({
  selector: 'app-deals',
  standalone: true,
  imports: [
    AsyncPipe,
    DecimalPipe,
    ReactiveFormsModule,
    MatTableModule,
    MatMenuModule,
    MatButtonModule,
    MatInputModule,
    MatFormFieldModule,
    MatSelectModule,
    MatIconModule,
  ],
  templateUrl: './deals.component.html',
  styleUrl: './deals.component.scss',
})
export class DealsComponent implements OnInit {
  private store = inject(Store);
  private router = inject(Router);
  private fb = inject(FormBuilder);
  private destroyRef = inject(DestroyRef);

  deals$: Observable<Deal[]> = this.store.select(selectFilteredDeals);
  displayedColumns = ['name', 'purchasePrice', 'address', 'noi', 'capRate'];

  nameFilter = new FormControl<string>('', { nonNullable: true });

  priceForm: FormGroup = this.fb.group({
    value: [null, [Validators.required, Validators.min(0)]],
    operator: ['gt'],
  });

  ngOnInit(): void {
    this.store.dispatch(loadDeals());

    this.nameFilter.valueChanges
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe((name) => this.store.dispatch(setNameFilter({ name })));
  }

  onSetPriceFilter(): void {
    if (this.priceForm.valid) {
      const { value, operator } = this.priceForm.value;
      this.store.dispatch(setPriceFilter({ value: +value, operator }));
    }
  }

  onResetFilters(): void {
    this.store.dispatch(resetFilters());
    this.nameFilter.reset('');
    this.priceForm.reset({ value: null, operator: 'gt' });
  }

  onLogout(): void {
    this.store.dispatch(logout());
    this.router.navigate(['/login']);
  }

}

