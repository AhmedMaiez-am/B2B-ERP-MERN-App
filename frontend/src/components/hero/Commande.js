import React from "react";
import styled from "styled-components";
import tw from "twin.macro";
//eslint-disable-next-line
import { css } from "styled-components/macro";
import Footer from "components/footers/MainFooter.js";
import Header from "../headers/light.js";
import { ReactComponent as SvgDecoratorBlob1 } from "../../images/svg-decorator-blob-1.svg";
import { ReactComponent as SvgDecoratorBlob2 } from "../../images/dot-pattern.svg";
import { Container, ContentWithPaddingXl } from "components/misc/Layouts";
import axios from "axios";
import DeleteForeverOutlinedIcon from "@mui/icons-material/DeleteForeverOutlined";
import FolderDeleteOutlinedIcon from "@mui/icons-material/FolderDeleteOutlined";

import {
  Button,
  Dialog,
  DialogActions,
  DialogTitle,
  DialogContent,
  DialogContentText,
} from "@material-ui/core";
import useMediaQuery from "@mui/material/useMediaQuery";
import { useTheme } from "@mui/material/styles";
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

const TwoColumn1 = tw.div`flex flex-col lg:flex-row md:items-center max-w-screen-xl mx-auto py-10 md:py-6`;
const LeftColumn1 = tw.div`relative lg:w-6/12 lg:pr-12 flex-shrink-0 text-center lg:text-left`;
const RightColumn1 = tw.div`relative mt-12 lg:mt-0 flex flex-col justify-center`;

