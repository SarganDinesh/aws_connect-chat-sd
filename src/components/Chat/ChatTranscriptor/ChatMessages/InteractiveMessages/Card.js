import React from "react";
import styled from "styled-components";
import PT from "prop-types";
import { RichMessageRenderer } from "../../../RichMessageComponents";
import { truncateStrFromCharLimit } from "../../../../../utils/helper";
import { InteractiveMessageType } from "../../../datamodel/Model";

const cardStyles = {
    color: "#002868",
    background: '#FFFFFF',
    border: '#002868c4'
}

//#region Styled Components
const CardContainer = styled.div`
  padding: ${({ theme }) => theme.spacing.base};
  background-color: #f9f9f9;
  border: 1px solid ${cardStyles.border};
  border-radius: 10px;
  margin-bottom: ${({ theme }) => theme.spacing.base};
`;

const CardTitle = styled.h2`
  color: ${cardStyles.color};
  margin-bottom: ${({ theme }) => theme.spacing.small};
`;

const OptionContainer = styled.div`
  margin-bottom: ${({ theme }) => theme.spacing.base};
  padding: ${({ theme }) => theme.spacing.small};
  background-color: #e0f7fa;
  border: 1px solid ${cardStyles.border};
  border-radius: 5px;
`;

const OptionHeading = styled.h3`
  color: ${cardStyles.color};
  margin-bottom: ${({ theme }) => theme.spacing.mini};
`;

const OptionContent = styled.div`
  color: #333;
`;
//#endregion Styled Components

function OptionElement({ option }) {
    return (
        <OptionContainer>
            <OptionHeading>{option.heading}</OptionHeading>
            <OptionContent>{option.content}</OptionContent>
        </OptionContainer>
    );
}

OptionElement.propTypes = {
    option: PT.shape({
        heading: PT.string.isRequired,
        content: PT.string.isRequired,
    }).isRequired,
};

export default function Card({ content }) {
    const { title: inputTitle, options } = content;
    const title = truncateStrFromCharLimit(inputTitle, InteractiveMessageType.CARD, "titleCharLimit");

    return (
        <CardContainer>
            <CardTitle>{title}</CardTitle>
            {options.map((option, index) => (
                <OptionElement
                    option={option}
                    key={index}
                />
            ))}
        </CardContainer>
    );
}

Card.propTypes = {
    content: PT.shape({
        title: PT.string.isRequired,
        options: PT.arrayOf(
            PT.shape({
                heading: PT.string.isRequired,
                content: PT.string.isRequired,
            })
        ).isRequired,
    }).isRequired,
};
