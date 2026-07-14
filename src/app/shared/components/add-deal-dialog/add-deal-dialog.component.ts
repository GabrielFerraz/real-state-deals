import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { Store } from '@ngrx/store';
import { addDeal } from '../../../store/actions/deals.actions';
import { RawDeal } from '../../../models/deal.model';

@Component({
  selector: 'app-add-deal-dialog',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatDialogModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
  ],
  templateUrl: './add-deal-dialog.component.html',
  styleUrl: './add-deal-dialog.component.scss',
})
export class AddDealDialogComponent implements OnInit {
  dealForm!: FormGroup;
  capRate = 0;

  constructor(
    private fb: FormBuilder,
    private store: Store,
    private dialogRef: MatDialogRef<AddDealDialogComponent>
  ) {}

  ngOnInit(): void {
    this.dealForm = this.fb.group({
      name: ['', [Validators.required, Validators.minLength(3)]],
      purchasePrice: ['', [Validators.required, Validators.min(0)]],
      address: ['', [Validators.required, Validators.minLength(5)]],
      noi: ['', [Validators.required, Validators.min(0)]],
    });

    // Calculate capRate whenever noi or purchasePrice changes
    this.dealForm.valueChanges.subscribe(() => {
      this.updateCapRate();
    });
  }

  updateCapRate(): void {
    const noi = this.dealForm.get('noi')?.value;
    const purchasePrice = this.dealForm.get('purchasePrice')?.value;

    if (noi && purchasePrice && purchasePrice > 0) {
      this.capRate = (noi / purchasePrice) * 100;
    } else {
      this.capRate = 0;
    }
  }

  onSave(): void {
    if (this.dealForm.valid) {
      const newDeal: RawDeal = {
        id: Date.now(), // Simple ID generation; in production, the backend would generate this
        ...this.dealForm.value,
      };
      this.store.dispatch(addDeal({ deal: newDeal }));
      this.dialogRef.close();
    }
  }

  onCancel(): void {
    this.dialogRef.close();
  }
}
