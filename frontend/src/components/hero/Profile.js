import React, { useState } from "react";
import tw from "twin.macro";
import styled from "styled-components";
import { css } from "styled-components/macro"; //eslint-disable-line
import { SectionHeading } from "components/misc/Headings.js";
import Header from "../headers/light.js";
import Footer from "../footers/MainFooter.js";
import axios from "axios";
import StatsProfil from "./StatsProfil.js";
import ReactModalAdapter from "../../helpers/ReactModalAdapter.js";
import { SectionHeading as HeadingTitle } from "../misc/Headings.js";
import { ReactComponent as CloseIcon } from "feather-icons/dist/icons/x.svg";

const Container1 = tw.div`relative`;
const SingleColumn = tw.div`max-w-screen-xl mx-auto`;

const HeadingInfoContainer = tw.div`flex flex-col items-center`;
const HeadingDescription = tw.p`mt-4 font-medium text-gray-600 text-center max-w-sm`;
const Container = tw.div`relative`;
const TwoColumn = tw.div`flex flex-col md:flex-row justify-between max-w-screen-xl mx-auto py-20 md:py-24`;
const Column = tw.div`w-full max-w-md mx-auto md:max-w-none md:mx-0`;
const ImageColumn = tw(Column)`md:w-6/12 lg:w-5/12 flex-shrink-0 h-12 md:h-auto`;
const TextColumn = styled(Column)(props => [
  tw`md:w-6/12 mt-8 md:mt-0`,
  props.textOnLeft ? tw`md:mr-8 lg:mr-16 md:order-first` : tw`md:ml-8 lg:ml-16 md:order-last`
]);

const Image = styled.div(props => [
  `background-image: url("${props.imageSrc}");`,
  tw`rounded bg-cover bg-center h-full`,
]);
const TextContent = tw.div`lg:py-8`;

const Heading = tw(SectionHeading)`text-primary-100 text-left text-3xl sm:text-4xl lg:text-5xl text-center md:text-left leading-tight`;
const Description = tw.p`text-center md:text-left text-sm md:text-base lg:text-lg font-medium leading-relaxed text-secondary-100 mt-4`

const Clients = tw.div`mt-6 lg:mt-8 xl:mt-16 flex flex-wrap`
const Client = tw.div`text-lg sm:text-2xl lg:text-2xl w-1/2 mt-4 lg:mt-10 text-center md:text-left`
const Value = tw.div`font-bold text-[#45d4d9]`
const Key = tw.div`font-medium text-gray-900`
const EditProfileButton = tw.button`font-bold px-8 lg:px-10 py-3 rounded bg-blue-500 text-gray-100 hocus:bg-blue-700 focus:shadow-outline focus:outline-none transition duration-300`;
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
const CloseModalButton = tw.button`absolute top-0 right-0 mt-8 mr-8 hocus:text-primary-500`;


export default ({textOnLeft = false}) => {
    const [modalIsOpen, setModalIsOpen] = useState(false);

    const toggleModal = () => setModalIsOpen(!modalIsOpen);

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
    React.useEffect(() => {
        const fetchCommandeData = async () => {
          try {
            const user = getCurrentUser();
            const response = await axios.get("/clients/details", {
              params: { No: user.no },
            });
            setUser(response.data); // Store the client response data
          } catch (error) {
            console.error("Error:", error);
          }
        };
    
        fetchCommandeData();
      }, []);
const clients = user.length > 0
? [
    { key: user[0].No, value: "Référence:" },
    { key: user[0].Name, value: "Nom:" },
    { key: user[0].E_Mail, value: "E-Mail:" },
    { key: "", value: <br /> },
    { key: user[0].Address, value: "Adresse:" },
    { key: user[0].Phone_No, value: "Téléphone:" },
    { key: user[0].Balance_LCY, value: "Solde DS:" },
    { key: user[0].Gen_Bus_Posting_Group, value: "Groupe compta. marché:" },
    { key: user[0].VAT_Bus_Posting_Group, value: "Groupe compta. marché TVA:" },
    { key: user[0].Customer_Posting_Group, value: "Groupe compta. client:" },
    { key: user[0].Payment_Terms_Code, value: "Code condition paiement:" },
    { key: user[0].Payment_Method_Code, value: "Code condition de règlement:" },
    {key: user[0].Location_Code, value: "Code magasin:" },
    {key: user[0].Shipment_Method_Code, value: "Condition livraison:" },
  ]
: [];

  return (
    <>
    <Header/>
    <Container>
      <TwoColumn>
        <ImageColumn>
          <Image imageSrc="https://mhpteamsi.com/wp-content/uploads/2020/09/AGEN-20-09-006253-04-DIG_MHP_SI-Website-Phase-1_Account-and-Client-Services-Graphics_1.png" />
        </ImageColumn>
        <TextColumn textOnLeft={textOnLeft}>
          <TextContent>
            <Heading>Profil</Heading>
            <Description>Vous trouver ci-dessous tous les informations relatives à votre profil ainsi que les statistiques de vos transactions.</Description>
            <Clients>
              {clients.map((client, index) => (
              <Client key={index}>
                <Value>{client.value}</Value>
                <Key>{client.key}</Key>
              </Client>
              ))}
            </Clients>
          </TextContent>
          <EditProfileButton  onClick={toggleModal} style={{ borderRadius: "50px" }}>Editer Profil</EditProfileButton>
        </TextColumn>
      </TwoColumn>
      <StatsProfil />
    </Container>
    <Footer/>
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
                        <HeadingTitle>Editer Profil</HeadingTitle>
                        <HeadingDescription>
                          Vous pouvez mettre à jour vos informations et coordonnées du profil ici :
                        </HeadingDescription>
                      </HeadingInfoContainer>
                    </SingleColumn>
                  </Container1>
                </div>
              </StyledModal>
    </>
  );
};
