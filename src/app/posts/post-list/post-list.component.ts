import { Component, OnDestroy, OnInit } from '@angular/core';
import { Post } from '../post.model';
import { PostsService } from '../posts.service';
import { Subscription } from 'rxjs';
import { AuthService } from '../../auth/auth.service';

@Component({
  selector: 'app-post-list',
  standalone: false,
  templateUrl: './post-list.component.html',
  styleUrls: ['./post-list.component.css'],
})
export class PostListComponent implements OnInit, OnDestroy {
  posts: Post[] = [];
  isLoading = false;
  isVisible = false;
  private postsSub: Subscription;
  userIsAuthenticated = false;
  private authStatusSub: Subscription;
  userId: string;
  selectedPost: Post | null = null;

  constructor(
    public postsService: PostsService,
    private authService: AuthService
  ) {}

  ngOnInit() {
    this.postsService.getPosts();
    this.isLoading = true;
    this.userId = this.authService.getUserId();
    this.postsSub = this.postsService
      .getPostUpdateListener()
      .subscribe((posts: Post[]) => {
        this.isLoading = false;
        this.posts = posts;
      });
    this.userIsAuthenticated = this.authService.getIsAuth();
    this.authStatusSub = this.authService
      .getAuthStatusListener()
      .subscribe((isAuthenticated) => {
        this.userIsAuthenticated = isAuthenticated;
        this.userId = this.authService.getUserId();
      });
  }

  onDelete(postId: string) {
    this.postsService.deletePost(postId);
  }

  onImageClicked(postId: string) {
    this.isLoading = true;
    this.postsService.getPost(postId).subscribe((postData) => {
      this.selectedPost = {
        id: postData._id,
        recipeName: postData.recipeName,
        yourName: postData.yourName,
        recipe: postData.recipe,
        imagePath: postData.imagePath,
        creator: postData.creator,
      };
      this.isLoading = false;
    });
  }

  closeDisplay() {
    this.selectedPost = null;
  }

  ngOnDestroy() {
    this.postsSub.unsubscribe();
    this.authStatusSub.unsubscribe();
  }
}
