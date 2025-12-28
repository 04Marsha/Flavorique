import { Injectable } from '@angular/core';
import { map, Subject } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { environment } from '../../environments/environment';

import { Post } from './post.model';

const BACKEND_URL = environment.apiUrl + '/posts/';

@Injectable({ providedIn: 'root' })
export class PostsService {
  private posts: Post[] = [];
  private postsUpdated = new Subject<{ posts: Post[]; postCount: number }>();

  constructor(private http: HttpClient, private router: Router) {}

  getPosts(postsPerPage?: number, currentPage?: number) {
    let queryParams = '';

    if (postsPerPage && currentPage) {
      queryParams = `?pageSize=${postsPerPage}&page=${currentPage}`;
    }
    this.http
      .get<{ message: string; posts: any; maxPosts: number }>(
        BACKEND_URL + queryParams
      )
      .pipe(
        map((postData) => {
          return {
            posts: postData.posts.map((post) => {
              return {
                recipeName: post.recipeName,
                yourName: post.yourName,
                recipe: post.recipe,
                id: post._id,
                imagePath: post.imagePath,
                creator: post.creator,
              };
            }),
            postCount: postData.maxPosts,
          };
        })
      )
      .subscribe((transformedData) => {
        this.posts = transformedData.posts;
        this.postsUpdated.next({
          posts: [...this.posts],
          postCount: transformedData.postCount,
        });
      });
  }

  getPostUpdateListener() {
    return this.postsUpdated.asObservable();
  }

  getPost(id: string) {
    return this.http.get<{
      _id: string;
      recipeName: string;
      yourName: string;
      recipe: string;
      imagePath: string;
      creator: string;
    }>(BACKEND_URL + id);
  }

  addPost(recipeName: string, yourName: string, recipe: string, image: File) {
    const postData = new FormData();
    postData.append('recipeName', recipeName);
    postData.append('yourName', yourName);
    postData.append('recipe', recipe);
    postData.append('image', image, recipeName);
    this.http
      .post<{ message: string; post: Post }>(BACKEND_URL, postData)
      .subscribe((responseData) => {
        this.router.navigate(['/']);
      });
  }

  updatePost(
    id: string,
    recipeName: string,
    yourName: string,
    recipe: string,
    image: File | string
  ) {
    let postData: Post | FormData;
    if (typeof image === 'object') {
      postData = new FormData();
      postData.append('id', id);
      postData.append('recipeName', recipeName);
      postData.append('yourName', yourName);
      postData.append('recipe', recipe);
      postData.append('image', image, recipeName);
    } else {
      postData = {
        id: id,
        recipeName: recipeName,
        yourName: yourName,
        recipe: recipe,
        imagePath: image,
        creator: null,
      };
    }
    this.http.put(BACKEND_URL + id, postData).subscribe((response) => {
      this.router.navigate(['/']);
    });
  }

  deletePost(postId: string) {
    this.http.delete(BACKEND_URL + postId).subscribe(() => {
      this.posts = this.posts.filter((post) => post.id !== postId);

      this.postsUpdated.next({
        posts: [...this.posts],
        postCount: this.posts.length,
      });
    });
  }
}
