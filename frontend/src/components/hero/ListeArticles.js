import React from "react";
import tw from "twin.macro";
import styled from "styled-components";
import { css } from "styled-components/macro"; //eslint-disable-line
import Footer from "components/footers/MainFooter.js";
import ArticlesTable from "components/tables/Articles";
import { useHistory } from 'react-router-dom';
import Header, {
  NavLink,
  NavLinks,
  PrimaryLink,
  LogoLink,
  NavToggle,
  DesktopNavLinks,
  PrimaryLinkChat,
} from "../headers/light.js";
import ResponsiveVideoEmbed from "../../helpers/ResponsiveVideoEmbed.js";
import VoiceChatOutlinedIcon from '@mui/icons-material/VoiceChatOutlined';
import InsertCommentOutlinedIcon from '@mui/icons-material/InsertCommentOutlined';
import AccountCircleOutlinedIcon from '@mui/icons-material/AccountCircleOutlined';
import Tooltip from "@material-ui/core/Tooltip";
const StyledHeader = styled(Header)`
  ${tw`pt-8 max-w-none`}
  ${DesktopNavLinks} ${NavLink}, ${LogoLink} {
    ${tw`text-gray-100 hover:border-gray-300 hover:text-gray-300`}
  }
  ${NavToggle}.closed {
    ${tw`text-gray-100 hover:text-primary-500`}
  }
`;
const Container = styled.div`
  ${tw`relative -mx-8 -mt-8 bg-center bg-cover`}
  background-image: url("https://images.unsplash.com/photo-1522071901873-411886a10004?ixlib=rb-1.2.1&auto=format&fit=crop&w=1920&q=80");
`;

const OpacityOverlay = tw.div`z-10 absolute inset-0 bg-primary-500 opacity-25`;

const HeroContainer = tw.div`z-20 relative px-4 sm:px-8 max-w-screen-xl mx-auto`;
const TwoColumn = tw.div`pt-24 pb-32 px-4 flex justify-between items-center flex-col lg:flex-row`;
const LeftColumn = tw.div`flex flex-col items-center lg:block`;
const RightColumn = tw.div`w-full sm:w-5/6 lg:w-1/2 mt-16 lg:mt-0 lg:pl-8`;
const PrimaryLinkProfile = tw(NavLink)`
  lg:mx-3
  px-3 py-3 rounded bg-transparent text-[#45d4d9]
  hocus:bg-[#45d4d9] hocus:text-gray-200 focus:shadow-outline
  border-[#45d4d9]
`;
const Heading = styled.h1`
  ${tw`text-3xl text-center lg:text-left sm:text-4xl lg:text-5xl xl:text-6xl font-black text-gray-100 leading-none`}
  span {
    ${tw`inline-block mt-2`}
  }
`;

const SlantedBackground = styled.span`
  ${tw`relative text-blue-500 px-4 -mx-4 py-2`}
  &::before {
    content: "";
    ${tw`absolute inset-0 bg-gray-100 transform -skew-x-12 -z-10`}
  }
`;

const Notification = tw.span`inline-block my-4 pl-3 py-1 text-gray-100 border-l-4 border-blue-500 font-medium text-sm`;

const PrimaryAction = tw.button`px-8 py-3 mt-10 text-sm sm:text-base sm:mt-16 sm:px-8 sm:py-4 bg-gray-100 text-blue-500 font-bold rounded shadow transition duration-300 hocus:bg-blue-500 hocus:text-blue-100 focus:shadow-outline`;

const StyledResponsiveVideoEmbed = styled(ResponsiveVideoEmbed)`
  padding-bottom: 56.25% !important;
  padding-top: 0px !important;
  ${tw`rounded-lg`}
  iframe {
    ${tw`rounded-lg bg-black shadow-xl`}
  }
`;

export default () => {
  const handleLogout = () => {
    localStorage.clear();
    sessionStorage.clear();
    window.location.href = "/components/LoginPage";
  }
  
  const navLinks = [
    <NavLinks key={1}>
      <NavLink href="/components/ListeCommandes">Commandes</NavLink>
      <NavLink href="/components/ListeFactures">Factures</NavLink>
      <NavLink href="/components/Panier">Panier</NavLink>
      <NavLink href="/components/Avoirs">Avoirs</NavLink>
    </NavLinks>,
    <NavLinks key={2}>
      <Tooltip title ='Discussions et visioconférences'><PrimaryLinkChat style={{ borderRadius: "50px" }} href="/components/Chat"><InsertCommentOutlinedIcon /> - <VoiceChatOutlinedIcon/></PrimaryLinkChat></Tooltip>
      <PrimaryLink style={{ borderRadius: "50px" }} onClick={handleLogout}>Se Déconnecter</PrimaryLink>
      <Tooltip title ='Profil'>
      <PrimaryLinkProfile
      href ="/components/Profile"
        style={{ borderRadius: "50px" }}
      >
      <AccountCircleOutlinedIcon />
      </PrimaryLinkProfile>
      </Tooltip>
    </NavLinks>,
  ];
  
  const history = useHistory();
  const handleButtonClick = () => {
    history.push('/components/Panier');
  };
  return (
    <div>
      <>
        <Container>
          <OpacityOverlay />
          <HeroContainer>
            <StyledHeader links={navLinks} />
            <TwoColumn>
              <LeftColumn>
                <Notification>Ci vous avez besoins d'un article.</Notification>
                <Heading>
                  <span>Trouver ici la liste des</span>
                  <br />
                  <SlantedBackground>articles.</SlantedBackground>
                </Heading>
                <PrimaryAction style={{ borderRadius: "50px" }} onClick={handleButtonClick}>Accéder au panier</PrimaryAction>
              </LeftColumn>
              <RightColumn>
                <StyledResponsiveVideoEmbed
                  url="https://smart-bs.com.tn/wp-content/uploads/2022/04/smart-sbs.mp4"
                  background="transparent"
                />
              </RightColumn>
            </TwoColumn>
          </HeroContainer>
        </Container>
        <ArticlesTable/>
        <Footer/>
      </>
    </div>
  );
};
