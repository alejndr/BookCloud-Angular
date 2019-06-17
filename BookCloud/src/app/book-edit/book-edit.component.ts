import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { ApiService } from '../api.service';
import { FormControl, FormGroupDirective, FormBuilder, FormGroup, NgForm, Validators } from '@angular/forms';

@Component({
  selector: 'app-book-edit',
  templateUrl: './book-edit.component.html',
  styleUrls: ['./book-edit.component.css']
})
export class BookEditComponent implements OnInit {

  bookForm: FormGroup;

  id = '';
  BookTitulo = '';
  BookSinopsis = '';
  BookISBN = '';
  BookGenero = '';
  BookPortada = '';
  BookAutor = '';
  BookPaginas = null;
  updatedAt = null;

  isLoadingResults = false;

  constructor(private router: Router, private route: ActivatedRoute, private api: ApiService, private formBuilder: FormBuilder) { }

  ngOnInit() {
    this.getBook(this.route.snapshot.params.id);
    this.bookForm = this.formBuilder.group({
      BookTitulo : [null, [Validators.required, Validators.maxLength(100)]],
      BookSinopsis : [null, [Validators.required, Validators.maxLength(600)]],
      BookISBN : [null, [Validators.required, Validators.maxLength(50)]],
      BookGenero : [null, [Validators.required, Validators.maxLength(50)]],
      BookPortada : [null, [Validators.required, Validators.maxLength(300)]],
      BookAutor : [null, [Validators.required, Validators.maxLength(50)]],
      BookPaginas : [null, [Validators.required, Validators.max(9999)]]
    });
  }

  onFormSubmit(form: NgForm) {
    this.isLoadingResults = true;
    this.api.updateBook(this.id, form)
      .subscribe(res => {
          const id = res.id;
          this.isLoadingResults = false;
          this.router.navigate(['/book-details', id]);
        }, (err) => {
          console.log(err);
          this.isLoadingResults = false;
        }
      );
  }

  getBook(id) {
    this.api.getBook(id).subscribe(data => {
      this.id = data._id;
      this.bookForm.setValue({
        BookTitulo: data.BookTitulo,
        BookAutor: data.BookAutor,
        BookGenero: data.BookGenero,
        BookISBN: data.BookISBN,
        BookPaginas: data.BookPaginas,
        BookPortada: data.BookPortada,
        BookSinopsis: data.BookSinopsis
      });
    });
  }

  bookDetails() {
    this.router.navigate(['/book-details', this.id]);
  }

}
