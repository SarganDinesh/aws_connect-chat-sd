// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: MIT-0

import React from "react";
import styled from "styled-components";
import PT from "prop-types";
import { RichMessageRenderer } from "../../../RichMessageComponents";
import { Button } from "connect-core";
import { MessageBody } from "../InteractiveMessage";
import { truncateStrFromCharLimit } from "../../../../../utils/helper";
import { InteractiveMessageType } from "../../../datamodel/Model";
//import image1 from './assets/images/Healthcare/image1.png';
const customerQuickReplyStyles = {
  color: "#002868",
  background: '#FFFFFF',
  border:'#002868c4'
}

//#region Styled Components
const ResponsesSection = styled.div`
  padding: ${({ theme }) => theme.spacing.base} 0;
  display: flex;
  flex-wrap: wrap;
  flex-direction: row;
  gap: ${({ theme }) => theme.spacing.mini};
  justify-content: flex-end;
`;

const QuickReplyOption = styled.div`
     display: flex;
     justify-content: space-between;
     background-color: #d5f4f9;
    padding: 10px;
    border-radius: 25px;
    text-align:center;
    max-width:50%;
  }

  /* New div inside QuickReplyOption */
  .additional-content {
    margin-top: 10px;
  }

  img {
    width: 70px;
    height: 70px;
    object-fit: cover;
    border-radius: 10px;
    margin-bottom: 10px;
  }

  button {
   padding: 4px ${({ theme }) => theme.spacing.base};
  text-align: left;
  cursor: pointer;
  border: 2px solid ${customerQuickReplyStyles.color};
  border-radius: 25px;
  white-space: pre-wrap;
  font-weight: bold;
  font-size: ${({ theme }) => theme.fontsSize.regular};
  line-height: 22px;
  font-weight: 600;
  font-style: normal;
  color: ${customerQuickReplyStyles.color};
  background: ${customerQuickReplyStyles.background};
  text-shadow: none;
  box-shadow: none;

  :hover, :focus {
    background: ${customerQuickReplyStyles.color};
    color: ${customerQuickReplyStyles.background};
    border: 2px solid ${customerQuickReplyStyles.color} !important;

    :hover {
      background: ${customerQuickReplyStyles.color};
      color: ${customerQuickReplyStyles.background};
    }
  }
`;
//#endregion Styled Components

function ReplyElement({ element, handleSelection }) {
  const title = truncateStrFromCharLimit( element.title, InteractiveMessageType.QUICK_REPLY, "replyOptionCharLimit");

  return (
  <QuickReplyOption >
     {/* Neha changes for find care images */}
     {/* The additional content under the main content */}
    <div className="additional-content">
      <div><img src="https://avatar.iran.liara.run/public" alt="welcome"/></div>
      <div><button onClick={() => handleSelection({ text: element.title })}>{title}</button></div>
    </div>
</QuickReplyOption>
  );
}

QuickReply.propTypes = {
  content: PT.object.isRequired,
  addMessage: PT.func.isRequired,
};

export default function QuickReply({ content, addMessage }) {
  // assumptions: version 1. Guaranteed title exists, at least 2 elements.
  const { title: inputTitle, elements } = content;
  const title = truncateStrFromCharLimit(inputTitle, InteractiveMessageType.QUICK_REPLY, "titleCharLimit");

  return (
    <>
      <MessageBody addChildBackgroundStyles={true} data-testid="interactive-quickreply-message-title" applySpeechBubbleCaret={true}>
        <RichMessageRenderer content={title} />
      </MessageBody>
      <ResponsesSection data-testid="interactive-quickreply-response-section" id="test">
        {elements.map((element, index) => (
          <ReplyElement
            element={element}
            handleSelection={addMessage}
            key={index}
          />
        ))}
      </ResponsesSection>
    </>
  );
}
