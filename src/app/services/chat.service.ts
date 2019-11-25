

import { map } from 'rxjs/operators';

import { Injectable } from '@angular/core';
import { AngularFirestore, QueryFn } from '@angular/fire/firestore';

import { Message } from '../models/message';

interface ChatStatus {
  [sender: string]: boolean;
};


@Injectable({
  providedIn: 'root'
})
export class ChatService {

  constructor(private db: AngularFirestore) { }


  public getChat(id: string) {
    return this.db.collection('chats').doc(id);
  }

  public createChat(id: string) {
    return this.db.collection('chats').doc(id).set({admin: false, user: false});
  }

  public deleteChat(id: string) {
    return this.db.collection('chats').doc(id).delete();
  }


  public getChatMessages(id: string, sender: string) {
    const orderByDate: QueryFn = ref => ref.orderBy('date');
    const messagesTimestampToDate = (messages: Message[]) => messages.map(message => {
      return {
        ...message,
        date: (message.date as any).toDate(),
      };
    });
    const setMessageReply = (messages: Message[]) => messages.map(message => Message.setReply(message, sender));
    const messagesCollection = this.db.collection('chats').doc(id).collection('messages', orderByDate);

    return messagesCollection.valueChanges().pipe(
      map(messagesTimestampToDate),
      map(setMessageReply),
    );
  }

  public getChatStatus(id: string, sender: string) {
    return this.db.collection('chats').doc(id).valueChanges().pipe(
      map(chat => chat ? chat[sender] : false),
    );
  }

  public setLoading(id: string, status: ChatStatus) {
    return this.db.collection('chats').doc(id).update(status);
  }

  public addMessage(chatId: string, message: Message) {
    return this.db.collection('chats').doc(chatId).collection('messages').add({...message});
  }

}
