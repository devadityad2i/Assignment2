import { Component , OnInit} from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Row } from './row.interface';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit  {
   rows: Row[] = []; // Array of rows
  displayedRows: Row[] = []; // Rows to display on the current page
  currentPage = 1; // Current page number
  totalPages = 1; // Total number of pages
  pageSize = 10; // Number of rows per page
  searchText = ''; // Search text

  constructor(private http: HttpClient) {}

  ngOnInit(): void {
    this.http.get<Row[]>('https://geektrust.s3-ap-southeast-1.amazonaws.com/adminui-problem/members.json')
      .subscribe((data) => {
        this.rows = data;
        this.updateDisplayedRows();
      });
  }

  updateDisplayedRows() {
    // Apply search filter
    let filteredRows = this.rows;
    if (this.searchText) {
      filteredRows = this.rows.filter(row =>
        Object.values(row).some(value => value.toString().toLowerCase().includes(this.searchText.toLowerCase()))
      );
    }

    // Calculate pagination
    this.totalPages = Math.ceil(filteredRows.length / this.pageSize);
    this.currentPage = Math.max(1, Math.min(this.currentPage, this.totalPages));

    const startIndex = (this.currentPage - 1) * this.pageSize;
    const endIndex = startIndex + this.pageSize;
    this.displayedRows = filteredRows.slice(startIndex, endIndex);
  }

  search() {
    this.currentPage = 1;
    this.updateDisplayedRows();
  }

  goToPage(pageNumber: number) {
    this.currentPage = Math.max(1, Math.min(pageNumber, this.totalPages));
    this.updateDisplayedRows();
  }

  // onEdit(row: Row, value: string) {
  //   row.name = value;
  // }

  editRow(row: Row) {
    row.editable = true;
  }

  saveRow(row: Row) {
    row.editable = false;
  }

  deleteRow(row: Row) {
    this.rows = this.rows.filter(r => r !== row);
    this.updateDisplayedRows();
  }

  deleteSelected() {
    this.rows = this.rows.filter(row => !row.selected);
    this.updateDisplayedRows();
  }

  get pageNumbers() {
    return Array.from({ length: this.totalPages }, (_, i) => i + 1);
  }
  selectAll(event: any) {
    const isChecked = event.target.checked;
    this.displayedRows.forEach(row => row.selected = isChecked);
  }
  
  isAllSelected() {
    return this.displayedRows.every(row => row.selected);
  }
  onEdit(row: any, field: string) {
    
    // Implement your logic to update the data in the row
    // For example, you can update the 'name', 'email', or 'role' based on the 'field' parameter
    console.log(`Editing ${field} for row with ID ${row.id}`);
  }
   toggleEdit(row: any) {
    row.editable = !row.editable;
  }
}
