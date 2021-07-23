import { Injectable } from '@angular/core';
import { Post } from './post';

@Injectable({
  providedIn: 'root'
})
export class BlogService {

    constructor() { 
    }

    async fetchPosts(username: string): Promise<Post[]> {
        let fetch_url = "/api/posts?username=" + username;
        let results = await fetch(fetch_url, {method:"GET"});
        return results.json();
    }

    async getPost(username: string, postid: number): Promise<Post> {
        let fetch_url = "/api/posts?username=" + username + "&postid=" + postid;
        let results = await fetch(fetch_url, {method:"GET"});
        return results.json();
    }

    async setPost(username: string, p: Post): Promise<Post> {
        let results = await fetch("/api/posts", {method:"POST", headers: {
            'Content-Type': 'application/json'
          }, body: JSON.stringify(p)});
        return results.json();
    }

    async deletePost(username: string, postid: number): Promise<void> {
        let fetch_url = "/api/posts?username=" + username + "&postid=" + postid;
        let results = await fetch(fetch_url, {method:"DELETE"});
        return results.json();
    }
}
