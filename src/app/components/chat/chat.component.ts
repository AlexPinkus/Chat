import { Observable } from 'rxjs';
import { Message } from 'src/app/models/message';
import { ChatService } from 'src/app/services/chat.service';

import { Component, Input, OnInit } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';

@Component({
  selector: 'app-chat',
  templateUrl: './chat.component.html',
  styleUrls: ['./chat.component.scss']
})
export class ChatComponent implements OnInit {
  @Input() sessionId: string;
  @Input() title: string;
  @Input() sender: string;
  @Input() receiver: string;

  adminLoading$: Observable<boolean>;
  messages$: Observable<Message[]>;
  loading = false;

  // sessionId = Math.random().toString(36).slice(-5);

  constructor(private db: AngularFirestore, private chatService: ChatService) { }

  ngOnInit() {
    this.messages$ = this.chatService.getChatMessages(this.sessionId, this.sender);
    this.adminLoading$ = this.chatService.getChatStatus(this.sessionId, this.receiver);
  }

  handleUserMessage(event) {
    const text = event.message;
    if (!text) { return; }
    this.loading = false;
    this.chatService.setLoading(this.sessionId, {[this.sender]: false});
    this.chatService.addMessage(this.sessionId, new Message(text, this.sender));
  }

  onKey(event) {
    if (!event.target.value) {
      this.loading = false;
      this.chatService.setLoading(this.sessionId, {[this.sender]: false});
      return;
    }

    if (!this.loading && event.key !== 'Enter') {
      this.chatService.setLoading(this.sessionId, {[this.sender]: true});
    }

    this.loading = event.key !== 'Enter';
  }

}
