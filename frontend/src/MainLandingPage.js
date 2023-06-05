import React, { useState, useEffect } from "react";
import AnchorLink from "react-anchor-link-smooth-scroll";
import { Rnd } from "react-rnd";
import Services from "components/features/LandingPageFeatures";
import Footer from "components/footers/LandingPageFooter";
import { components } from "ComponentRenderer.js";
import AnimationRevealPage from "helpers/AnimationRevealPage.js";
import { Container, Content2Xl } from "components/misc/Layouts";
import tw from "twin.macro";
import styled from "styled-components";
import { css } from "styled-components/macro";
import { LogoLink } from "components/headers/light.js";
import { SectionHeading as HeadingBase } from "components/misc/Headings";
import { SectionDescription as DescriptionBase } from "components/misc/Typography";

import { ReactComponent as CheckboxIcon } from "feather-icons/dist/icons/check-circle.svg";
import { ReactComponent as HandleIcon } from "images/handle-icon.svg";
import { ReactComponent as ArrowRightIcon } from "images/arrow-right-3-icon.svg";

import heroScreenshotImageSrc from "images/demo/pattern_react.png";
import logo from "images/logo.png";
import useInView from "@owaiswiz/use-in-view";

/* Hero */


const Row = tw.div`flex`;
const NavRow = tw(Row)`flex flex-col lg:flex-row items-center justify-between`;
const NavLink = tw.a`mt-4 lg:mt-0 transition duration-300 font-medium pb-1 border-b-2 mr-12 text-gray-700 border-gray-400 hocus:border-gray-700`;
const PrimaryNavLink = tw(
  NavLink
)`text-gray-100 bg-blue-500 px-6 py-3 border-none rounded hocus:bg-blue-900 focus:shadow-outline mt-6 md:mt-4 lg:mt-0`;
const HeroRow = tw(
  Row
)`flex-col lg:flex-row justify-between items-center pt-8 lg:pt-12 pb-16 max-w-screen-2xl mx-auto flex-wrap`;

const Column = tw.div`flex-1`;

const TextColumn = tw(
  Column
)`mx-auto lg:mr-0 max-w-2xl lg:max-w-xl xl:max-w-2xl flex-shrink-0`;
const Heading = tw(
  HeadingBase
)`text-center lg:text-left text-blue-900 leading-snug`;
const Description = tw(
  DescriptionBase
)`mt-4 text-center lg:text-left lg:text-base text-gray-700 max-w-lg mx-auto lg:mx-0`;
const Actions = tw.div`flex flex-col sm:flex-row justify-center lg:justify-start`;
const ActionButton = tw(
  AnchorLink
)`px-8 py-3 font-bold rounded bg-blue-500 text-gray-100 hocus:bg-blue-700 hocus:text-gray-200 focus:shadow-outline focus:outline-none transition duration-300 mt-12 inline-block tracking-wide text-center px-10 py-4 font-semibold tracking-normal`;
const PrimaryButton = tw(ActionButton)``;
const SecondaryButton = tw(
  ActionButton
)`mt-6 sm:mt-12 sm:ml-8 bg-gray-300 text-gray-800 hocus:bg-gray-400 hocus:text-gray-900`;
const FeatureList = tw.ul`mt-6 leading-loose flex flex-wrap max-w-xl mx-auto lg:mx-0`;
const Feature = tw.li`mt-2 flex items-center flex-shrink-0 w-full sm:w-1/2 justify-center lg:justify-start`;
const FeatureIcon = tw(CheckboxIcon)`w-5 h-5 text-blue-500`;
const FeatureText = tw.p`ml-2 font-medium text-gray-700`;
const ImageColumn = tw(Column)`mx-auto lg:mr-0 relative mt-16 lg:mt-0 lg:ml-8`;
const ImageContainer = tw.div``;
const Image = tw.img`max-w-full rounded-t sm:rounded`;

const ComponentsContainer = tw.div`mt-24`;
const ComponentsType = tw.h3`text-4xl font-black text-primary-500 border-b-4 border-primary-500 inline-block`;
const Components = tw.div``;
const Component = tw.div`mt-12 border rounded-lg bg-white`;
const ComponentHeading = tw.div`px-8 py-5 border-b flex flex-col sm:flex-row justify-between items-center`;
const ComponentName = tw.h6`text-lg`;
const ComponentPreviewLink = tw.a`mt-4 sm:mt-0 text-primary-500 hocus:text-primary-900 transition duration-300 font-semibold flex items-center`;
const ComponentContent = tw.div`flex justify-between overflow-hidden rounded-b-lg bg-gray-600 relative`;
const ResizableBox = styled(Rnd)`
  ${tw`relative! bg-white pr-4`}
  .resizeHandleWrapper > div {
    ${tw`w-4! right-0!`}
  }
`;
const ResizeHandleButton = tw.button`cursor-col-resize focus:outline-none w-4 border-l bg-gray-100 absolute right-0 inset-y-0`;

