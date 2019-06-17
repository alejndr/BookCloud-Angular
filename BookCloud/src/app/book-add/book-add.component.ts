import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ApiService } from '../api.service';
import { FormControl, FormGroupDirective, FormBuilder, FormGroup, NgForm, Validators } from '@angular/forms';

@Component({
  selector: 'app-book-add',
  templateUrl: './book-add.component.html',
  styleUrls: ['./book-add.component.css']
})

export class BookAddComponent implements OnInit {

    bookForm: FormGroup;

    BookTitulo: '';
    BookSinopsis: '';
    BookISBN: '';
    BookGenero: '';
    BookPortada: '';
    BookAutor: '';
    BookPaginas: null;
    updatedAt: null;

    isLoadingResults = false;


  constructor(private router: Router, private api: ApiService, private formBuilder: FormBuilder) { }

  ngOnInit() {
    this.bookForm = this.formBuilder.group({
      BookTitulo : [null, [Validators.required, Validators.maxLength(100)]],
      BookSinopsis : [null, [Validators.required, Validators.maxLength(999)]],
      BookISBN : [null, [Validators.required, Validators.maxLength(50)]],
      BookGenero : [null, [Validators.required, Validators.maxLength(50)]],
      BookPortada : [null, [Validators.required, Validators.maxLength(300)]],
      BookAutor : [null, [Validators.required, Validators.maxLength(50)]],
      BookPaginas : [null, [Validators.required, Validators.max(9999)]]
    });
  }

  onFormSubmit(form: NgForm) {
    this.isLoadingResults = true;
    this.api.addBook(form)
      .subscribe(res => {
          const id = res._id;
          this.isLoadingResults = false;
          this.router.navigate(['/book-details', id]);
      }, (err) => {
        console.log(err);
        this.isLoadingResults = false;
      });
  }

}
