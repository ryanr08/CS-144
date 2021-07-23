import { Input, Component, OnInit, Output, EventEmitter } from '@angular/core';
import { Post } from '../post';

@Component({
  selector: 'app-list',
  templateUrl: './list.component.html',
  styleUrls: ['./list.component.css']
})
export class ListComponent implements OnInit {

  @Input() posts: Post[];

  @Output() openPost = new EventEmitter<Post>();

  @Output() newPost = new EventEmitter();

  toHumanReadable(date) {
    var d = new Date(date);
    return d.toLocaleDateString();
  }

  newPostFunc() : void {
    this.newPost.emit();
  }

  openPostFunc(post: Post) : void {
    this.openPost.emit(post);
  }


  constructor() { }

  ngOnInit(): void {
  }

}