const Heading = tw.h1`font-black text-3xl md:text-5xl leading-snug max-w-3xl`;
const Heading1 = tw.h1`font-black text-3xl md:text-5xl leading-snug max-w-3xl`;
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
  description = "Consulter la liste complète des articles passés en commande, vérifier leurs quatités et prix afin de valider votre commande. Vous pouvez consulter la liste de vos commande par ici :  ",
  primaryButtonText = "Commandes",
  primaryButtonUrl = "/components/blocks/Hero/ListeCommandes",
  imageCss = null,
  imageDecoratorBlob = false,
}) => {
  const [user, setUser] = React.useState([]);
  const [open, setOpen] = React.useState(false);
  const theme = useTheme();
  const fullScreen = useMediaQuery(theme.breakpoints.down("md"));

  React.useEffect(() => {
    setUser(JSON.parse(localStorage.getItem("user")));
  }, []);
  //emptyCartDialog
  const handleDeleteCartDialog = () => {
    setOpen(true);
  };
  //empty cart dialog
  const handleDialogClose = () => {
    setOpen(false);
  };
   
  const [commandeData, setCommandeData] = React.useState(null);
  const [ligneCommandeData, setLigneCommandeData] = React.useState(null);
  //get the latest commande posted by the connected user
  React.useEffect(() => {
    const sendConnectedUserData = async () => {
      try {
        const user = JSON.parse(localStorage.getItem("user"));
        const response = await axios.get("/commande", {
          params: { userNo: user.no },
        });
        const responseLigne = await axios.get("/commande/getLignes", {
          params: { cmdNo: response.data.No },
        });

        setCommandeData(response.data); // Store the latest commande response data
        setLigneCommandeData(responseLigne.data); // Store the lignes response data
      } catch (error) {
        console.error("Error:", error);
      }
    };

    sendConnectedUserData();
  }, []);

// Empty cart
const handleDeleteCart = async () => {
  try {
    const response = await axios.delete('/commande/delete', {
      data: commandeData,
    });
  } catch (error) {
    console.error('Error:', error);
  }
};


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
          <Heading1>Propriètaire de la Commande :</Heading1>
          <TwoColumn1>
            <LeftColumn1>
              <Text>
                <h2>Coordonnées : </h2>
                <ul>
                  <li>
                    <strong>Nom et prénom : </strong> {user.name}
                  </li>
                  <li>
                    <strong>E-Mail : </strong> {user.email}
                  </li>
                  <li>
                    <strong>Numéro de téléphone : </strong> {user.tel}
                  </li>
                  <li>
                    <strong>Addresse : </strong> {user.address}
                  </li>
                </ul>
              </Text>
            </LeftColumn1>
            <RightColumn1>
              <Text>
                <h2>Détails de validation : </h2>
                <ul>
                  <li>
                    <strong>Groupe compta. marché : </strong> {user.genBusGroup}
                  </li>
                  <li>
                    <strong>Groupe compta. marché TVA : </strong> {user.codeTVA}
                  </li>
                  <li>
                    <strong>Groupe compta. client : </strong>{" "}
                    {user.customerGroup}
                  </li>
                  <li>
                    <strong>Code remise facture : </strong> {user.no}
                  </li>
                </ul>
              </Text>
            </RightColumn1>
          </TwoColumn1>
          <TwoColumn1>
            <LeftColumn1>
              <Text>
                <h2>Paiements : </h2>
                <ul>
                  <li>
                    <strong>Code conditions paiement : </strong>{" "}
                    {user.paymentTerm}
                  </li>
                  <li>
                    <strong>Code mode de règelement : </strong>{" "}
                    {user.paymentCode}
                  </li>
                </ul>
              </Text>
            </LeftColumn1>
            <RightColumn1>
              <Text>
                <h2>Livraison : </h2>
                <ul>
                  <li>
                    <strong>Code magasin : </strong> {user.code_magasin}
                  </li>
                  <li>
                    <strong>Code conditions de livraison : </strong>{" "}
                    {user.codeLivraison}
                  </li>
                </ul>
              </Text>
            </RightColumn1>
          </TwoColumn1>
          <Heading1>Détails de la commande :</Heading1>
          <br></br>
          {commandeData && (
            <div>
              <Text>
                <ul>
                  <li>
                    <strong>N° client : </strong>
                    {commandeData.Sell_to_Customer_No}
                  </li>
                  <li>
                    <strong>Nom du client :</strong>{" "}
                    {commandeData.Sell_to_Customer_Name}
                  </li>
                  <li>
                    <strong>Adresse : </strong>
                    {commandeData.Bill_to_Address}
                  </li>
                  <li>
                    <strong>N° contact : </strong>
                    {commandeData.Bill_to_Contact_No}
                  </li>
                  <li>
                    <strong>N° téléphone : </strong>
                    {commandeData.Sell_to_Phone_No}
                  </li>
                  <li>
                    <strong>Adresse E-Mail : </strong>
                    {commandeData.Sell_to_E_Mail}
                  </li>
                  <li>
                    <strong>Date document : </strong>
                    {commandeData.Document_Date}
                  </li>
                </ul>
              </Text>
            </div>
          )}
          <div>
            <h2
              style={{
                textAlign: "center",
                fontSize: "18px",
                textTransform: "uppercase",
                letterSpacing: "1px",
                color: "navy",
                fontWeight: "bold",
                padding: "30px 0",
              }}
            >
              Lignes de la commande
            </h2>

            <div className="table-wrapper">
              <table className="fl-table">
                <thead>
                  <tr>
                    <th>N° de commande</th>
                    <th>N° de ligne</th>
                    <th>Description</th>
                    <th>Code Magasin</th>
                    <th>Code Unité</th>
                    <th>Prix Unitaire HT</th>
                    <th>Montant Ligne HT</th>
                    <th>Quantité</th>
                  </tr>
                </thead>
                <tbody>
                  {ligneCommandeData &&
                    ligneCommandeData.map((ligne, index) => (
                      <tr key={index}>
                        <td>{ligne.Document_No}</td>
                        <td>{ligne.Line_No}</td>
                        <td>{ligne.Description}</td>
                        <td>{ligne.Location_Code}</td>
                        <td>{ligne.Unit_of_Measure_Code}</td>
                        <td>{ligne.Unit_Price}</td>
                        <td>{ligne.Line_Amount}</td>
                        <td>{ligne.Quantity}</td>
                      </tr>
                    ))}
                </tbody>
              </table>
            </div>
          </div>
          <style>
            {`



/* Table Styles */

.table-wrapper{
  margin: 10px 70px 70px;
  box-shadow: 0px 35px 50px rgba( 0, 0, 0, 0.2 );
}

.fl-table {
  border-radius: 5px;
  font-size: 12px;
  font-weight: normal;
  border: none;
  border-collapse: collapse;
  width: 100%;
  max-width: 100%;
  white-space: nowrap;
  background-color: white;
  
}

.fl-table td, .fl-table th {
  text-align: center;
  padding: 8px;
}

.fl-table td {
  border-right: 1px solid #f8f8f8;
  font-size: 15px;
}

.fl-table thead th {
  color: #ffffff;
  background: #4FC3A1;
  
}


.fl-table thead th:nth-child(odd) {
  color: #ffffff;
  background: #324960;
}

.fl-table tr:nth-child(even) {
  background: #F8F8F8;
}

/* Responsive */

@media (max-width: 767px) {
  .fl-table {
      display: block;
      width: 100%;
  }
  .table-wrapper:before{
      content: "Scroll horizontally >";
      display: block;
      text-align: right;
      font-size: 11px;
      color: white;
      padding: 0 0 10px;
  }
  .fl-table thead, .fl-table tbody, .fl-table thead th {
      display: block;
  }
  .fl-table thead th:last-child{
      border-bottom: none;
  }
  .fl-table thead {
      float: left;
  }
  .fl-table tbody {
      width: auto;
      position: relative;
      overflow-x: auto;
  }
  .fl-table td, .fl-table th {
      padding: 20px .625em .625em .625em;
      height: 60px;
      vertical-align: middle;
      box-sizing: border-box;
      overflow-x: hidden;
      overflow-y: auto;
      width: 120px;
      font-size: 13px;
      text-overflow: ellipsis;
  }
  .fl-table thead th {
      text-align: left;
      border-bottom: 1px solid #f7f7f9;
  }
  .fl-table tbody tr {
      display: table-cell;
  }
  .fl-table tbody tr:nth-child(odd) {
      background: none;
  }
  .fl-table tr:nth-child(even) {
      background: transparent;
  }
  .fl-table tr td:nth-child(odd) {
      background: #F8F8F8;
      border-right: 1px solid #E6E4E4;
  }
  .fl-table tr td:nth-child(even) {
      border-right: 1px solid #E6E4E4;
  }
  .fl-table tbody td {
      display: block;
      text-align: center;
  }
}
        `}
          </style>
          <div
            style={{
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            <Button
              onClick={() => handleDeleteCartDialog()}
              variant="contained"
              color="secondary"
              style={{ borderRadius: "50px" }}
              endIcon={<DeleteForeverOutlinedIcon />}
            >
              <strong>Annuler Commande</strong>
            </Button>
          </div>
        </ContentWithPaddingXl>
        <DecoratorBlob1 />
      </Container>
      <Footer />
      <Dialog
        fullScreen={fullScreen}
        open={open}
        onClose={() => handleDialogClose(false)}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle
          id="alert-dialog-title"
          style={{
            backgroundColor: "#fde7e7",
            color: "#9b2c33",
            fontWeight: "bold",
            fontSize: "1.25rem",
            borderRadius: "10px 10px 0px 0px",
            padding: "1rem",
          }}
        >
          <FolderDeleteOutlinedIcon /> &nbsp;
          {"Confirmer la suppression de la commande"}
        </DialogTitle>
        <DialogContent style={{ borderRadius: "20px" }}>
          <DialogContentText
            id="alert-dialog-description"
            style={{ color: "#4F4F4F" }}
          >
            Voulez vous supprimer tous les articles et annuler la commande ?
            Vous serez redirigé vers votre Panier.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button
            onClick={() => handleDialogClose(false)}
            variant="contained"
            color="primary"
            style={{
              backgroundColor: "#58d2ed",
              color: "#FFFFFF",
              borderRadius: "50px",
            }}
          >
            <strong>Non</strong>
          </Button>
          <Button
            onClick={() => handleDeleteCart()}
            href="/components/blocks/Hero/Panier"
            variant="contained"
            color="secondary"
            style={{
              backgroundColor: "#de1f29",
              color: "#FFFFFF",
              borderRadius: "50px",
            }}
          >
            <strong>Oui</strong>
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
};
