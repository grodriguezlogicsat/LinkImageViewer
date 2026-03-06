import { Component, inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef, MatDialogModule } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';

export interface LightboxData {
  url: string;
  index: number;
  total: number;
}

@Component({
  selector: 'app-image-lightbox',
  imports: [MatDialogModule, MatButtonModule, MatIconModule],
  templateUrl: './image-lightbox.component.html',
  styleUrl: './image-lightbox.component.scss',
})
export class ImageLightboxComponent {
  readonly data = inject<LightboxData>(MAT_DIALOG_DATA);
  private readonly dialogRef = inject(MatDialogRef<ImageLightboxComponent>);

  close(): void {
    this.dialogRef.close();
  }

  navigate(direction: 'prev' | 'next'): void {
    this.dialogRef.close(direction);
  }
}
