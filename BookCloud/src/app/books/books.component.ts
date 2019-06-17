import { Component, OnInit, ViewChild } from '@angular/core';
import { ApiService } from '../api.service';
import { Book } from '../book';
import { AuthenticationService } from '../_services/authentication.service';
import { User } from '../_models/user';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';

@Component({
  selector: 'app-books',
  templateUrl: './books.component.html',
  styleUrls: ['./books.component.css']
})
export class BooksComponent implements OnInit {

  displayedColumns: string[] = ['BookTitulo', 'BookAutor', 'BookGenero'];
  data: Book[];
  tableDataSource = new MatTableDataSource<Book>(this.data);
  isLoadingResults = true;
  currentUser: User;

  @ViewChild(MatPaginator) paginator: MatPaginator;

  constructor(
    private api: ApiService,
    private authenticationService: AuthenticationService) {
      this.authenticationService.currentUser.subscribe(x => this.currentUser = x);
    }

  ngOnInit() {
    this.api.getBooks()
      .subscribe(res => {
        this.data = res;
        console.log(this.data);
        this.tableDataSource = new MatTableDataSource<Book>(this.data);
        this.tableDataSource.paginator = this.paginator;
        this.isLoadingResults = false;
      }, err => {
        console.log(err);
        this.isLoadingResults = false;
      });
  }

  admin(): boolean {
    return this.currentUser.status === 'admin';
  }

  refreshDataSource() {
    this.tableDataSource = new MatTableDataSource<Book>(this.data);
    this.tableDataSource.paginator = this.paginator;
  }

  // tslint:disable-next-line:use-life-cycle-interface
  ngAfterViewInit() {
    this.refreshDataSource();
}

}
