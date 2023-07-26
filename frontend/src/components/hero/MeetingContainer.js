import React from "react";
import styled from "styled-components";
import tw from "twin.macro";
//eslint-disable-next-line
import { css } from "styled-components/macro";
import Meeting from "./VideoCall";
import Footer from "components/footers/MainFooter.js";
import Header from "../headers/light.js";
const ChatHeading = tw.h1`font-black text-3xl md:text-5xl leading-snug max-w-3xl`;
const ChatHeadingContainer = tw.div`flex flex-col items-center my-16`;
const Paragraph = tw.p`mt-4 font-medium text-gray-600 text-center max-w-sm`;
const MeetingContainer = () => {
  return (
    <>
      <Header />
      <ChatHeadingContainer>
        <ChatHeading>Visioconférence</ChatHeading>
        <Paragraph>
          Bienvenue dans votre salle de visioconférence en ligne, vous pouvez
          activer/désactiver le microphone et la caméra ainsi que partagez votre
          écran en cas de besoins. Vous pouvez inviter d'autre participants avec
          le code d'invitation
        </Paragraph>
      </ChatHeadingContainer>
      <div className="meeting-container">
        <Meeting />
      </div>
      <Footer />
    </>
  );
};

export default MeetingContainer;
