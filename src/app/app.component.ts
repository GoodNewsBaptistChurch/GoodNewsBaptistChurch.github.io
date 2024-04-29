import { Component, NgModule, OnInit, ViewChild, ElementRef } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { HttpClientModule } from '@angular/common/http';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { ActivatedRoute } from '@angular/router';

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

  constructor(private route: ActivatedRoute, private http: HttpClient) {}

  ngOnInit() {
    const savedHymnIndex = localStorage.getItem('currentHymnIndex');
    if (savedHymnIndex !== null) {
      this.currentHymnIndex = +savedHymnIndex;
    }

    // Make an HTTP GET request to fetch the hymns.json file
    this.http.get<any[]>('assets/hymns.json').subscribe(
      (data) => {
        this.hymns = data; // Assign the fetched data to the hymns variable
        this.loadCurrentHymn();
        console.log('Hymns:', this.hymns); // Log the fetched hymns to the console
      },
      (error) => {
        console.error('Error fetching hymns:', error); // Log any errors
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
      this.hymnNumberInput.nativeElement.blur(); // Unfocus the input field
    }
  }
  
  decrementHymn() {
    if (this.currentHymnIndex > 0) {
      this.currentHymnIndex--;
      this.loadCurrentHymn();
      this.saveCurrentHymnIndex();
      this.hymnNumberInput.nativeElement.blur(); // Unfocus the input field
    }
  }

  searchHymn() {
    const index = parseInt(this.searchValue, 10) - 1;
    if (!isNaN(index) && index >= 0 && index < this.hymns.length) {
      this.currentHymnIndex = index;
      this.loadCurrentHymn();
      this.saveCurrentHymnIndex();
      this.searchValue = ''; // Clear the search input after searching
      this.hymnNumberInput.nativeElement.blur(); // Unfocus the input field
    }
  }

  updateSearchPlaceholder() {
    // Update the placeholder attribute without changing searchValue
    this.hymnNumberInput.nativeElement.placeholder = (this.currentHymnIndex + 1).toString();
  }

  saveCurrentHymnIndex() {
    localStorage.setItem('currentHymnIndex', this.currentHymnIndex.toString());
  }
}
