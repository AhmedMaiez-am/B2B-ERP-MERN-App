import React from "react";
import tw from "twin.macro";
import { css } from "styled-components/macro"; //eslint-disable-line
import HeaderBase, {
  LogoLink as LogoLinkBase,
  NavLinks,
  NavLink as NavLinkBase,
  PrimaryLink as PrimaryLinkBase,
} from "../headers/light.js";
import {
  Container as ContainerBase,
  ContentWithVerticalPadding,
  Content2Xl,
} from "components/misc/Layouts.js";
import { SectionHeading } from "components/misc/Headings.js";
import { SectionDescription } from "components/misc/Typography.js";
import { PrimaryButton as PrimaryButtonBase } from "components/misc/Buttons.js";
import logoImageSrc from "images/logo.png";
import serverIllustrationImageSrc from "images/server-illustration-2.svg";
import axios from "axios";
import LoupeOutlinedIcon from "@mui/icons-material/LoupeOutlined";
import IconButton from "@mui/material/IconButton";
import { useHistory } from "react-router-dom";
import Footer from "components/footers/MainFooter.js";
import FolderDeleteOutlinedIcon from "@mui/icons-material/FolderDeleteOutlined";
import HighlightOffOutlinedIcon from "@mui/icons-material/HighlightOffOutlined";
import VoiceChatOutlinedIcon from '@mui/icons-material/VoiceChatOutlined';
import InsertCommentOutlinedIcon from '@mui/icons-material/InsertCommentOutlined';

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

const PrimaryBackgroundContainer = tw.div`-mx-8 px-8 bg-gradient-to-t from-transparent to-blue-300 text-blue-900 text-gray-100`;
const Header = tw(HeaderBase)`max-w-none -mt-8 py-8 -mx-8 px-8`;
const NavLink = tw(
  NavLinkBase
)`lg:text-blue-100 lg:hocus:text-blue-900 lg:hocus:border-blue-900`;
const LogoLink = tw(LogoLinkBase)`text-blue-100 hocus:text-blue-900`;
const PrimaryLink = tw(
  PrimaryLinkBase
)`shadow-raised lg:bg-blue-500 lg:hocus:bg-blue-900`;

const PrimaryLinkChat = tw(
  PrimaryLinkBase
)`shadow-raised lg:bg-green-500 lg:hocus:bg-green-900`;

const Container = tw(ContainerBase)`text-blue-900`;
const Row = tw.div`flex items-center flex-col lg:flex-row`;
const Column = tw.div`lg:w-1/2`;
const TextColumn = tw.div`text-center lg:text-left`;
const IllustrationColumn = tw(Column)`mt-16 lg:mt-0 lg:ml-16`;
const Heading = tw(
  SectionHeading
)`max-w-3xl  text-blue-900  lg:max-w-4xl lg:text-left leading-tight`;
const Description = tw(
  SectionDescription
)`mt-4 max-w-2xl text-blue-700 lg:text-base mx-auto lg:mx-0`;
const PrimaryButton = tw(
  PrimaryButtonBase
)`mt-8 text-sm sm:text-base px-6 py-5 sm:px-10 sm:py-5 bg-blue-400 inline-block hocus:bg-blue-500`;
const Image = tw.img`w-144 ml-auto`;

