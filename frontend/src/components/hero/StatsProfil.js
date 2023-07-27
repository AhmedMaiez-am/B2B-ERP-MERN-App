import React from "react";
import tw from "twin.macro";
import styled from "styled-components";
import { css } from "styled-components/macro"; //eslint-disable-line
import {
  SectionHeading,
  Subheading as SubheadingBase,
} from "components/misc/Headings.js";
import { PrimaryButton as PrimaryButtonBase } from "components/misc/Buttons.js";
import StatsIllustrationSrc from "images/stats-illustration.svg";
import { ReactComponent as SvgDotPattern } from "images/dot-pattern.svg";
import axios from "axios";
import { PieChart, pieArcClasses } from "@mui/x-charts/PieChart";

const Container = tw.div`relative`;
const TwoColumn = tw.div`flex flex-col md:flex-row justify-between max-w-screen-xl mx-auto py-20 md:py-24`;
const Column = tw.div`w-full max-w-md mx-auto md:max-w-none md:mx-0`;
const ImageColumn = tw(Column)`md:w-5/12 flex-shrink-0 h-80 md:h-auto relative`;
const TextColumn = styled(Column)((props) => [
  tw`md:w-7/12 mt-16 md:mt-0`,
  props.textOnLeft
    ? tw`md:mr-12 lg:mr-16 md:order-first`
    : tw`md:ml-12 lg:ml-16 md:order-last`,
]);

const Image = styled.div((props) => [
  `background-image: url("${props.imageSrc}");`,
  tw`rounded bg-contain bg-no-repeat bg-center h-full`,
]);
const TextContent = tw.div`lg:py-8 text-center md:text-left`;

const Subheading = tw(SubheadingBase)`text-center md:text-left`;
const Heading = tw(
  SectionHeading
)`mt-4 font-black text-left text-3xl sm:text-4xl lg:text-5xl text-center md:text-left leading-tight`;
const Description = tw.p`mt-4 text-center md:text-left text-sm md:text-base lg:text-lg font-medium leading-relaxed text-secondary-100`;

const Statistics = tw.div`flex flex-col items-center sm:block text-center md:text-left mt-4`;
const Statistic = tw.div`text-left sm:inline-block sm:mr-12 last:mr-0 mt-4`;
const Value = tw.div`font-bold text-lg sm:text-xl lg:text-2xl text-secondary-500 tracking-wide`;
const Key = tw.div`font-medium text-primary-700`;

const PrimaryButton = tw(
  PrimaryButtonBase
)`mt-8 md:mt-10 text-sm inline-block mx-auto md:mx-0`;

const DecoratorBlob = styled(SvgDotPattern)((props) => [
  tw`w-20 h-20 absolute right-0 bottom-0 transform translate-x-1/2 translate-y-1/2 fill-current text-primary-500 -z-10`,
]);

export default ({
  subheading = "Statistiques",
  heading = (
    <>
      Statistiques <wbr /> sur vos{" "}
      <span tw="text-primary-500">transactions.</span>
    </>
  ),
  description = "Vous trouvez ici les nombres relatives aux diffèrents transactions et services que vous avez réalisé dans le plateforme tels que le nombre des commandes de ventes, les factures générés ainsi que les avoirs réalisé.",
  primaryButtonText = "Commande Plus Récente",
  primaryButtonUrl = "/components/Commande",
  imageSrc = StatsIllustrationSrc,
  imageCss = null,
  imageContainerCss = null,
  imageDecoratorBlob = false,
  imageDecoratorBlobCss = null,
  imageInsideDiv = true,
  textOnLeft = false,
}) => {
  const [commande, setCommande] = React.useState(null);
  const [facture, setFacture] = React.useState(null);
  const [avoir, setAvoir] = React.useState(null);
  const [user, setUser] = React.useState([]);
  const getCurrentUser = () => {
    const userJson = sessionStorage.getItem("user");
    if (userJson) {
      return JSON.parse(userJson);
    }
    return null; // No active user
  };

  const connectedUser = getCurrentUser();
  React.useEffect(() => {
    setUser(connectedUser);
  }, []);

  // Get Commandes Count
  React.useEffect(() => {
    const fetchCommandeData = async () => {
      try {
        const user = getCurrentUser();
        const response = await axios.get("/stats/commandes", {
          params: { No: user.no },
        });
        const commandesCount = response.data.commandesCount; // Get the 'commandesCount' value from the response
        setCommande(commandesCount);
      } catch (error) {
        console.error("Error:", error);
      }
    };

    fetchCommandeData();
  }, []);

  //Get Facture Count
  React.useEffect(() => {
    const fetchFactureData = async () => {
      try {
        const user = getCurrentUser();
        const response = await axios.get("/stats/factures", {
          params: { No: user.name },
        });
        const facturesCount = response.data.facturesCount; // Get the 'facturesCount' value from the response
        setFacture(facturesCount);
      } catch (error) {
        console.error("Error:", error);
      }
    };

    fetchFactureData();
  }, []);

  //Get Avoir Count
  React.useEffect(() => {
    const fetchAvoirData = async () => {
      try {
        const user = getCurrentUser();
        const response = await axios.get("/stats/avoirs", {
          params: { No: user.name },
        });
        const avoirsCount = response.data.avoirsCount; // Get the 'avoirsCount' value from the response
        setAvoir(avoirsCount);
      } catch (error) {
        console.error("Error:", error);
      }
    };

    fetchAvoirData();
  }, []);

  const data = [
    { id: 0, value: commande !== null ? commande : 0, label: "Commandes" },
    { id: 1, value: facture !== null ? facture : 0, label: "Factures" },
    { id: 2, value: avoir !== null ? avoir : 0, label: "Avoirs" },
  ];

  return (
    <Container>
      <TwoColumn css={!imageInsideDiv && tw`md:items-center`}>
        <ImageColumn css={imageContainerCss}>
          {imageInsideDiv ? (
            <Image imageSrc={imageSrc} css={imageCss} />
          ) : (
            <img src={imageSrc} css={imageCss} alt="" />
          )}
          {imageDecoratorBlob && <DecoratorBlob css={imageDecoratorBlobCss} />}
        </ImageColumn>
        <TextColumn textOnLeft={textOnLeft}>
          <TextContent>
            {subheading && <Subheading>{subheading}</Subheading>}
            <Heading>{heading}</Heading>
            <Description>{description}</Description>
            <Statistics>
              <PieChart
                series={[
                  {
                    data,
                    highlightScope: { faded: "global", highlighted: "item" },
                    faded: { innerRadius: 30, additionalRadius: -30 },
                  },
                ]}
                sx={{
                  [`& .${pieArcClasses.faded}`]: {
                    fill: "gray",
                  },
                }}
                height={200}
              />
            </Statistics>
            <Description>Vous pouvez consulter et vérifier les détails de votre commande la plus récente:</Description>
            <PrimaryButton
              as="a"
              href={primaryButtonUrl}
              style={{ borderRadius: "50px" }}
            >
              {primaryButtonText}
            </PrimaryButton>
          </TextContent>
        </TextColumn>
      </TwoColumn>
    </Container>
  );
};
