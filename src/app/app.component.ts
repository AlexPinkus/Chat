import { Component } from '@angular/core';

import { AuthService } from './services/auth.service';
import { ChatService } from './services/chat.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  title = 'chat';

  constructor(public auth: AuthService, private chatService: ChatService) { }

  async startChat( ) {
    const id =  await this.auth.anonymousLogin();
    this.chatService.createChat(id);
  }

}
