import {AfterViewInit, Component, ElementRef, OnDestroy, OnInit, ViewChild} from '@angular/core';
import {ActivatedRoute} from '@angular/router';
import {TokenService} from '../services/token.service';
import {MessageService} from '../services/message.service';
import {Client} from '@stomp/stompjs';
import * as SockJS from 'sockjs-client';
import {environment} from '../../environments/environment';
import {WebrtcService} from '../services/webrtc.service';

@Component({
  selector: 'app-conversation-detail',
  templateUrl: './conversation-detail.component.html',
  styleUrls: ['./conversation-detail.component.css']
})
export class ConversationDetailComponent implements OnInit, OnDestroy, AfterViewInit{

  constructor(private route: ActivatedRoute,
              private tokenService: TokenService,
              private messageService: MessageService,
              private webRTCService: WebrtcService) { }

  private client: Client;
  private localStream: MediaStream;
  private peerConnection: RTCPeerConnection;

  @ViewChild('scrollMessages') scrollMessages: ElementRef;
  @ViewChild('local_video') localVideo: ElementRef;
  @ViewChild('received_video') receivedVideo: ElementRef;

  conversationId: string;
  conversationName: string;
  messageList = [];
  message = '';
  mediaConstraints = {
    audio: true,
    video: {width: 720, height: 540}
  };
  offerOptions = {
    offerToReceiveAudio: true,
    offerToReceiveVideo: true
  };
  inCall = false;
  localVideoActive = false;

  ngOnInit(): void {
    this.conversationId = this.route.snapshot.paramMap.get('conversationId');
    this.conversationName = this.route.snapshot.paramMap.get('name');

    this.client = new Client();
    this.client.webSocketFactory = () => {
      return new SockJS(environment.url + '/ws');
    };
    this.client.onConnect = (frame) => {
      this.client.subscribe('/topic/' + this.conversationId, (event) => {
        this.retrieveMessages();
      });
    };

    this.client.activate();
    this.retrieveMessages();
  }

  ngOnDestroy(): void {
    this.client.deactivate();
    this.hangUp();
  }

  retrieveMessages(): void {
    this.messageService.read(this.conversationId, this.tokenService.retrieveUserId()).subscribe(response => {
      this.messageList = response;
      setTimeout(() =>  this.scrollDown(), 500);
    });
  }
  scrollDown(): void {
    this.scrollMessages.nativeElement.scrollTop = this.scrollMessages.nativeElement.scrollHeight;
  }

  send(): void {
    if (this.message === '') { return; }
    const messageToSend = this.message;
    this.message = '';
    this.messageService.send(this.conversationId, this.tokenService.retrieveUserId(), messageToSend).subscribe(response => {
    });
  }

  ngAfterViewInit(): void {
    this.addIncomingMessageHandler();
    this.requestMediaDevices();
  }

  private async requestMediaDevices(): Promise<void> {
    this.localStream = await navigator.mediaDevices.getUserMedia(this.mediaConstraints);
    this.pauseLocalVideo();
  }

  pauseLocalVideo(): void {
    this.localStream.getTracks().forEach(track => track.enabled = false);
    this.localVideo.nativeElement.srcObject = undefined;
    this.localVideoActive = false;
  }

  async startLocalVideo(): Promise<void> {
    this.localStream.getTracks().forEach(track => track.enabled = true);
    this.localVideo.nativeElement.srcObject = this.localStream;
    this.localVideoActive = true;
  }

  private closeVideoCall(): void {
    if (this.peerConnection) {
      this.peerConnection.onicecandidate = null;
      this.peerConnection.onicegatheringstatechange = null;
      this.peerConnection.onsignalingstatechange = null;
      this.peerConnection.ontrack = null;

      this.peerConnection.getTransceivers().forEach(transceiver => transceiver.stop());
      this.peerConnection.close();
      this.peerConnection = null;
      this.inCall = false;
    }
  }

