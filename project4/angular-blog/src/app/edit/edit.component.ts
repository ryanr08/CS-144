import { Input, Component, OnInit, Output, EventEmitter } from '@angular/core';
import { Post } from '../post';
import { AppState } from '../app.component';


@Component({
  selector: 'app-edit',
  templateUrl: './edit.component.html',
  styleUrls: ['./edit.component.css']
})
export class EditComponent implements OnInit {

  @Input() post: Post;

  @Input() appstate: AppState;

  @Output() savePost = new EventEmitter<Post>();

  @Output() deletePost = new EventEmitter<Post>();

  @Output() previewPost = new EventEmitter<Post>();

  toHumanReadable(date) {
    var d = new Date(date);
    return d.toUTCString();;
  }

  savePostFunc(post: Post) {
    this.savePost.emit(post);
  }

  deletePostFunc(post: Post) {
    this.deletePost.emit(post);
  }

  previewPostFunc(post: Post) {
    this.previewPost.emit(post);
  }

  constructor() { }

  ngOnInit(): void {
  }

}
