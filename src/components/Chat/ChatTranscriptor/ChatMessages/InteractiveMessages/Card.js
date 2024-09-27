import React, { Component } from "react";
import styled from "styled-components";
import PT from "prop-types";
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

const CardDescription = styled.p`
  color: #333;
  margin-bottom: ${({ theme }) => theme.spacing.small};
`;

const CardLink = styled.a`
  color: ${cardStyles.color};
  text-decoration: none;
  &:hover {
    text-decoration: underline;
  }
`;
//#endregion Styled Components

class Card extends Component {
    render() {
        const { cardContent } = this.props;
        const { elements } = cardContent;

        return (
            <div>
                {elements.map((element, index) => (
                    <CardContainer key={index}>
                        <CardTitle>{element.text}</CardTitle>
                        <CardDescription>{element.description}</CardDescription>
                        <CardLink href={element.action.link.url} target={element.action.link.target}>
                            {element.action.link.text}
                        </CardLink>
                    </CardContainer>
                ))}
            </div>
        );
    }
}

Card.propTypes = {
    cardContent: PT.shape({
        elements: PT.arrayOf(
            PT.shape({
                type: PT.string.isRequired,
                text: PT.string.isRequired,
                description: PT.string.isRequired,
                action: PT.shape({
                    type: PT.string.isRequired,
                    actionType: PT.string.isRequired,
                    link: PT.shape({
                        type: PT.string.isRequired,
                        text: PT.string.isRequired,
                        url: PT.string.isRequired,
                        target: PT.string.isRequired,
                    }).isRequired,
                }).isRequired,
            })
        ).isRequired,
    }).isRequired,
};

export default Card;
