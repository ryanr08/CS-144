import { Component } from '@angular/core';
import { BlogService } from './blog.service';
import { Post } from './post';
import * as cookie from 'cookie';


function parseJWT(token) 
{
  let base64Url = token.split('.')[1];
  let base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
  return JSON.parse(atob(base64));
}

export enum AppState { List, Edit, Preview };

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {

  username: string;

  constructor(private blogService: BlogService) {
    let cookies = cookie.parse(document.cookie);
    let JWT = parseJWT(cookies.jwt);
    this.username = JWT.usr;

    blogService.fetchPosts(this.username)
    .then(res => {this.posts = res});

    this.currentPost = new Post;
    this.currentPost.postid = 1;

    this.onHashChange();
    window.addEventListener("hashchange", () => this.onHashChange());
  }

  posts: Post[];
  currentPost: Post;
  appState: AppState;

  title = 'Ryan Riahi\'s Blog';

  onHashChange() {
    if (window.location.hash === "/#/" || window.location.hash === "#/") {
      this.appState = AppState.List;
    }
    else if (window.location.hash.includes("#/edit/")) {
      this.appState = AppState.Edit;
      let pid = parseInt(window.location.hash.substr(7));

      if (pid > 0) {
        this.blogService.getPost(this.username, pid)
        .then(res => {this.currentPost = res});
      }
      else {
        if (this.currentPost.postid !== 0) {
          this.currentPost = new Post;
          this.currentPost.username = this.username;
          this.currentPost.postid = 0;
          this.currentPost.title = "";
          this.currentPost.body = "";
          this.currentPost.created = Date.now();
          this.currentPost.modified = Date.now();
        }
      }
    }
    else if (window.location.hash.includes("#/preview/")) {
      let pid = parseInt(window.location.hash.substr(10));
      this.appState = AppState.Preview;
      if (pid === 0) {
        if (this.currentPost.postid !== 0) {
          this.currentPost = new Post;
          this.currentPost.username = this.username;
          this.currentPost.postid = 0;
          this.currentPost.title = "";
          this.currentPost.body = "";
          this.currentPost.created = Date.now();
          this.currentPost.modified = Date.now();
        }
      }
      else {
        this.blogService.getPost(this.username, pid)
        .then(res => {this.currentPost = res;});
      }
    }
  }

  openPostHandler(event : number){
    window.location.hash = "#/edit/" + event;
  }

  newPostHandler() {
    window.location.hash = "#/edit/0";
  }

  savePostHandler(event: Post) {
    this.blogService.setPost(this.username, event)
    .then(res => {
      this.currentPost.modified = res.modified;
      if (res.postid) {
        this.currentPost.postid = res.postid;
        window.location.hash = "#/edit/" + this.currentPost.postid;
      }
    });
    this.blogService.fetchPosts(this.username)
    .then(res => {this.posts = res});
  }

  deletePostHandler(event: Post) {
    this.blogService.deletePost(this.username, this.currentPost.postid);
    this.blogService.fetchPosts(this.username)
    .then(res2 => {this.posts = res2});
    window.location.hash = "#/";
  }

  previewPostHandler(event: Post) {
    window.location.hash = "#/preview/" + event.postid;
  }


  editPostHandler(event: Post) {
    window.location.hash = "#/edit/" + event.postid;
  }

}