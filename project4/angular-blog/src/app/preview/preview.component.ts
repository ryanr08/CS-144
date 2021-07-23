import { Input, Component, OnInit, Output, EventEmitter } from '@angular/core';
import { AppState } from '../app.component';
import { Parser, HtmlRenderer } from 'commonmark';
import { Post } from '../post';

@Component({
  selector: 'app-preview',
  templateUrl: './preview.component.html',
  styleUrls: ['./preview.component.css']
})
export class PreviewComponent implements OnInit {

  constructor() { }

  ngOnInit(): void {
  }

  @Input() post: Post;

  @Input() appstate: AppState;

  @Output() editPost = new EventEmitter<Post>();

  editPostFunc(post: Post) {
    this.editPost.emit(post);
  }

  reader = new Parser();
  writer = new HtmlRenderer();

  getTitle() : string {
    let parsed = this.reader.parse(this.post.title);
    let rendered = this.writer.render(parsed);
    return rendered;
  }

  getBody() : string {
    let parsed = this.reader.parse(this.post.body);
    let rendered = this.writer.render(parsed);
    return rendered;
  }

}
