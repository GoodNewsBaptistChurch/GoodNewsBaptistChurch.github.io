import { Component, NgModule, OnInit, ViewChild, ElementRef } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { HttpClientModule } from '@angular/common/http';
import { FormsModule } from '@angular/forms'; // Import FormsModule
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-root',
  standalone: true,
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
  imports: [HttpClientModule, FormsModule, CommonModule] // Add FormsModule here
})
export class AppComponent implements OnInit {
  hymns: any[] = [];
  currentHymnIndex: number = 0;
  currentHymn: any;
  searchValue: string = '';
  @ViewChild('hymnNumberInput', { static: true }) hymnNumberInput!: ElementRef;

  constructor(private http: HttpClient) {}

  ngOnInit() {
    // Make an HTTP GET request to fetch the hymns.json file
    this.http.get<any[]>('assets/hymns.json').subscribe(
      (data) => {
        this.hymns = data; // Assign the fetched data to the hymns variable
        this.currentHymn = this.hymns[this.currentHymnIndex];
        console.log('Hymns:', this.hymns); // Log the fetched hymns to the console
        this.updateSearchPlaceholder();
      },
      (error) => {
        console.error('Error fetching hymns:', error); // Log any errors
      }
    );
  }

  incrementHymn() {
    if (this.currentHymnIndex < this.hymns.length - 1) {
      this.currentHymnIndex++;
      this.currentHymn = this.hymns[this.currentHymnIndex];
      this.updateSearchPlaceholder();
      this.hymnNumberInput.nativeElement.blur(); // Unfocus the input field
    }
  }
  
  decrementHymn() {
    if (this.currentHymnIndex > 0) {
      this.currentHymnIndex--;
      this.currentHymn = this.hymns[this.currentHymnIndex];
      this.updateSearchPlaceholder();
      this.hymnNumberInput.nativeElement.blur(); // Unfocus the input field
    }
  }

  searchHymn() {
    const index = parseInt(this.searchValue, 10) - 1;
    if (!isNaN(index) && index >= 0 && index < this.hymns.length) {
      this.currentHymnIndex = index;
      this.currentHymn = this.hymns[this.currentHymnIndex];
      this.searchValue = ''; // Clear the search input after searching
      this.updateSearchPlaceholder();
      this.hymnNumberInput.nativeElement.blur(); // Unfocus the input field
    }
  }

  updateSearchPlaceholder() {
    // Update the placeholder attribute without changing searchValue
    this.hymnNumberInput.nativeElement.placeholder = (this.currentHymnIndex + 1).toString();
  }
}