export default ({
  features = null,
  primaryButtonUrl = "#services",
  primaryButtonText = "Services",
  secondaryButtonUrl = components.innerPages.LoginPage.url,
  secondaryButtonText = "Démarrer",
  buttonRoundedCss = "",
  heading = "Votre portail en ligne pour la gestion de vos stocks",
  description = "Notre portail vous offre la possibilité de gérer vos ressources, en consultant votre stocks, passer des commandes et suivre leurs états, générer vos bandes de livraison et factures ainsi que les retours de produits que vous affectuer suivi par leurs avoirs relatifs à chaque fin du mois.",
}) => {
  /*
   * Using gtag like this because we only want to use Google Analytics when Main Landing Page is rendered
   * Remove this part and the the gtag script inside public/index.html if you dont need google analytics
   */
  window.gtag("js", new Date());
  window.gtag("config", "UA-45799926-9");

  features = features || [
    `Consulter vos stocks`,
    `Passer vos commandes`,
    `Générer vos factures`,
    "Générer vos bandes de livraison",
    "Gérer les droits d'accés",
    "Gérer vos retours et avoirs",
  ];

  return (
    <AnimationRevealPage>
      <Container tw="bg-gray-100 -mx-8 -mt-8 pt-8 px-8">
        <Content2Xl>
          <NavRow>
            <LogoLink href="/">
              <img src={logo} alt="" />
              Smart Business Solutions
            </LogoLink>
            <div tw="flex flex-wrap justify-center lg:justify-end items-center -mr-12">
              <NavLink href="#services">Services</NavLink>
              <NavLink target="_blank" href="https://smart-bs.com.tn">
                Smart-BS
              </NavLink>
              <NavLink target="_blank" href="https://twitter.com/owaiswiz">
                Administration
              </NavLink>
              <div tw="md:hidden flex-100 h-0"></div>
              <PrimaryNavLink
                style={{ borderRadius: "50px" }}
                href="/components/innerPages/LoginPage"
              >
                Se Connecter
              </PrimaryNavLink>
            </div>
          </NavRow>
          <HeroRow>
            <TextColumn>
              <Heading as="h1">{heading}</Heading>
              <Description>{description}</Description>
              <FeatureList>
                {features.map((feature, index) => (
                  <Feature key={index}>
                    <FeatureIcon />
                    <FeatureText>{feature}</FeatureText>
                  </Feature>
                ))}
              </FeatureList>
              <Actions>
                <PrimaryButton
                  style={{ borderRadius: "50px" }}
                  href={primaryButtonUrl}
                  css={buttonRoundedCss}
                >
                  {primaryButtonText}
                </PrimaryButton>
                <SecondaryButton
                  style={{ borderRadius: "50px" }}
                  href={secondaryButtonUrl}
                >
                  {secondaryButtonText}
                </SecondaryButton>
              </Actions>
            </TextColumn>
            <ImageColumn>
              <ImageContainer>
                <Image src={heroScreenshotImageSrc} />
              </ImageContainer>
            </ImageColumn>
          </HeroRow>
          <Services id="services" />
        </Content2Xl>
      </Container>
      <Footer />
    </AnimationRevealPage>
  );
};

const BlocksRenderer = ({ blocks }) => {
  const [lastVisibleBlockIndex, setLastVisibleBlockIndex] = useState(0);

  const updateLastVisibleBlockIndex = (index) => {
    console.log("LAST WAS ", lastVisibleBlockIndex);
    if (index > lastVisibleBlockIndex) setLastVisibleBlockIndex(index);
  };

  return (
    <ComponentsContainer>
      {blocks.map(
        (block, index) =>
          lastVisibleBlockIndex + 1 >= index && (
            <Block
              key={index}
              components={block}
              notifyIsVisible={() => updateLastVisibleBlockIndex(index)}
            />
          )
      )}
    </ComponentsContainer>
  );
};

const Block = ({ notifyIsVisible, components }) => {
  const offset = 30;
  const [ref, inView] = useInView(offset);

  useEffect(() => {
    if (inView) notifyIsVisible();
  }, [inView, notifyIsVisible]);

  const ResizeHandle = (
    <ResizeHandleButton>
      <HandleIcon tw="w-4 h-4 text-gray-600" />
    </ResizeHandleButton>
  );

  const componentBlockRefs = {};

  const updateComponentBlockIframeHeight = (iframe) => {
    iframe.style.height = "auto";
    iframe.style.height =
      iframe.contentWindow.document.body.scrollHeight + "px";
  };

  return (
    <div ref={ref} tw="mt-32">
      <ComponentsType>{components.type}</ComponentsType>
      <Components>
        {Object.values(components.elements).map((component, componentIndex) => (
          <Component key={componentIndex}>
            <ComponentHeading>
              <ComponentName>{component.name}</ComponentName>
              <ComponentPreviewLink
                className="group"
                href={component.url}
                target="_blank"
              >
                View Live Demo{" "}
                <ArrowRightIcon tw="transition duration-300 transform group-hover:translate-x-px ml-2 w-4 h-4" />
              </ComponentPreviewLink>
            </ComponentHeading>
            <ComponentContent>
              <ResizableBox
                minWidth={310}
                default={{
                  width: "100%",
                  height: "100%",
                }}
                bounds="parent"
                disableDragging={true}
                enableResizing={{ right: true }}
                resizeHandleComponent={{ right: ResizeHandle }}
                resizeHandleWrapperClass={`resizeHandleWrapper`}
                onResize={() =>
                  updateComponentBlockIframeHeight(
                    componentBlockRefs[component.url]
                  )
                }
              >
                <iframe
                  src={component.url}
                  title="Hero"
                  width="100%"
                  ref={(ref) => (componentBlockRefs[component.url] = ref)}
                  onLoad={(e) => updateComponentBlockIframeHeight(e.target)}
                />
              </ResizableBox>
            </ComponentContent>
          </Component>
        ))}
      </Components>
    </div>
  );
};
