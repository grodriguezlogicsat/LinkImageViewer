import { Component } from '@angular/core';
import { ImageGalleryComponent } from './components/image-gallery/image-gallery.component';

@Component({
  selector: 'app-root',
  imports: [ImageGalleryComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent {}
