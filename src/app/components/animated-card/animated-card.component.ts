import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-animated-card',
  templateUrl: './animated-card.component.html',
  styleUrls: ['./animated-card.component.css']
})
export class AnimatedCardComponent implements OnInit {
  images: string[] = [
    'assets/image1.jpg',
    'assets/image2.jpg',
    'assets/image3.jpg'
  ];
  currentImageIndex: number = 0;

  ngOnInit(): void {
    this.startImageRotation();
  }

  startImageRotation(): void {
    setInterval(() => {
      this.currentImageIndex = (this.currentImageIndex + 1) % this.images.length;
    }, 3000); // Change image every 3 seconds
  }
}
