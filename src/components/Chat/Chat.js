// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: MIT-0

import PT from "prop-types";
import { FormattedMessage } from "react-intl";
import { CONTACT_STATUS } from "../../constants/global";
import ChatTranscriptor from "./ChatTranscriptor";
import ChatComposer from "./ChatComposer";
import ChatActionBar from "./ChatActionBar";
import React, { Component } from "react";
import {Text} from "connect-core";
import styled from "styled-components";

import renderHTML from 'react-render-html';



const ChatWrapper = styled.div`
  position: relative;
  display: flex;
  flex-direction: column;
  height: 100%;
  @media (max-width:650px) {
    position: absolute;
    top: 0;
    bottom: 0;
    right: 0;
    left: 0;
  }
`;

const ParentHeaderWrapper = styled.div`
  margin: 0;
  padding: 0;
  order: 1;
  @media (max-width: 650px) {
    position: absolute;
    left: 0;
    top: 0;
    right: 0;
  }
`;

const ChatComposerWrapper = styled.div`
  order: 2;
  margin: 0;
  padding: 0;
  display: flex;
  flex-direction: column;
  height: 340px;
  @media (max-width:640px) {
    position: absolute;
    left: 0;
    bottom: 85px;
    right: 0;
    top: ${props => props.parentHeaderWrapperHeight}px;
    min-height: auto;
  }
`;

const HeaderWrapper = styled.div`
  background: #002768;
  color: #fff;
  border-radius: 20px 20px 0 0;
  padding:7px;
  justify-content:center;
  flex-shrink: 0;
  display:flex;
  .cross-icon {
  position: absolute;
  width: 23px; /* Adjust size as needed */
  height: 23px;
  right:12px;
  cursor: pointer;
}

.cross-icon::before, .cross-icon::after {
  content: '';
  position: absolute;
  width: 65%;
  height: 2px;
  background-color: white; /* Set the color of the cross */
  top: 50%;
  left: 0;
  transform-origin: center;
}

.cross-icon::before {
  transform: rotate(45deg);
}

.cross-icon::after {
  transform: rotate(-45deg);
}
img{
  width:20px;
  height:20px;
  object-fit: cover;
  position: absolute;
  top: 9px;
  left: 42px;
}
`

const WelcomeText  = styled(Text)`
  padding-bottom: 10px;
`


const defaultHeaderConfig =  {
  isHTML: false,
  render: (endChat,endClose) => {
    
    return (
      <HeaderWrapper >
         <div><img src="https://avatar.iran.liara.run/public" alt="IMheader"></img></div>
        {/* TODO: translate below texts Neha changes for Header*/}
        <Text type={'p'} style={{textAlign:'center'}}>Optum Companion</Text>
        <button onClick={endClose}>_</button>
        <div className="cross-icon" role="button" onClick={endChat}></div>
      </HeaderWrapper>

    )
  }
};

Header.defaultProps = {
  headerConfig: {}
}

function Header({ headerConfig,endChat,endClose}){

  const config = Object.assign({}, defaultHeaderConfig, headerConfig);

  if(config.isHTML){
    return renderHTML(config.render(endChat,endClose));
  }else{
    return config.render(endChat,endClose);
  }
}

const textInputRef = React.createRef();
const HEADER_HEIGHT = 115;

export default class Chat extends Component {
  constructor(props) {
    super(props);

    this.state = {
      transcript: [],
      typingParticipants: [],
      contactStatus: CONTACT_STATUS.DISCONNECTED,
      parentHeaderWrapperHeight: HEADER_HEIGHT,
    };
    this.parentHeaderRef = React.createRef();
    this.updateTranscript = transcript => this.setState({transcript: [...transcript]});
    this.updateTypingParticipants = typingParticipants => this.setState({typingParticipants});
    this.updateContactStatus = contactStatus => this.setState({contactStatus});
    if(window.connect && window.connect.LogManager) {
      this.logger = window.connect.LogManager.getLogger({ prefix: "ChatInterface-Chat" });
    }
  }

  static propTypes = {
    chatSession: PT.object.isRequired,
    composerConfig: PT.object,
    onEnded: PT.func,
  };

  static defaultProps = {
    onEnded: () => {},
  };

