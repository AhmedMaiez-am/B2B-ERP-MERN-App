import React from "react";
import styled from "styled-components";
import tw from "twin.macro";
//eslint-disable-next-line
import { css } from "styled-components/macro";
import { useHistory } from "react-router-dom";
import { Button } from "@material-ui/core";
import Footer from "components/footers/MainFooter.js";
import Header from "../headers/light.js";
import ChatsPage from "./ChatsPage.js";
import { ReactComponent as SvgDecoratorBlob1 } from "../../images/svg-decorator-blob-1.svg";
import { ReactComponent as SvgDecoratorBlob2 } from "../../images/dot-pattern.svg";
const Container = tw.div`relative`;
const TwoColumn = tw.div`flex flex-col lg:flex-row md:items-center max-w-screen-xl mx-auto py-20 md:py-24`;
const LeftColumn = tw.div`relative lg:w-6/12 lg:pr-12 flex-shrink-0 text-center lg:text-left`;
const RightColumn = tw.div`relative mt-12 lg:mt-0 flex flex-col justify-center`;

const Heading = tw.h1`font-black text-3xl md:text-5xl leading-snug max-w-3xl`;
const ChatHeading = tw.h1`font-black text-3xl md:text-5xl leading-snug max-w-3xl`;
const ChatHeadingContainer = tw.div`flex flex-col items-center`;
const Paragraph = tw.p` lg:my-8 text-sm lg:text-base font-medium text-gray-600 max-w-lg mx-auto lg:mx-0`;

const IllustrationContainer = tw.div`flex justify-center md:justify-end items-center relative max-w-3xl lg:max-w-none`;

// Random Decorator Blobs (shapes that you see in background)
const DecoratorBlob1 = styled(SvgDecoratorBlob1)`
  ${tw`pointer-events-none opacity-5 absolute left-0 bottom-0 h-64 w-64 transform -translate-x-2/3  -z-10`}
`;
const DecoratorBlob2 = styled(SvgDecoratorBlob2)`
  ${tw`pointer-events-none fill-current text-primary-500 opacity-25 absolute w-32 h-32 right-0 bottom-0 transform translate-x-10 translate-y-10 -z-10`}
`;

export default ({
  heading = "Discussions et visioconférences",
  description = "Avez besoin d'aide ? Vous pouvez contacter un responsable et discuter avec lui en temps réel.",
  imageCss = null,
  imageDecoratorBlob = false,
}) => {
  const history = useHistory();
  const handleCreateMeeting = () => {
    const callId = "sbs-" + Math.random().toString(16).substring(2);
    localStorage.setItem("callId", callId);
    history.push("/components/Meeting");
  };

  const [joinInput, setJoinInput] = React.useState("");
  const [joinError, setJoinError] = React.useState(false);

  const handleJoinMeeting = () => {
    if (joinInput === localStorage.getItem("callId")) {
      // Call Id matches, join the video call
      const callId = localStorage.getItem("callId");
      window.location.href = `/components/Meeting#${callId}`;
    } else {
      setJoinError(true);
    }
  };
  return (
    <>
      <Header />
      <Container>
        <TwoColumn>
          <LeftColumn>
            <Heading>{heading}</Heading>
            <Paragraph>
              {description} <br />
              <br />
              Vous pouvez organiser une visioconférence et l'inviter pour vous
              rejoindre:
            </Paragraph>
            <Button
              variant="outlined"
              style={{
                borderRadius: "50px",
                display: "flex",
                alignItems: "center",
                padding: "2px 40px",
                borderColor: "#15b010",
                borderWidth: "2px",
                whiteSpace: "nowrap",
              }}
              onClick={() => handleCreateMeeting()}
            >
              <p style={{ color: "#15b010" }}>
                <strong>Créer visioconférence</strong>
              </p>
            </Button>
            <div>
              <br />
              <Paragraph>
                Si vous disposer d'un code d'invitation d'une visioconférence,
                vous pouvez la rejoindre par ici :
              </Paragraph>
              <input
                style={{
                  padding: "10px",
                  borderRadius: "5px",
                  border: "2px solid #8f34eb",
                  fontSize: "16px",
                  color: "#333",
                  outline: "none",
                  width: "100%",
                  maxWidth: "300px",
                  margin: "10px auto",
                }}
                type="text"
                value={joinInput}
                onChange={(e) => {
                  setJoinInput(e.target.value);
                  setJoinError(false);
                }}
                placeholder="Entrer le code d'invitation"
              />
              <Button
                variant="outlined"
                style={{
                  borderRadius: "50px",
                  display: "flex",
                  alignItems: "center",
                  padding: "2px 40px",
                  borderColor: "#8f34eb",
                  borderWidth: "2px",
                  whiteSpace: "nowrap",
                }}
                onClick={handleJoinMeeting}
              >
                <p style={{ color: "#8f34eb" }}>
                  <strong>Rejoindre</strong>
                </p>
              </Button>
              {joinError && (
                <p style={{ color: "red" }}>Code Invitation Invalide</p>
              )}
            </div>
          </LeftColumn>
          <RightColumn>
            <IllustrationContainer>
              <img
                css={imageCss}
                src={
                  "https://unblast.com/wp-content/uploads/2020/10/Live-Chat-Vector-Illustration.jpg"
                }
                alt="Hero"
              />
              {imageDecoratorBlob && <DecoratorBlob2 />}
            </IllustrationContainer>
          </RightColumn>
        </TwoColumn>
        <DecoratorBlob1 />
      </Container>
      <ChatHeadingContainer>
        <ChatHeading>Discussion Instantannée</ChatHeading>
      </ChatHeadingContainer>
      <ChatsPage />
      <br />
      <br />
      <br />
      <br />
      <br />
      <Footer />
    </>
  );
};
