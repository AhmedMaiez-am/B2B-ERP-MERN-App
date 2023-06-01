import React, { useState } from "react";
import styled from "styled-components";
import tw from "twin.macro";
//eslint-disable-next-line
import { css } from "styled-components/macro";

import PanierCols from "components/faqs/PanierCols.js";
import Footer from "components/footers/MainFooter.js";
import Header from "../headers/light.js";
import LocalMallOutlinedIcon from "@mui/icons-material/LocalMallOutlined";
import { SectionHeading as HeadingTitle } from "../misc/Headings.js";
import ReactModalAdapter from "../../helpers/ReactModalAdapter.js";

import { ReactComponent as CloseIcon } from "feather-icons/dist/icons/x.svg";
import { ReactComponent as SvgDecoratorBlob1 } from "../../images/svg-decorator-blob-1.svg";
import { ReactComponent as SvgDecoratorBlob2 } from "../../images/dot-pattern.svg";
import DesignIllustration from "../../images/design-illustration.svg";

const Container1 = tw.div`relative`;

const SingleColumn = tw.div`max-w-screen-xl mx-auto`;

const HeadingInfoContainer = tw.div`flex flex-col items-center`;

const HeadingDescription = tw.p`mt-4 font-medium text-gray-600 text-center max-w-sm`;
const Container = tw.div`relative`;
const TwoColumn = tw.div`flex flex-col lg:flex-row md:items-center max-w-screen-xl mx-auto py-20 md:py-24`;
const LeftColumn = tw.div`relative lg:w-6/12 lg:pr-12 flex-shrink-0 text-center lg:text-left`;
const RightColumn = tw.div`relative mt-12 lg:mt-0 flex flex-col justify-center`;

const Heading = tw.h1`font-black text-3xl md:text-5xl leading-snug max-w-3xl`;
const Paragraph = tw.p`my-5 lg:my-8 text-sm lg:text-base font-medium text-gray-600 max-w-lg mx-auto lg:mx-0`;

const Actions = tw.div`flex flex-col items-center sm:flex-row justify-center lg:justify-start mt-8`;
const PrimaryButton = tw.button`font-bold px-8 lg:px-10 py-3 rounded bg-blue-500 text-gray-100 hocus:bg-blue-700 focus:shadow-outline focus:outline-none transition duration-300`;
const PrimaryButton1 = tw.button`font-bold px-8 lg:px-10 py-3 rounded bg-yellow-500 text-gray-100 hocus:bg-yellow-700 focus:shadow-outline focus:outline-none transition duration-300`;
const WatchVideoButton = styled.button`
  ${tw`mt-4 sm:mt-0 sm:ml-8 flex items-center text-secondary-300 transition duration-300 hocus:text-blue-400 focus:outline-none`}
  .playIcon {
    ${tw`stroke-1 w-12 h-12`}
  }
  .playText {
    ${tw`ml-2 font-medium`}
  }
`;

const IllustrationContainer = tw.div`flex justify-center md:justify-end items-center relative max-w-3xl lg:max-w-none`;

// Random Decorator Blobs (shapes that you see in background)
const DecoratorBlob1 = styled(SvgDecoratorBlob1)`
  ${tw`pointer-events-none opacity-5 absolute left-0 bottom-0 h-64 w-64 transform -translate-x-2/3  -z-10`}
`;
const DecoratorBlob2 = styled(SvgDecoratorBlob2)`
  ${tw`pointer-events-none fill-current text-primary-500 opacity-25 absolute w-32 h-32 right-0 bottom-0 transform translate-x-10 translate-y-10 -z-10`}
`;

const StyledModal = styled(ReactModalAdapter)`
  &.mainHeroModal__overlay {
    ${tw`fixed inset-0 z-50 bg-transparent backdrop-blur-md`}
    backdrop-filter: blur(8px); /* Standard syntax */
    --webkit-backdrop-filter: blur(8px); /* Vendor-specific syntax */
  }
  &.mainHeroModal__content {
    ${tw`xl:mx-auto m-4 sm:m-16 max-w-screen-xl absolute inset-0 flex justify-center items-center rounded-lg outline-none`}
    background-color: rgba(255, 255, 255, 0.8); /* Add transparency to the background */
  }
  .content {
    ${tw`w-full lg:p-16 overflow-y-auto max-h-[80vh]`}
  }
`;

