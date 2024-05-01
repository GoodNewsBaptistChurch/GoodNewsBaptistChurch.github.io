import { Component, NgModule, OnInit, ViewChild, ElementRef, Renderer2 } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { HttpClientModule } from '@angular/common/http';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { ActivatedRoute } from '@angular/router';
import * as bootstrap from 'bootstrap';

@Component({
  selector: 'app-root',
  standalone: true,
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
  imports: [HttpClientModule, FormsModule, CommonModule]
})
export class AppComponent implements OnInit {
  hymns: any[] = [];
  currentHymnIndex: number = 0;
  currentHymn: any;
  searchValue: string = '';
  @ViewChild('hymnNumberInput', { static: true }) hymnNumberInput!: ElementRef;
  @ViewChild('fullscreenModal') fullscreenModal!: ElementRef;

  constructor(private route: ActivatedRoute, private http: HttpClient, private renderer: Renderer2) {}

  ngOnInit() {
    const savedHymnIndex = localStorage.getItem('currentHymnIndex');
    if (savedHymnIndex !== null) {
      this.currentHymnIndex = +savedHymnIndex;
    }

    this.http.get<any[]>('assets/hymns.json').subscribe(
      (data) => {
        this.hymns = data;
        this.loadCurrentHymn();
        console.log('Hymns: ', this.hymns);
      },
      (error) => {
        console.error('Error: ', error);
      }
    );
  }

  loadCurrentHymn() {
    if (this.currentHymnIndex >= 0 && this.currentHymnIndex < this.hymns.length) {
      this.currentHymn = this.hymns[this.currentHymnIndex];
      this.updateSearchPlaceholder();
    }
  }

  incrementHymn() {
    if (this.currentHymnIndex < this.hymns.length - 1) {
      this.currentHymnIndex++;
      this.loadCurrentHymn();
      this.saveCurrentHymnIndex();
      this.hymnNumberInput.nativeElement.blur();
    }
  }
  
  decrementHymn() {
    if (this.currentHymnIndex > 0) {
      this.currentHymnIndex--;
      this.loadCurrentHymn();
      this.saveCurrentHymnIndex();
      this.hymnNumberInput.nativeElement.blur();
    }
  }

  searchHymn() {
    const index = parseInt(this.searchValue, 10) - 1;
    if (!isNaN(index) && index >= 0 && index < this.hymns.length) {
      this.currentHymnIndex = index;
      this.loadCurrentHymn();
      this.saveCurrentHymnIndex();
      this.searchValue = '';
      this.hymnNumberInput.nativeElement.blur();
    }
  }

  updateSearchPlaceholder() {
    this.hymnNumberInput.nativeElement.placeholder = (this.currentHymnIndex + 1).toString();
  }

  saveCurrentHymnIndex() {
    localStorage.setItem('currentHymnIndex', this.currentHymnIndex.toString());
  }


}