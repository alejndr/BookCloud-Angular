import { Component, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { ActivatedRoute, Router } from '@angular/router';
import { ApiService } from '../api.service';
import { Book } from '../book';
import { Review } from '../review';
import { FormBuilder, FormGroup, NgForm, Validators } from '@angular/forms';
import { User } from '../_models/user';
import { UserService } from '../_services/user.service';
import { AuthenticationService } from '../_services/authentication.service';

@Component({
  selector: 'app-book-detail',
  templateUrl: './book-detail.component.html',
  styleUrls: ['./book-detail.component.css']
})

export class BookDetailComponent implements OnInit {

  currentUser: User;
  currentUserSubscription: Subscription;

  book: Book;

  reviewForm: FormGroup;

  body: '';
  rating: '';

  data: Review[] = [];

  isLoadingResults = false;

  constructor(private route: ActivatedRoute,
              private api: ApiService,
              private router: Router,
              private formBuilder: FormBuilder,
              private authenticationService: AuthenticationService,
              private userService: UserService) {
                this.currentUserSubscription = this.authenticationService.currentUser.subscribe(user => {
                  this.currentUser = user;
                });
              }

// Get book details on page load
  ngOnInit() {

    // console.log(this.route.snapshot.params.id);
    this.getBooksDetails(this.route.snapshot.params.id);
  }

  // Check if the user has the status of admin
  admin(): boolean {
    return this.currentUser.status === 'admin';
  }


  getBooksDetails(id) {
    this.api.getBook(id)
      .subscribe(data => {
        this.book = data;
        console.log(this.book);
        this.isLoadingResults = false;
        this.getBooksReviews(this.book.BookTitulo);

        this.reviewForm = this.formBuilder.group({
          body : [null, Validators.required],
          rating : [null, [Validators.required, Validators.min(0), Validators.max(10)]],
          username: [this.currentUser.username, Validators.nullValidator],
          book: [this.book.BookTitulo]
        });
      });
  }

  deleteBook(id) {
    this.isLoadingResults = true;
    this.api.deleteBook(id)
      .subscribe(res => {
          this.isLoadingResults = false;
          this.router.navigate(['/books']);
        }, (err) => {
          console.log(err);
          this.isLoadingResults = false;
        }
      );
  }


  getBooksReviews(book) {
    this.api.getBookReviews(book)
      .subscribe(res => {
        this.data = res;
        console.log(this.data);
        this.isLoadingResults = false;
      }, err => {
        console.log(err);
        this.isLoadingResults = false;
      });
  }

  onFormSubmit(form: NgForm) {
    this.isLoadingResults = true;
    console.log(form);
    this.api.addReview(form)
      .subscribe(res => {
          // const id = res._id;
          this.isLoadingResults = false;
          this.getBooksReviews(this.book.BookTitulo);
      }, (err) => {
        console.log(err);
        this.isLoadingResults = false;
      });
  }


}
