import { Component, effect, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { MatTooltipModule } from '@angular/material/tooltip';
import { ImageLightboxComponent, LightboxData } from '../image-lightbox/image-lightbox.component';
import { BulkAddDialogComponent } from '../bulk-add-dialog/bulk-add-dialog.component';

interface GalleryImage {
  url: string;
  loaded: boolean;
  error: boolean;
}

@Component({
  selector: 'app-image-gallery',
  imports: [
    FormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatIconModule,
    MatSnackBarModule,
    MatTooltipModule,
  ],
  templateUrl: './image-gallery.component.html',
  styleUrl: './image-gallery.component.scss',
})
export class ImageGalleryComponent {
  private readonly dialog = inject(MatDialog);
  private readonly snackBar = inject(MatSnackBar);
  private readonly STORAGE_KEY = 'linkImageViewer_urls';

  imageUrl = '';
  readonly images = signal<GalleryImage[]>(this.loadFromStorage());
  readonly viewMode = signal<'grid' | 'list'>('grid');

  constructor() {
    effect(() => {
      const urls = this.images()
        .filter(img => !img.error)
        .map(img => img.url);
      localStorage.setItem(this.STORAGE_KEY, JSON.stringify(urls));
    });
  }

  toggleViewMode(): void {
    this.viewMode.update(m => (m === 'grid' ? 'list' : 'grid'));
  }

  addImage(): void {
    const url = this.imageUrl.trim();
    if (!url) return;

    if (!this.isValidUrl(url)) {
      this.snackBar.open('URL no válida. Ingresa un enlace válido.', 'OK', { duration: 3000 });
      return;
    }

    if (this.images().some(img => img.url === url)) {
      this.snackBar.open('Esta imagen ya está en la galería.', 'OK', { duration: 3000 });
      return;
    }

    this.images.update(imgs => [...imgs, { url, loaded: false, error: false }]);
    this.imageUrl = '';
  }

  onImageLoad(index: number): void {
    this.images.update(imgs =>
      imgs.map((img, i) => (i === index ? { ...img, loaded: true } : img))
    );
  }

  onImageError(index: number): void {
    this.images.update(imgs =>
      imgs.map((img, i) => (i === index ? { ...img, error: true, loaded: true } : img))
    );
  }

  removeImage(index: number, event: Event): void {
    event.stopPropagation();
    this.images.update(imgs => imgs.filter((_, i) => i !== index));
  }

  openLightbox(index: number): void {
    const imgs = this.images().filter(img => !img.error);
    const actualIndex = this.getLoadedIndex(index);
    if (actualIndex === -1) return;

    this.showLightboxAt(actualIndex, imgs);
  }

  openBulkAdd(): void {
    const dialogRef = this.dialog.open(BulkAddDialogComponent, {
      width: '600px',
      maxWidth: '95vw',
    });

    dialogRef.afterClosed().subscribe((urls: string[] | undefined) => {
      if (!urls?.length) return;

      const existing = new Set(this.images().map(img => img.url));
      const newImages = urls
        .filter(url => !existing.has(url))
        .map(url => ({ url, loaded: false, error: false }));

      if (newImages.length > 0) {
        this.images.update(imgs => [...imgs, ...newImages]);
        this.snackBar.open(`${newImages.length} imagen(es) agregada(s)`, 'OK', { duration: 3000 });
      }
    });
  }

  clearAll(): void {
    this.images.set([]);
  }

  private showLightboxAt(index: number, imgs: GalleryImage[]): void {
    const data: LightboxData = {
      url: imgs[index].url,
      index,
      total: imgs.length,
    };

    const dialogRef = this.dialog.open(ImageLightboxComponent, {
      data,
      panelClass: 'lightbox-dialog',
      maxWidth: '100vw',
      maxHeight: '100vh',
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result === 'prev' && index > 0) {
        this.showLightboxAt(index - 1, imgs);
      } else if (result === 'next' && index < imgs.length - 1) {
        this.showLightboxAt(index + 1, imgs);
      }
    });
  }

  private getLoadedIndex(originalIndex: number): number {
    const img = this.images()[originalIndex];
    if (img.error) return -1;
    return this.images().filter(i => !i.error).indexOf(img);
  }

  private isValidUrl(string: string): boolean {
    try {
      const url = new URL(string);
      return url.protocol === 'http:' || url.protocol === 'https:';
    } catch {
      return false;
    }
  }

  private loadFromStorage(): GalleryImage[] {
    try {
      const stored = localStorage.getItem(this.STORAGE_KEY);
      if (!stored) return [];
      const urls: string[] = JSON.parse(stored);
      return urls.map(url => ({ url, loaded: false, error: false }));
    } catch {
      return [];
    }
  }
}
