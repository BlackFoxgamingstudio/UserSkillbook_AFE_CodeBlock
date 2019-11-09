import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { retry, catchError } from 'rxjs/operators';
import { environment } from 'src/environments/environment';
import { BlogPost } from '../models/blogpost';

@Injectable({
  providedIn: 'root'
})
export class BlogPostService {

  myAppUrl: string;
  myApiUrl: string;
  httpOptions = {
    headers: new HttpHeaders({
      'Content-Type': 'application/json; charset=utf-8'
    })
  };
  constructor(private http: HttpClient) {
      this.myAppUrl = 'https://apiwebportalv2.azurewebsites.net/api/CodeDetail/';
   
  }

  getBlogPosts(): Observable<BlogPost[]> {
    return this.http.get<BlogPost[]>(this.myAppUrl)
    .pipe(
      retry(1),
      catchError(this.errorHandler)
    );
  }

  getBlogPost(CId: number): Observable<BlogPost> {
      return this.http.get<BlogPost>(this.myAppUrl + CId)
      .pipe(
        retry(1),
        catchError(this.errorHandler)
      );
  }

  saveBlogPost(blogPost): Observable<BlogPost> {
      return this.http.post<BlogPost>(this.myAppUrl, JSON.stringify(blogPost), this.httpOptions)
      .pipe(
        retry(1),
        catchError(this.errorHandler)
      );
  }

  updateBlogPost(CId: number, blogPost): Observable<BlogPost> {
      return this.http.put<BlogPost>(this.myAppUrl + CId, JSON.stringify(blogPost), this.httpOptions)
      .pipe(
        retry(1),
        catchError(this.errorHandler)
      );
  }

  deleteBlogPost(CId: number): Observable<BlogPost> {
      return this.http.delete<BlogPost>(this.myAppUrl + CId)
      .pipe(
        retry(1),
        catchError(this.errorHandler)
      );
  }

  errorHandler(error) {
    let errorMessage = '';
    if (error.error instanceof ErrorEvent) {
      // Get client-side error
      errorMessage = error.error.message;
    } else {
      // Get server-side error
      errorMessage = `Error Code: ${error.status}\nMessage: ${error.message}`;
    }
    console.log(errorMessage);
    return throwError(errorMessage);
  }
}
