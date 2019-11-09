import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { BlogPostService } from '../services/blog-post.service';
import { BlogPost } from '../models/blogpost';

@Component({
  selector: 'app-blog-post-add-edit',
  templateUrl: './blog-post-add-edit.component.html',
  styleUrls: ['./blog-post-add-edit.component.scss']
})
export class BlogPostAddEditComponent implements OnInit {
  form: FormGroup;
  actionType: string;
  Code: string;
  Description: string;
  CId: number;
  Sourcename: string;
  imageurl: string;
  docurl: string;
  errorMessage: any;
  existingBlogPost: BlogPost;

  constructor(private blogPostService: BlogPostService, private formBuilder: FormBuilder, private avRoute: ActivatedRoute, private router: Router) {
    const idParam = 'id';
    this.actionType = 'Add';
    this.Code = 'Code';
    this.Description = 'Description';
    this.Sourcename = 'Sourcename';
    this.imageurl = 'imageurl';
    this.docurl = 'docurl';
    if (this.avRoute.snapshot.params[idParam]) {
      this.CId = this.avRoute.snapshot.params[idParam];
    }

    this.form = this.formBuilder.group(
      {
        CId: 0,
        Code: ['', [Validators.required]],
        Description: ['', [Validators.required]],
        Sourcename: [''],
        imageurl: [''],
        docurl: [''],
      }
    )
  }

  ngOnInit() {

    if (this.CId > 0) {
      this.actionType = 'Edit';
      this.blogPostService.getBlogPost(this.CId)
        .subscribe(data => (
          this.existingBlogPost = data,
          this.form.controls[this.Code].setValue(data.Code),
          this.form.controls[this.Sourcename].setValue(data.Sourcename),
          this.form.controls[this.imageurl].setValue(data.imageurl),
          this.form.controls[this.docurl].setValue(data.docurl),
          this.form.controls[this.Description].setValue(data.Description)
        ));
    }
  }

  save() {
    if (!this.form.valid) {
      return;
    }

    if (this.actionType === 'Add') {
      let blogPost: BlogPost = {
        CId: 0,
        Sourcename: this.form.get(this.Sourcename).value,
        Code: this.form.get(this.Code).value,
        Description: this.form.get(this.Description).value,
        imageurl: this.form.get(this.imageurl).value,
        docurl: this.form.get(this.docurl).value,
      };

      this.blogPostService.saveBlogPost(blogPost)
        .subscribe((data) => {
          this.router.navigate(['/blogpost', data.CId]);
        });
    }

    if (this.actionType === 'Edit') {
      let blogPost: BlogPost = {
        CId: this.existingBlogPost.CId,
        Sourcename: this.form.get(this.Sourcename).value,
        Description: this.form.get(this.Description).value,
        Code: this.form.get(this.Code).value,
        imageurl: this.form.get(this.imageurl).value,
        docurl: this.form.get(this.docurl).value,
      };
      this.blogPostService.updateBlogPost(blogPost.CId, blogPost)
        .subscribe((data) => {
          this.router.navigate([this.router.url]);
        });
    }
  }
  cancel() {
    this.router.navigate(['/']);
  }

  get title() { return this.form.get(this.Code); }
  get body() { return this.form.get(this.Description); }
}