  async call(): Promise<void> {
    this.createPeerConnection();
    this.localStream.getTracks().forEach(track => this.peerConnection.addTrack(track, this.localStream));
    try {
      const offer: RTCSessionDescriptionInit = await this.peerConnection.createOffer(this.offerOptions);
      await this.peerConnection.setLocalDescription(offer);
      this.inCall = true;
      this.webRTCService.sendMessage({type: 'offer', data: offer, conversationId: this.conversationId});
    } catch (err) {
      this.handleGetUserMediaError(err);
    }
  }

  private createPeerConnection(): void {
    this.peerConnection = new RTCPeerConnection({
      iceServers: [
        {
          urls: 'stun:stun1.l.google.com:19302'
        }
      ]
    });

    this.peerConnection.onicecandidate = this.handleICECandidateEvent;
    this.peerConnection.onicegatheringstatechange = this.handleIceConnectionStateChangeEvent;
    this.peerConnection.onsignalingstatechange = this.handleSignalingStateEvent;
    this.peerConnection.ontrack = this.handleTrackEvent;
  }

  private handleGetUserMediaError(err: Error): void {
    switch (err.name) {
      case 'NotFoundError':
        alert('no camera or microphone were found');
        break;
      case 'SecurityError':
      case 'PermissionDeniedError':
        break;
      default:
        alert('Error! cuelga la llamada y vuelve a intentarlo');
    }
    this.closeVideoCall();
  }

  private handleICECandidateEvent = (event: RTCPeerConnectionIceEvent) => {
    if (event.candidate) {
      this.webRTCService.sendMessage({
        type: 'ice-candidate',
        data: event.candidate,
        conversationId: this.conversationId
        });
    }
  }

  private handleIceConnectionStateChangeEvent = (event: Event) => {
    switch (this.peerConnection.iceConnectionState) {
      case 'closed':
      case 'failed':
      case 'disconnected':
        this.closeVideoCall();
        break;
    }
  }

  private handleSignalingStateEvent = (event: Event) => {
    switch (this.peerConnection.signalingState) {
      case 'closed':
        this.closeVideoCall();
        break;
    }
  }

  private handleTrackEvent = (event: RTCTrackEvent) => {
    this.receivedVideo.nativeElement.srcObject = event.streams[0];
  }


  private addIncomingMessageHandler(): void {
    this.webRTCService.connect(this.tokenService.retrieveUserId());
    this.webRTCService.message$.subscribe(
      msg => {
        switch (msg.type) {
          case 'offer':
            if (msg.conversationId === this.conversationId) {
              this.handleOfferMessage(msg.data);
            }
            break;
          case 'answer':
            this.handleAnswerMessage(msg.data);
            break;
          case 'hangup':
            this.handleHangupMessage(msg.data);
            break;
          case 'ice-candidate':
            this.handleICECandidateMessage(msg.data);
            break;
          default:
        }
      },
      error => console.log(error)
    );
  }

  private handleOfferMessage(data: RTCSessionDescriptionInit): void {
    if (!this.peerConnection) {
      this.createPeerConnection();
    }

    if (!this.localStream) {
      this.startLocalVideo();
    }

    this.peerConnection.setRemoteDescription(new RTCSessionDescription(data))
      .then(() => {
        this.localVideo.nativeElement.srcObject = this.localStream;
        this.localStream.getTracks().forEach(track => this.peerConnection.addTrack(track, this.localStream));
      })
      .then(() => {
        return this.peerConnection.createAnswer();
      })
      .then((answer) => {
        return this.peerConnection.setLocalDescription(answer);
      })
      .then(() => {
        this.webRTCService.sendMessage({type: 'answer', data: this.peerConnection.localDescription, conversationId: this.conversationId});
        this.inCall = true;
      })
      .catch(this.handleGetUserMediaError);
  }

  private handleAnswerMessage(data): void {
    this.peerConnection.setRemoteDescription(data);
  }

  private handleHangupMessage(data): void {
    this.pauseLocalVideo();
    this.closeVideoCall();
  }

  private handleICECandidateMessage(data): void {
    this.peerConnection.addIceCandidate(data);
  }

  hangUp(): void {
    this.pauseLocalVideo();
    this.webRTCService.sendMessage({type: 'hangup', data: '', conversationId: this.conversationId});
    this.closeVideoCall();
  }
}
