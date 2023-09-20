import React, { useEffect } from "react";
import styled from "styled-components";
import { css } from "styled-components/macro"; //eslint-disable-line
import Header from "../headers/lightAdmin.js";
import Footer from "../footers/MainFooterAdmin.js";
import axios from "axios";
import LoupeOutlinedIcon from "@mui/icons-material/LoupeOutlined";
import HighlightOffOutlinedIcon from "@mui/icons-material/HighlightOffOutlined";
import PersonAddAltOutlinedIcon from "@mui/icons-material/PersonAddAltOutlined";
import PlaylistAddCheckCircleOutlinedIcon from '@mui/icons-material/PlaylistAddCheckCircleOutlined';
import IconButton from "@mui/material/IconButton";
import Tooltip from "@material-ui/core/Tooltip";
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
import { useHistory } from "react-router-dom";

const CenteredContainer = styled.div`
  display: flex;
  justify-content: center;
`;
export default () => {
  useEffect(() => {
    const handleResize = () => {
      const scrollWidth =
        document.querySelector(".tbl-content").offsetWidth -
        document.querySelector(".tbl-content table").offsetWidth;
      document.querySelector(
        ".tbl-header"
      ).style.paddingRight = `${scrollWidth}px`;
    };

    window.addEventListener("load", handleResize);
    window.addEventListener("resize", handleResize);

    // Cleanup the event listeners when the component unmounts
    return () => {
      window.removeEventListener("load", handleResize);
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  const [ClientData, setClientData] = React.useState([]);
  const [selectedLigne, setSelectedLigne] = React.useState(null);
  const [open, setOpen] = React.useState(false);
  const theme = useTheme();
  const fullScreen = useMediaQuery(theme.breakpoints.down("md"));

  //get the list of all Client
  React.useEffect(() => {
    const fetchClientsData = async () => {
      try {
        const response = await axios.get("/clients/getAll");
        setClientData(response.data);
      } catch (error) {
        console.error("Error:", error);
      }
    };

    fetchClientsData();
  }, []);

  //emptyClientDialog
  const handleDeleteClientDialog = (ligne) => {
    setSelectedLigne(ligne);
    setOpen(true);
  };
  //empty client dialog
  const handleDialogClose = () => {
    setSelectedLigne(null);
    setOpen(false);
  };
  // Delete client
  const handleDeleteClient = async () => {
    if (selectedLigne) {
      try {
        const response = await axios.delete("/clients/delete", {
          data: [selectedLigne],
        });
        window.location.reload();
      } catch (error) {
        console.error("Error:", error);
      }
    }
  };


  const history = useHistory();
  const handleDetailsClick = (No) => {
    sessionStorage.setItem("NoClient", No);
    history.push("/components/DetailsClient");
  };

  return (
    <>
      <Header />
      <br />
      <br />
      <br />
      <h1>Liste des clients</h1>
      <h2>
        Consulter et gérer les clients, ci vous voulez enregistrer un nouveau
        client :{" "}
      </h2>
      <CenteredContainer>
        <Button
          href="/components/SignupPage"
          variant="contained"
          color="inherit"
          style={{
            backgroundColor: "#25c232",
            color: "#FFF",
            borderRadius: "50px",
          }}
        >
          {" "}
          <PersonAddAltOutlinedIcon /> &nbsp;
          <strong>Nouveau Client</strong>
        </Button>
      </CenteredContainer>
      <br/>
        <h2>
        Consulter et gérer les demandes de création de comptes :{" "}
      </h2>
      <CenteredContainer>
        <Button
          href="/components/DemandesComptes"
          variant="contained"
          color="inherit"
          style={{
            backgroundColor: "#25bac2",
            color: "#FFF",
            borderRadius: "50px",
          }}
        >
          {" "}
          <PlaylistAddCheckCircleOutlinedIcon /> &nbsp;
          <strong>Demandes</strong>
        </Button>
      </CenteredContainer>
      <br />
      <div className="tbl-header">
        <table cellPadding="0" cellSpacing="0" border="0">
          <thead>
            <tr>
              <th>Code Client</th>
              <th>Nom</th>
              <th>N° Téléphone</th>
              <th className="email-column">E-Mail</th>
              <th>Adresse</th>
              <th>Solde Ventes</th>
              <th>Groupe Marché</th>
              <th>Groupe Marché TVA</th>
              <th>Groupe Client</th>
              <th>Conditions Paiement</th>
              <th>Mode de Règlement</th>
              <th>Actions</th>
            </tr>
          </thead>
        </table>
      </div>
      <div className="tbl-content">
        <table cellPadding="0" cellSpacing="0" border="0">
          <tbody>
            {ClientData &&
              ClientData.map((ligne, index) => (
                <tr>
                  <td>{ligne.No}</td>
                  <td>{ligne.Name}</td>
                  <td>{ligne.Phone_No}</td>
                  <td className="email-column">{ligne.E_Mail}</td>
                  <td>{ligne.Address}</td>
                  <td>{ligne.TotalSales2}</td>
                  <td>{ligne.Gen_Bus_Posting_Group}</td>
                  <td>{ligne.VAT_Bus_Posting_Group}</td>
                  <td>{ligne.Customer_Posting_Group}</td>
                  <td>{ligne.Payment_Terms_Code}</td>
                  <td>{ligne.Payment_Method_Code}</td>
                  <td>
                    <Tooltip title="Détails">
                      <IconButton
                        variant="outlined"
                        color="primary"
                        style={{ color: "#44ecf2" }}
                        onClick={() => handleDetailsClick(ligne.No)}
                      >
                        <LoupeOutlinedIcon />
                      </IconButton>
                    </Tooltip>
                    &nbsp;
                    <Tooltip title="Supprimer">
                      <IconButton
                        variant="outlined"
                        color="error"
                        style={{ color: "#ed2f21" }}
                        onClick={() => handleDeleteClientDialog(ligne)}
                      >
                        <HighlightOffOutlinedIcon />
                      </IconButton>
                    </Tooltip>
                  </td>
                </tr>
              ))}
          </tbody>
        </table>
      </div>
      <Footer />
      <style>
        {`
h1 {
  font-size: 30px;
  color: #11f218;
  text-transform: uppercase;
  font-weight: 500;
  text-align: center;
  margin-bottom: 15px;
}

h2 {
  font-size: 15px;
  color: #ffffff;
  font-weight: 500;
  text-align: center;
  margin-bottom: 15px;
}

table {
  width: 100%;
  table-layout: fixed;
  border-collapse: separate;
  border-spacing: 0;
}

.tbl-header {
  background-color: rgba(255, 255, 255, 0.1);
  border-radius: 10px 10px 0 0;
}

.tbl-content {
  height: 550px;
  overflow-x: auto;
  margin-top: 0px;
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 0 0 10px 10px;
}

th {
  padding: 20px 15px;
  text-align: left;
  font-weight: 500;
  font-size: 12px;
  color: #e6e6ff;
  text-transform: uppercase;
  white-space: nowrap;
}

td {
  padding: 15px;
  text-align: left;
  vertical-align: middle;
  font-weight: 300;
  font-size: 12px;
  color: #ffffff;
  border-bottom: solid 1px rgba(255, 255, 255, 0.2);
}

.email-column {
  width: 200px;
}

/* demo styles */

@import url(https://fonts.googleapis.com/css?family=Roboto:400,500,300,700);
body {
  background: #060254;
  font-family: 'Roboto', sans-serif;
}

/* for custom scrollbar for webkit browser*/

::-webkit-scrollbar {
  width: 6px;
}

::-webkit-scrollbar-track {
  -webkit-box-shadow: inset 0 0 6px rgba(0, 0, 0, 0.3);
}

::-webkit-scrollbar-thumb {
  -webkit-box-shadow: inset 0 0 6px rgba(0, 0, 0, 0.3);
}

  
`}
      </style>
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
            backgroundColor: "#fa4646",
            color: "#9b2c33",
            fontWeight: "bold",
            fontSize: "1.25rem",
            borderRadius: "10px 10px 0px 0px",
            padding: "1rem",
          }}
        >
          <FolderDeleteOutlinedIcon /> &nbsp;
          {"Confirmer la suppression du client"}
        </DialogTitle>
        <DialogContent style={{ borderRadius: "20px" }}>
          <DialogContentText
            id="alert-dialog-description"
            style={{ color: "#4F4F4F" }}
          >
            Voulez vous supprimer ce client, il n'aura plus l'accés au plateforme.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button
            onClick={handleDialogClose}
            variant="contained"
            color="primary"
            style={{
              backgroundColor: "#040f87",
              color: "#FFFFFF",
              borderRadius: "50px",
            }}
          >
            <strong>Retouner</strong>
          </Button>
          <Button
            onClick={handleDeleteClient}
            href="/components/AdminClients"
            variant="contained"
            color="secondary"
            style={{
              backgroundColor: "#de1f29",
              color: "#FFFFFF",
              borderRadius: "50px",
            }}
          >
            <strong>Supprimer</strong>
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
};
