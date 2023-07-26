import React from "react";
import tw from "twin.macro";
import styled from "styled-components";
import { css } from "styled-components/macro"; //eslint-disable-line
import { SectionHeading } from "components/misc/Headings.js";
import Header from "../headers/lightAdmin.js";
import Footer from "../footers/MainFooterAdmin.js";
import axios from "axios";

const Container = tw.div`relative`;
const TwoColumn = tw.div`flex flex-col md:flex-row justify-between max-w-screen-xl mx-auto py-20 md:py-24`;
const Column = tw.div`w-full max-w-md mx-auto md:max-w-none md:mx-0`;
const ImageColumn = tw(Column)`md:w-6/12 lg:w-5/12 flex-shrink-0 h-80 md:h-auto`;
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
const Key = tw.div`font-medium text-gray-300`

export default ({textOnLeft = false}) => {
    const [clientData, setclientData] = React.useState([]);
    React.useEffect(() => {
        const fetchCommandeData = async () => {
          try {
            const No = sessionStorage.getItem("NoClient");
            const response = await axios.get("/clients/details", {
              params: { No },
            });
            setclientData(response.data); // Store the client response data
          } catch (error) {
            console.error("Error:", error);
          }
        };
    
        fetchCommandeData();
      }, []);
const clients = clientData.length > 0
? [
    { key: clientData[0].No, value: "Référence:" },
    { key: clientData[0].Name, value: "Nom:" },
    { key: clientData[0].E_Mail, value: "E-Mail:" },
    { key: "", value: <br /> },
    { key: clientData[0].Address, value: "Adresse:" },
    { key: clientData[0].Phone_No, value: "Téléphone:" },
    { key: clientData[0].Balance_LCY, value: "Solde DS:" },
    { key: clientData[0].Gen_Bus_Posting_Group, value: "Groupe compta. marché:" },
    { key: clientData[0].VAT_Bus_Posting_Group, value: "Groupe compta. marché TVA:" },
    { key: clientData[0].Customer_Posting_Group, value: "Groupe compta. client:" },
    { key: clientData[0].Payment_Terms_Code, value: "Code condition paiement:" },
    { key: clientData[0].Payment_Method_Code, value: "Code condition de règlement:" },
    {key: clientData[0].Location_Code, value: "Code magasin:" },
    {key: clientData[0].Shipment_Method_Code, value: "Condition livraison:" },
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
            <Heading>Fiche Client</Heading>
            <Description>Vous trouver ci-dessous tous les informations relatives au client.</Description>
            <Clients>
              {clients.map((client, index) => (
              <Client key={index}>
                <Value>{client.value}</Value>
                <Key>{client.key}</Key>
              </Client>
              ))}
            </Clients>
          </TextContent>
        </TextColumn>
      </TwoColumn>
    </Container>
    <Footer/>
    <style>
        {`
  body {
    background: #060254;
  }
`}
</style>
    </>
  );
};