export default ({
  heading = "Liste des commandes",
  description = "Veuillez trouvez ci-dessous la liste complète de vos commandes, ainsi que les informations relatives à leurs entêtes et status, ci vous voulez passer une nouvelle commande :",
  primaryButtonText = "Articles",
  primaryButtonUrl = "/components/ListeArticles",
  imageSrc = serverIllustrationImageSrc,
}) => {
  const logoLink = (
    <LogoLink href="/">
      <img src={logoImageSrc} alt="Logo" />
      Smart Business Solutions
    </LogoLink>
  );
  const handleLogout = () => {
    localStorage.clear();
    sessionStorage.clear();
    window.location.href = "/components/LoginPage";
  }
  const navLinks = [
    <NavLinks key={1}>
      <NavLink href="/components/ListeArticles">Articles</NavLink>
      <NavLink href="/components/Panier">Panier</NavLink>
      <NavLink href="/components/ListeFactures">Factures</NavLink>
      <NavLink href="/components/Avoirs">Avoirs</NavLink>
      <PrimaryLinkChat
        style={{ borderRadius: "50px" }}
        href="/components/Chat"
      >
        <InsertCommentOutlinedIcon /> - <VoiceChatOutlinedIcon/>
      </PrimaryLinkChat>&nbsp;
      <PrimaryLink style={{ borderRadius: "50px" }}  onClick={handleLogout}>
        Se Déconnecter
      </PrimaryLink>
    </NavLinks>,
  ];

  const [selectedLigne, setSelectedLigne] = React.useState(null);
  const [open, setOpen] = React.useState(false);
  const theme = useTheme();
  const fullScreen = useMediaQuery(theme.breakpoints.down("md"));
  const [commandeData, setCommandeData] = React.useState(null);

  //emptyCartDialog
  const handleDeleteCartDialog = (ligne) => {
    setSelectedLigne(ligne);
    setOpen(true);
  };
  //empty cart dialog
  const handleDialogClose = () => {
    setSelectedLigne(null);
    setOpen(false);
  };

  //get the list of all commandes posted by the connected user
  React.useEffect(() => {
    const sendConnectedUserData = async () => {
      try {
        const user = JSON.parse(sessionStorage.getItem("user"));
        const response = await axios.get("/commande/getAll", {
          params: { userNo: user.no },
        });
        setCommandeData(response.data); // Store the latest commande response data
      } catch (error) {
        console.error("Error:", error);
      }
    };

    sendConnectedUserData();
  }, []);

  const history = useHistory();
  const handleDetailsClick = (No) => {
    // Store No in sessionStorage
    sessionStorage.setItem("No", No);

    // Navigate to the second component
    history.push("/components/DetailsCommande");
  };

  // Empty cart
  const handleDeleteCart = async () => {
    if (selectedLigne) {
      try {
        const response = await axios.delete("/commande/delete1", {
          data: [selectedLigne],
        });

        // Reload the page
        // window.location.reload();
      } catch (error) {
        console.error("Error:", error);
      }
    }
  };

  return (
    <PrimaryBackgroundContainer>
      <Content2Xl>
        <Header logoLink={logoLink} links={navLinks} />
        <Container>
          <ContentWithVerticalPadding>
            <Row>
              <TextColumn>
                <Heading>{heading}</Heading>
                <Description>{description}</Description>
                <PrimaryButton
                  style={{ borderRadius: "50px" }}
                  as="a"
                  href={primaryButtonUrl}
                >
                  {primaryButtonText}
                </PrimaryButton>
              </TextColumn>
              <IllustrationColumn>
                <Image src={imageSrc} />
              </IllustrationColumn>
            </Row>
          </ContentWithVerticalPadding>
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
              Liste des commandes
            </h2>

            <div className="table-wrapper">
              <table className="fl-table">
                <thead>
                  <tr>
                    <th>N° de commande</th>
                    <th>N° de donneur d'ordre</th>
                    <th>Nom du donneur d'ordre</th>
                    <th>Description</th>
                    <th>Adresse</th>
                    <th>Code magasin</th>
                    <th>Date de création</th>
                    <th>Détails</th>
                    <th>Spprimmer</th>
                  </tr>
                </thead>
                <tbody>
                  {commandeData &&
                    commandeData.map((ligne, index) => (
                      <tr key={index}>
                        <td>{ligne.No}</td>
                        <td>{ligne.Sell_to_Customer_No}</td>
                        <td>{ligne.Sell_to_Customer_Name}</td>
                        <td>{ligne.Posting_Description}</td>
                        <td>{ligne.Sell_to_Address}</td>
                        <td>{ligne.Location_Code}</td>
                        <td>{ligne.Posting_Date}</td>
                        <td>
                          <IconButton
                            variant="outlined"
                            color="error"
                            style={{ color: "#02047a" }}
                            onClick={() => handleDetailsClick(ligne.No)}
                          >
                            <LoupeOutlinedIcon />
                          </IconButton>
                        </td>
                        <td>
                          <IconButton
                            variant="outlined"
                            color="error"
                            style={{ color: "#ed2f21" }}
                            onClick={() => handleDeleteCartDialog(ligne)}
                          >
                            <HighlightOffOutlinedIcon />
                          </IconButton>
                        </td>
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
  background: #4f91c3;
  
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
      content: "Glisser horizontallement >";
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
        </Container>
      </Content2Xl>
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
            onClick={handleDialogClose}
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
            onClick={handleDeleteCart}
            href="/components/ListeCommandes"
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
    </PrimaryBackgroundContainer>
  );
};
