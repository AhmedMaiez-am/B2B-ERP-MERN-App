import React from "react";
import tw from "twin.macro";
import styled from "styled-components";
import { Container as ContainerBase } from "components/misc/Layouts.js";
import logo from "../../images/logo.png";
import { ReactComponent as FacebookIcon } from "../../images/facebook-icon.svg";
import { ReactComponent as TwitterIcon } from "../../images/twitter-icon.svg";
import { ReactComponent as YoutubeIcon } from "../../images/youtube-icon.svg";

const Container = tw(ContainerBase)`bg-gradient-to-b from-transparent to-blue-300 text-blue-900 -mx-8 -mb-8`;
const Content = tw.div`max-w-screen-xl mx-auto py-10 md:py-16`;

const Row = tw.div`flex flex-col items-center justify-center md:flex-row md:justify-between px-8`;

const LogoContainer = tw.div`flex items-center justify-center md:justify-start`;
const LogoImg = tw.img`w-8`;
const LogoText = tw.h5`ml-2 text-2xl font-black tracking-wider text-gray-800`;

const LinksContainer = tw.div`mt-8 font-medium flex flex-wrap justify-center items-center flex-col sm:flex-row`;
const Link = tw.a`border-b-2 border-transparent hover:text-gray-900 hover:border-gray-900 pb-1 transition duration-300 mt-2 mx-4 text-gray-600`;

const SocialLinksContainer = tw.div`mt-10`;
const SocialLink = styled.a`
  ${tw`cursor-pointer inline-block text-gray-500 hover:text-gray-900 transition duration-300 mx-4`}
  svg {
    ${tw`w-5 h-5`}
  }
`;

const CopyrightText = tw.p`text-center mt-10 font-medium tracking-wide text-sm text-gray-600`;

export default () => {
  return (
    <Container>
      <Content>
        <Row>
          <LogoContainer>
            <LogoImg src={logo} />
            <LogoText>Smart-BS</LogoText>
          </LogoContainer>
          <LinksContainer>
            <Link href="/components/blocks/Hero/ListeArticles">Articles</Link>
            <Link href="/components/blocks/Hero/ListeCommandes">Commandes</Link>
            <Link href="/components/blocks/Hero/Panier">Panier</Link>
            <Link href="/components/blocks/Hero/ListeFactures">Factures</Link>
          </LinksContainer>
          <SocialLinksContainer>
            <SocialLink href="https://facebook.com">
              <FacebookIcon />
            </SocialLink>
            <SocialLink href="https://twitter.com">
              <TwitterIcon />
            </SocialLink>
            <SocialLink href="https://youtube.com">
              <YoutubeIcon />
            </SocialLink>
          </SocialLinksContainer>
        </Row>
        <Row>
          <CopyrightText>
            &copy; {new Date().getFullYear()} Smart Business Solutions. All Rights Reserved.
          </CopyrightText>
        </Row>
      </Content>
    </Container>
  );
};
