import { NgClass, AsyncPipe } from '@angular/common';
import { Component, OnInit, ChangeDetectionStrategy, ViewChild, ElementRef, OnDestroy, Output, EventEmitter, ChangeDetectorRef, inject } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ThemeService } from '@app/_core/services/common/theme.service';
import { fnGetRandomNum } from '@app/_core/utilities/tools';

import { NzAvatarModule } from 'ng-zorro-antd/avatar';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzCardModule } from 'ng-zorro-antd/card';
import { NzGridModule } from 'ng-zorro-antd/grid';
import { NzIconModule } from 'ng-zorro-antd/icon';
import { NzInputModule } from 'ng-zorro-antd/input';
import { NzResultModule } from 'ng-zorro-antd/result';
import { NzTypographyModule } from 'ng-zorro-antd/typography';

@Component({
  selector: 'app-chat',
  templateUrl: './chat.component.html',
  styleUrls: ['./chat.component.less'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: true,
  imports: [NzCardModule, NzTypographyModule, NzGridModule, NzAvatarModule, NzResultModule, NzIconModule, NzButtonModule, FormsModule, ReactiveFormsModule, NzInputModule, NgClass, AsyncPipe]
})
export class ChatComponent implements OnInit, OnDestroy {
  baseImage: string = "../../../../assets/imgs/";
  @ViewChild('scrollMe') private myScrollContainer!: ElementRef;
  @Output() readonly changeShows = new EventEmitter<boolean>();
  validateForm!: FormGroup;
  messageArray: Array<{ msg: string; dir: 'left' | 'right'; isReaded: boolean }> = [];
  isSending = false;
  show = false;
  auto_reply_messages: string[] = [
    "Sorry, I'm busy right now and I don't want to talk to you later",
    "Hello, send a one-yuan red envelope to automatically unlock the chat mode",
    "Hello, I'm not bored now. I hope you can find me again when you are bored",
    "Your little cutie is rushing to your chat interface for 800 miles",
    "The Fairy Castle woke up from a nap and replied to you",
    "Gulu Gulu Demonic Castle hotline is connected for you",
    "Don't bother me, I'm bubbling Ooooooo",
    "Daddy's Antique Shop, please leave a message if you have any questions",
    "I didn't come back but went to pull out carrots Ooo",
    "I don't like to reply to messages. I feel like I was a DND in my previous life",
    "Please press 1 for manual service",
    "Currently sold out, welcome to visit next time",
    "I'm going to the universe to catch stars, I'll be back soon",
    "Don't look for me, give me money if you need anything",
    "Hello, this is my automatic reply, your chat partner is temporarily unavailable",
    "You can chat with me, but I can only say this",
    "What are you doing, I am your Grandpa Niu",
    "Congratulations on unlocking my little cutie",
    "I'm going to buy some oranges, you stay here and don't move around",
    "I'm going to be a happy man, and I'll bring you an astronaut when I come back",
    "The other party is trying to connect to you, please wait, the current progress is 1%",
    "Oh my god, my head hurts, my head hurts, my head hurts if I don't have money to pay the Internet fee",
    "Welcome to the sand sculpture service hotline, please press 1 for manual chat, 2 for voice chat, and 3 for video chat",
    "Response skills are on cooldown",
    "Your message has been delivered and the other party received it but did not reply",
    "Sorry, the user you contacted is too good",
    "Has been deleted by Tencent, please contact 10086 for details",
    "Wait for me, I will use Fang Tian Hua Ji to peel an apple for you later",
    "Please enter I love you 520 times to summon me",
    "If you don't reply to the message, you are herding sheep. If you don't reply, the sheep is lost",
    "The Marine Supervision Bureau has captured her because she leaked the ancestral secret recipe of the Krusty Crab. She will contact you when she is released.",
    "Well, keep talking, I'm listening",
    "You are the beauty limited to summer",
    "Will reply within the viewing period",
    "On my way to an appointment with you",
    "Hey, this is the Krusty Krab in Bikini Beach, and I'm frying the patty in the Super Krabby Patty,",
    "If you need anything, please ask Brother Squidward, dududududu",
    "xx and I went to be astronauts, and we will catch aliens for you when we come back",
    "Drown in the ocean of learning",
    "The old demon from Montenegro and I went to the back mountain to discuss eating Tang Monk. We'll talk about it when we come back.",
    "Qianha?",
    "Louder! I can not hear!",
    "If you don't go back, you'll be in the canyon",
    "If you don't come back, you will be buried in the canyon",
    "If you don't reply, you are eating chicken",
    "If you don't reply, you will be eaten by a chicken",
    "I went to the universe",
    "Come back and pick the stars for you",
    "Hello",
    "Our boss is saving the galaxy",
    "Come back after defeating the monsters",
    "Wait a moment and you'll see him",
    "The owner said that if you want to know her whereabouts you need a packet of tomato-flavored potato chips",
    "Fish, the pond master went out to cast the net and came back to favor you",
    "Let's talk about it tonight, the kindergarten is not out yet",
    "Please wait a moment, sir, the master is on his way",
    "If you don't reply, you are begging for food",
    "Please shout beauty three times and I will appear immediately. If there is no response, it means you are not sincere. Please shout three more times, and so on.",
    "Thanks",
    "Your friend is offline, please transfer money first and then contact us",
    "I'm sorry, the other person is too cute,",
    "Something is lined up to make an appointment",
    "Don't disturb me when I'm basking in the sun",
    "There is a mole, it is not convenient to reply now",
    "taking a bath",
    "The other party has been poisoned, send me I love you to detoxify",
    "The other party's network is unstable, please try again later",
    "I'll come down to earth later to meet you ordinary people",
    "Cultivating in seclusion"
  ];

  readonly themesModel$ = inject(ThemeService).getStyleThemeMode();
  private fb = inject(FormBuilder);
  private cdr = inject(ChangeDetectorRef);

  ngOnDestroy(): void {
  }

  close(): void {
    this.changeShows.emit(false);
  }

  scrollToBottom(): void {
    setTimeout(() => {
      try {
        this.myScrollContainer.nativeElement.scrollTop = this.myScrollContainer.nativeElement.scrollHeight;
      } catch (err) { }
    });
  }

  clearMsgInput(): void {
    setTimeout(() => {
      this.validateForm.get('question')?.reset();
    });
  }

  sendMessage(msg: string, event: Event): void {
    if (!msg.trim()) {
      event.preventDefault();
      event.stopPropagation();
      this.clearMsgInput();
      return;
    }
    this.messageArray.push({ msg, dir: 'right', isReaded: false });
    this.clearMsgInput();

    setTimeout(() => {
      this.isSending = true;
      this.messageArray.forEach(item => {
        if (item.dir === 'right') {
          item.isReaded = true;
        }
      });
      this.cdr.markForCheck();
    }, 1000);

    setTimeout(() => {
      const index = fnGetRandomNum(0, this.auto_reply_messages.length);
      this.messageArray.push({ msg: this.auto_reply_messages[index], dir: 'left', isReaded: false });

      this.isSending = false;
      this.scrollToBottom();
      this.cdr.detectChanges();
    }, 3000);
  }

  ngOnInit(): void {
    this.validateForm = this.fb.group({
      question: [null]
    });
    this.scrollToBottom();
  }
}
