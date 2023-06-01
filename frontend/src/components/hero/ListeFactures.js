import React from "react";
import tw from "twin.macro";
import styled from "styled-components";
import { css } from "styled-components/macro"; //eslint-disable-line

import Header, { LogoLink, NavLinks, NavLink as NavLinkBase } from "../headers/light.js";
import Footer from "components/footers/MainFooter.js";

const StyledHeader = styled(Header)`
  ${tw`justify-between`}
  ${LogoLink} {
    ${tw`mr-8 pb-0`}
  }
`;

const NavLink = tw(NavLinkBase)`
  sm:text-sm sm:mx-6
`;

const Container = tw.div`relative -mx-8 -mt-8`;
const TwoColumn = tw.div`flex flex-col lg:flex-row bg-gradient-to-t from-transparent to-blue-200`;
const LeftColumn = tw.div`ml-8 mr-6 xl:pl-10 py-8`;
const RightColumn = styled.div`
  background-image: url("https://bookipi.com/wp-content/uploads/2021/04/invoice_free_invoicemaker-1024x1024.png");
  ${tw`bg-transparent bg-cover bg-center xl:ml-24 h-96 lg:h-auto lg:w-1/2 lg:flex-1`}
`;

const Content = tw.div`mt-24 lg:mt-24 lg:mb-24 flex flex-col sm:items-center lg:items-stretch`;
const Heading = tw.h1`text-3xl sm:text-5xl md:text-6xl lg:text-5xl font-black leading-none`;
const Paragraph = tw.p`max-w-md my-8 lg:my-5 lg:my-8 sm:text-lg lg:text-base xl:text-lg leading-loose`;

const Actions = styled.div`
  ${tw`mb-8 lg:mb-0`}
  .action {
    ${tw`text-center inline-block w-full sm:w-48 py-4 font-semibold tracking-wide rounded hocus:outline-none focus:shadow-outline transition duration-300`}
  }
  .primaryAction {
    ${tw`bg-blue-500 text-gray-100 hover:bg-blue-700`}
  }
  .secondaryAction {
    ${tw`mt-4 sm:mt-0 sm:ml-4 bg-gray-300 text-gray-700 hover:bg-gray-400 hover:text-gray-800`}
  }
`;

export default ({
  
  navLinks = [
    <NavLinks key={1}>
      <NavLink href="/components/blocks/Hero/ListeCommandes">Commandes</NavLink>
      <NavLink href="/components/blocks/Hero/Panier">Panier</NavLink>
      <NavLink href="/components/blocks/Hero/ListeArticles">Articles</NavLink>
      <NavLink href="">Se Déconnecter</NavLink>
    </NavLinks>
  ],
  heading = (
    <>
      Liste des
      <wbr />
      <br />
      <span tw="text-primary-500">Factures</span>
    </>
  ),
  description = "Veuillez trouvez ci-dessous la liste des commandes validés par le fournisseur. Si vous voulez passer une nouvelle commande ou vérifier vos commandes existantes :",
  primaryActionUrl = "/components/blocks/Hero/ListeArticles",
  primaryActionText = "Articles",
  secondaryActionUrl = "/components/blocks/Hero/ListeCommandes",
  secondaryActionText = "Commandes"
}) => {
  
  return (
    <>
    <Container>
      <TwoColumn>
        <LeftColumn>
          <StyledHeader links={navLinks} collapseBreakpointClass="sm" />
          <Content>
            <Heading>{heading}</Heading>
            <Paragraph>{description}</Paragraph>
            <Actions>
              <a style={{ borderRadius: "50px" }} href={primaryActionUrl} className="action primaryAction">
                {primaryActionText}
              </a>
              <a style={{ borderRadius: "50px" }} href={secondaryActionUrl} className="action secondaryAction">
                {secondaryActionText}
              </a>
            </Actions>
          </Content>
        </LeftColumn>
        <RightColumn></RightColumn>
      </TwoColumn>
    </Container>
    <Footer/>
    </>
  );
};
