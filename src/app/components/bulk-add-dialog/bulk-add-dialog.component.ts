import { Component, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatDialogRef, MatDialogModule } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-bulk-add-dialog',
  imports: [
    FormsModule,
    MatDialogModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatIconModule,
  ],
  templateUrl: './bulk-add-dialog.component.html',
  styleUrl: './bulk-add-dialog.component.scss',
})
export class BulkAddDialogComponent {
  private readonly dialogRef = inject(MatDialogRef<BulkAddDialogComponent>);

  linksText = '';

  get parsedCount(): number {
    return this.parseUrls().length;
  }

  cancel(): void {
    this.dialogRef.close();
  }

  confirm(): void {
    const urls = this.parseUrls();
    if (urls.length > 0) {
      this.dialogRef.close(urls);
    }
  }

  private parseUrls(): string[] {
    return this.linksText
      .split('\n')
      .map(line => line.trim())
      .filter(line => {
        if (!line) return false;
        try {
          const url = new URL(line);
          return url.protocol === 'http:' || url.protocol === 'https:';
        } catch {
          return false;
        }
      });
  }
}