  resetChatHeight() {
    this.setState({
      parentHeaderWrapperHeight: this.parentHeaderRef && this.parentHeaderRef.current ? this.parentHeaderRef.current.clientHeight : HEADER_HEIGHT,
    });
  }

  componentDidMount() {
    this.init(this.props.chatSession);
    this.resetChatHeight();
    if (typeof this.props.changeLanguage === "function") {
      this.props.changeLanguage(this.props.language);
    }
    this.logger && this.logger.info("Component mounted.")
  }

  componentDidUpdate(prevProps) {
    if (prevProps.chatSession !== this.props.chatSession) {
      this.cleanUp(prevProps.chatSession);
      this.init(this.props.chatSession);
    }
    if (prevProps.language !== this.props.language &&
        typeof this.props.changeLanguage === "function") {
      this.props.changeLanguage(this.props.language);
    }
  }

  componentWillUnmount() {
    this.cleanUp(this.props.chatSession);
  }

  init(chatSession) {
    this.setState({contactStatus: chatSession.contactStatus});
    chatSession.on('transcript-changed', this.updateTranscript);
    chatSession.on('typing-participants-changed', this.updateTypingParticipants);
    chatSession.on('contact-status-changed', this.updateContactStatus);
  }

  cleanUp(chatSession) {
    chatSession.off('transcript-changed', this.updateTranscript);
    chatSession.off('typing-participants-changed', this.updateTypingParticipants);
    chatSession.off('contact-status-changed', this.updateContactStatus);
  }

  endChat() {
    this.props.chatSession.endChat();
    this.props.onEnded();
  }

  closeChat() {
    this.props.chatSession.closeChat();
    this.props.onEnded();
  }
/*
  Note: For Mobile layout: divided into 3 sections
  1. Header - Positon: absolute; top: 0, left: 0, right: 0 - height is dynamic!
  2. MainContent - Position: absolute; top: {dynamicHeight}, left: 0, right: 0, bottom: {fixedFooterHeight: 85px}
  3. Footer - position: absolute; bottom: 0, right: 0, left: 0
  -- this prevents overlay from overflowing in mobile browser. 
*/
  render() {
    const {chatSession, headerConfig, transcriptConfig, composerConfig, footerConfig } = this.props;
    console.log('MESSAGES', this.state.transcript);

    return (
      <ChatWrapper data-testid="amazon-connect-chat-wrapper">
        {(this.state.contactStatus === CONTACT_STATUS.CONNECTED ||
          this.state.contactStatus === CONTACT_STATUS.CONNECTING || this.state.contactStatus === CONTACT_STATUS.ENDED) && 
          <ParentHeaderWrapper ref={this.parentHeaderRef}><Header headerConfig={headerConfig} endChat={()=>{this.endChat()}} endClose={()=>{this.endClose() }}/></ParentHeaderWrapper>
        }
        <ChatComposerWrapper  parentHeaderWrapperHeight={this.state.parentHeaderWrapperHeight}>
          <ChatTranscriptor
            loadPreviousTranscript={() => chatSession.loadPreviousTranscript()}
            addMessage={(data) => chatSession.addOutgoingMessage(data)}
            downloadAttachment={(attachmentId) => chatSession.downloadAttachment(attachmentId)}
            transcript={this.state.transcript}
            typingParticipants={this.state.typingParticipants}
            contactStatus={this.state.contactStatus}
            contactId={chatSession.contactId}
            transcriptConfig={transcriptConfig}
            textInputRef={textInputRef}
            sendReadReceipt={(...inputParams) => chatSession.sendReadReceipt(...inputParams)}
          />
          <ChatComposer
            contactStatus={this.state.contactStatus}
            contactId={chatSession.contactId}
            addMessage={(contactId, data) => chatSession.addOutgoingMessage(data)}
            addAttachment={(contactId, attachment) => chatSession.addOutgoingAttachment(attachment)}
            onTyping={() => chatSession.sendTypingEvent()}
            composerConfig={composerConfig}
            textInputRef={textInputRef}
          />
        </ChatComposerWrapper>
        {<ChatActionBar
          onEndChat={() => this.endChat()}
          onClose ={() => this.closeChat()}
          contactStatus={this.state.contactStatus}
          footerConfig={footerConfig}
        />
        }
      </ChatWrapper>
    );
  }
}
