import React from "react";
import styled from "styled-components";
import tw from "twin.macro";
//eslint-disable-next-line
import { css } from "styled-components/macro";
import Footer from "components/footers/LandingPageFooter";
import Header from "../headers/light.js";
import { ReactComponent as SvgDecoratorBlob1 } from "../../images/svg-decorator-blob-1.svg";
import { ReactComponent as SvgDecoratorBlob2 } from "../../images/dot-pattern.svg";
import { Container, ContentWithPaddingXl } from "components/misc/Layouts";
const Text = styled.div`
  ${tw`text-lg  text-gray-800`}
  p {
    ${tw`mt-2 leading-loose`}
  }
  h1 {
    ${tw`text-3xl font-bold mt-10`}
  }
  h2 {
    ${tw`text-2xl font-bold mt-8`}
  }
  h3 {
    ${tw`text-xl font-bold mt-6`}
  }
  ul {
    ${tw`list-disc list-inside`}
    li {
      ${tw`ml-2 mb-3`}
      p {
        ${tw`mt-0 inline leading-normal`}
      }
    }
  }
`;
const TwoColumn = tw.div`flex flex-col lg:flex-row md:items-center max-w-screen-xl mx-auto py-20 md:py-24`;
const LeftColumn = tw.div`relative lg:w-6/12 lg:pr-12 flex-shrink-0 text-center lg:text-left`;
const RightColumn = tw.div`relative mt-12 lg:mt-0 flex flex-col justify-center`;

const Heading = tw.h1`font-black text-3xl md:text-5xl leading-snug max-w-3xl`;
const Paragraph = tw.p`my-5 lg:my-8 text-sm lg:text-base font-medium text-gray-600 max-w-lg mx-auto lg:mx-0`;

const Actions = tw.div`flex flex-col items-center sm:flex-row justify-center lg:justify-start mt-8`;
const PrimaryButton = tw.button`font-bold px-8 lg:px-10 py-3 rounded bg-blue-500 text-gray-100 hocus:bg-blue-700 focus:shadow-outline focus:outline-none transition duration-300`;

const IllustrationContainer = tw.div`flex justify-center md:justify-end items-center relative max-w-3xl lg:max-w-none`;

// Random Decorator Blobs (shapes that you see in background)
const DecoratorBlob1 = styled(SvgDecoratorBlob1)`
  ${tw`pointer-events-none opacity-5 absolute left-0 bottom-0 h-64 w-64 transform -translate-x-2/3  -z-10`}
`;
const DecoratorBlob2 = styled(SvgDecoratorBlob2)`
  ${tw`pointer-events-none fill-current text-primary-500 opacity-25 absolute w-32 h-32 right-0 bottom-0 transform translate-x-10 translate-y-10 -z-10`}
`;

export default ({
  heading = "Vérification de commande",
  description = "Consulter la liste complète des articles passés en commande, vérifier leurs quatités et prix afin de valider votre commande  ",
  primaryButtonText = "Panier",
  primaryButtonUrl = "/components/blocks/Hero/Panier",
  imageCss = null,
  imageDecoratorBlob = false,
}) => {
  const [user, setUser] = React.useState([]);

  React.useEffect(() => {
    setUser(JSON.parse(localStorage.getItem("user")));
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
            </Actions>
          </LeftColumn>
          <RightColumn>
            <IllustrationContainer>
              <img
                css={imageCss}
                src="https://img.freepik.com/free-vector/happy-rich-banker-celebrating-income-growth_74855-5867.jpg?size=626&ext=jpg&ga=GA1.1.40375638.1678093605&semt=ais"
                alt="Hero"
              />
              {imageDecoratorBlob && <DecoratorBlob2 />}
            </IllustrationContainer>
          </RightColumn>
        </TwoColumn>
        <ContentWithPaddingXl>
          <Text>
            <h2>Propriètaire de la Commande: </h2>
            <p>Informations de l'utilisateur qui a passé la commande:</p>
            <ul>
              <li>
                <strong>Nom: </strong> {user.lastname}
              </li>
              <li>
                <strong>Prénom: </strong> {user.firstname}
              </li>
              <li>
                <strong>E-Mail: </strong> {user.email}
              </li>
              <li>
                <strong>Numéro de téléphone: </strong> {user.tel}
              </li>
              <li>
                <strong>Entreprise: </strong> {user.entreprise}
              </li>
            </ul>
          </Text>
        </ContentWithPaddingXl>
        <DecoratorBlob1 />
      </Container>
      <Footer />
    </>
  );
};
