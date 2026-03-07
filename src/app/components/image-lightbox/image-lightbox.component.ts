import { Component, inject, signal } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef, MatDialogModule } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatTooltipModule } from '@angular/material/tooltip';

export interface LightboxData {
  url: string;
  index: number;
  total: number;
}

@Component({
  selector: 'app-image-lightbox',
  imports: [MatDialogModule, MatButtonModule, MatIconModule, MatTooltipModule],
  templateUrl: './image-lightbox.component.html',
  styleUrl: './image-lightbox.component.scss',
})
export class ImageLightboxComponent {
  readonly data = inject<LightboxData>(MAT_DIALOG_DATA);
  private readonly dialogRef = inject(MatDialogRef<ImageLightboxComponent>);

  readonly zoomLevel = signal(1);
  readonly transformOrigin = signal('center center');
  readonly isZoomed = signal(false);

  private readonly MIN_ZOOM = 1;
  private readonly MAX_ZOOM = 5;
  private readonly ZOOM_STEP = 0.5;

  close(): void {
    this.dialogRef.close();
  }

  navigate(direction: 'prev' | 'next'): void {
    this.dialogRef.close(direction);
  }

  onImageClick(event: MouseEvent): void {
    if (this.isZoomed()) {
      this.resetZoom();
    } else {
      this.updateOrigin(event);
      this.zoomLevel.set(3);
      this.isZoomed.set(true);
    }
  }

  onMouseMove(event: MouseEvent): void {
    if (!this.isZoomed()) return;
    this.updateOrigin(event);
  }

  onWheel(event: WheelEvent): void {
    event.preventDefault();
    this.updateOrigin(event);

    const delta = event.deltaY < 0 ? this.ZOOM_STEP : -this.ZOOM_STEP;
    const newZoom = Math.min(this.MAX_ZOOM, Math.max(this.MIN_ZOOM, this.zoomLevel() + delta));
    this.zoomLevel.set(newZoom);
    this.isZoomed.set(newZoom > 1);
  }

  resetZoom(): void {
    this.zoomLevel.set(1);
    this.isZoomed.set(false);
    this.transformOrigin.set('center center');
  }

  private updateOrigin(event: MouseEvent): void {
    const target = event.currentTarget as HTMLElement;
    const rect = target.getBoundingClientRect();
    const x = ((event.clientX - rect.left) / rect.width) * 100;
    const y = ((event.clientY - rect.top) / rect.height) * 100;
    this.transformOrigin.set(`${x}% ${y}%`);
  }
}
