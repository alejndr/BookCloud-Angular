import { Injectable } from '@angular/core';

import { Observable, of, throwError } from 'rxjs';
import { HttpClient, HttpHeaders, HttpErrorResponse } from '@angular/common/http';
import { catchError, tap, map } from 'rxjs/operators';
import { Book } from './book';
import { Review } from './review';

const httpOptions = {
  headers: new HttpHeaders({'Content-Type': 'application/json'})
};
// const apiBooks = 'http://localhost:3000/books';
const apiBooks = 'https://radiant-badlands-64635.herokuapp.com/books';
// const apiReviews = 'http://localhost:3000/reviews';
const apiReviews = 'https://radiant-badlands-64635.herokuapp.com/reviews';

@Injectable({
  providedIn: 'root'
})
export class ApiService {

  constructor(private http: HttpClient) { }

  private handleError<T>(operation = 'operation', result?: T) {
    return (error: any): Observable<T> => {
      console.error(error);
      return of(result as T);
    };
  }

  // Get all books
  getBooks(): Observable<Book[]> {
    return this.http.get<Book[]>(apiBooks)
      .pipe(
        tap(books => console.log('fetched books')),
        catchError(this.handleError('getBooks', []))
      );
  }

  // Get a book by id
  getBook(id): Observable<Book> {
    const url = `${apiBooks}/${id}`;
    return this.http.get<Book>(url).pipe(
      tap(_ => console.log(`fetched book id=${id}`)),
      catchError(this.handleError<Book>(`getBook id=${id}`))
    );
  }


  // Add book
  addBook(book): Observable<Book> {
    return this.http.post<Book>(apiBooks, book, httpOptions).pipe(
      // tslint:disable-next-line:no-shadowed-variable
      tap((book: Book) => console.log(`added book w/ id=${book._id}`)),
      catchError(this.handleError<Book>('addBook'))
    );
  }

  // Update a book by id
  updateBook(id, book): Observable<any> {
    const url = `${apiBooks}/${id}`;
    return this.http.put(url, book, httpOptions).pipe(
      tap(_ => console.log(`updated book id=${id}`)),
      catchError(this.handleError<any>('updateBook'))
    );
  }

  // Delete a book
  deleteBook(id): Observable<Book> {
    const url = `${apiBooks}/${id}`;

    return this.http.delete<Book>(url, httpOptions).pipe(
      tap(_ => console.log(`deleted book id=${id}`)),
      catchError(this.handleError<Book>('deleteBook'))
    );
  }

  // getBook(id): Observable<Book> {
  //   const url = `${apiBooks}/${id}`;
  //   return this.http.get<Book>(url).pipe(
  //     tap(_ => console.log(`fetched book id=${id}`)),
  //     catchError(this.handleError<Book>(`getBook id=${id}`))
  //   );
  // }

  // Get Reviews
  getBookReviews(book): Observable<Review[]> {
    const url = `${apiReviews}/${book}`;
    return this.http.get<Review[]>(url).pipe(
        tap(reviews => console.log('fetched reviews')),
        catchError(this.handleError('getReviews', []))
      );
  }

  addReview(review): Observable<Review> {
    return this.http.post<Review>(apiReviews, review, httpOptions).pipe(
      // tslint:disable-next-line:no-shadowed-variable
      tap((review: Review) => console.log(`added review w/ id=${review._id}`)),
      catchError(this.handleError<Review>('addReview'))
    );
  }


}