const StyledModal1 = styled(ReactModalAdapter)`
  &.mainHeroModal__overlay {
    ${tw`fixed inset-0 z-50 bg-transparent backdrop-blur-md`}
    backdrop-filter: blur(8px); /* Standard syntax */
    --webkit-backdrop-filter: blur(8px); /* Vendor-specific syntax */
  }
  &.mainHeroModal__content {
    ${tw`xl:mx-auto m-4 sm:m-16 max-w-screen-xl absolute inset-0 flex justify-center items-center rounded-lg outline-none`}
    background-color: rgba(255, 255, 255, 0.8); /* Add transparency to the background */
  }
  .content {
    ${tw`w-full lg:p-16 overflow-y-auto max-h-[80vh]`}
  }
`;

const CloseModalButton = tw.button`absolute top-0 right-0 mt-8 mr-8 hocus:text-primary-500`;

export default ({
  heading = "Votre panier d'articles",
  description = "Consulter votre panier afin de vérifier les informations nécessaires pour accéder à finaliser votre commande, si vous voulez ajouter d'autres articles : ",
  primaryButtonText = "Articles",
  primaryButtonUrl = "/components/blocks/Hero/ListeArticles",
  watchVideoButtonText = "Consulter Panier",
  imageSrc = DesignIllustration,
  imageCss = null,
  imageDecoratorBlob = false,
}) => {
  const [modalIsOpen, setModalIsOpen] = useState(false);

  const toggleModal = () => setModalIsOpen(!modalIsOpen);
  const [data, setData] = React.useState([]);

  //Retrieve cart from local Storage
  React.useEffect(() => {
    const panier = JSON.parse(localStorage.getItem("panier"));
    setData(panier || []);
  }, []);

  return (
    <>
      <Header />
      <Container>
        <TwoColumn>
          <LeftColumn>
            <Heading>{heading}</Heading>
            <Paragraph>{description}</Paragraph>
            <Actions>
              <PrimaryButton
                style={{ borderRadius: "50px" }}
                as="a"
                href={primaryButtonUrl}
              >
                {primaryButtonText}
              </PrimaryButton>
              <WatchVideoButton onClick={toggleModal}>
                <span className="playIconContainer">
                  <LocalMallOutlinedIcon className="playIcon" />
                </span>
                <span className="playText">{watchVideoButtonText}</span>
              </WatchVideoButton>
            </Actions>
          </LeftColumn>
          <RightColumn>
            <IllustrationContainer>
              <img css={imageCss} src={imageSrc} alt="Hero" />
              {imageDecoratorBlob && <DecoratorBlob2 />}
            </IllustrationContainer>
          </RightColumn>
        </TwoColumn>
        <DecoratorBlob1 />
        <div>
          {data.length > 0 ? (
            <>
              <StyledModal
                closeTimeoutMS={300}
                className="mainHeroModal"
                isOpen={modalIsOpen}
                onRequestClose={toggleModal}
                shouldCloseOnOverlayClick={true}
              >
                <CloseModalButton onClick={toggleModal}>
                  <CloseIcon tw="w-6 h-6" />
                </CloseModalButton>
                <div className="content">
                  <Container1>
                    <SingleColumn>
                      <HeadingInfoContainer>
                        <HeadingTitle>Panier</HeadingTitle>
                        <HeadingDescription>
                          Vous trouver ici les informations relatives aux
                          articles que vous avez ajouté dans votre panier
                        </HeadingDescription>
                      </HeadingInfoContainer>
                    </SingleColumn>
                    <PanierCols />
                  </Container1>
                </div>
              </StyledModal>
            </>
          ) : (
            <>
              <StyledModal1
                closeTimeoutMS={300}
                className="mainHeroModal"
                isOpen={modalIsOpen}
                onRequestClose={toggleModal}
                shouldCloseOnOverlayClick={true}
              >
                <CloseModalButton onClick={toggleModal}>
                  <CloseIcon tw="w-6 h-6" />
                </CloseModalButton>
                <div className="content">
                  <Container1>
                    <SingleColumn>
                      <HeadingInfoContainer>
                        <HeadingTitle>Panier Vide</HeadingTitle>
                        <HeadingDescription>
                          Votre panier ne contient pas d'articles, veuillez
                          sélectionner des articles de la liste des articles
                          afin de visualiser leurs détails et confirmer votre
                          choix.
                        </HeadingDescription>
                        <br />
                        <br />
                        <PrimaryButton1
                          style={{ borderRadius: "50px" }}
                          as="a"
                          href={primaryButtonUrl}
                        >
                          {primaryButtonText}
                        </PrimaryButton1>
                      </HeadingInfoContainer>
                    </SingleColumn>
                  </Container1>
                </div>
              </StyledModal1>
            </>
          )}
        </div>
      </Container>
      <br />
      <br />
      <br />
      <br />
      <br />
      <Footer />
    </>
  );
};
