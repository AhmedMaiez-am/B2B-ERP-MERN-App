import React from "react";
import tw from "twin.macro";
import styled from "styled-components";
import { css } from "styled-components/macro"; //eslint-disable-line

import Header, {
  NavLink,
  NavLinks,
  PrimaryLink as PrimaryLinkBase,
  LogoLink,
  NavToggle,
  DesktopNavLinks,
} from "../headers/light.js";
import axios from "axios";
import Footer from "components/footers/MainFooter.js";
import { Button } from "@material-ui/core";
import MonetizationOnOutlinedIcon from "@mui/icons-material/MonetizationOnOutlined";
import TableRowsOutlinedIcon from "@mui/icons-material/TableRowsOutlined";
import PictureAsPdfOutlinedIcon from '@mui/icons-material/PictureAsPdfOutlined';
import ReactModalAdapter from "../../helpers/ReactModalAdapter.js";
import { ReactComponent as CloseIcon } from "feather-icons/dist/icons/x.svg";
import { SectionHeading as HeadingTitle } from "../misc/Headings.js";
import Stripe from "react-stripe-checkout";
import * as XLSX from "xlsx";
import Tooltip from "@material-ui/core/Tooltip";
import jsPDF from 'jspdf';
import 'jspdf-autotable';
import ChatOutlinedIcon from "@mui/icons-material/ChatOutlined";



const Container1 = tw.div`relative`;
const SingleColumn = tw.div`max-w-screen-xl mx-auto`;

const HeadingInfoContainer = tw.div`flex flex-col items-center`;

const HeadingDescription = tw.p`mt-4 font-medium text-gray-600 text-center max-w-sm`;
const CloseModalButton = tw.button`absolute top-0 right-0 mt-8 mr-8 hocus:text-primary-500`;
const StyledHeader = styled(Header)`
  ${tw`pt-8 max-w-none w-full`}
  ${DesktopNavLinks} ${NavLink}, ${LogoLink} {
    ${tw`text-gray-100 hover:border-gray-300 hover:text-gray-300`}
  }
  ${NavToggle}.closed {
    ${tw`text-gray-100 hover:text-primary-500`}
  }
`;

const PrimaryLink = tw(PrimaryLinkBase)`rounded-full`;
const PrimaryLinkChat = tw(NavLink)`
lg:mx-3
px-8 py-3 rounded bg-green-500 text-gray-100
hocus:bg-green-700 hocus:text-gray-200 focus:shadow-outline
border-b-0
`;
const Container = styled.div`
  ${tw`relative -mx-8 -mt-8 bg-center bg-cover h-screen min-h-144`}
  background-image: url("https://cdn.dribbble.com/users/2475681/screenshots/15431471/invoice_illustration.png");
`;

const OpacityOverlay = tw.div`z-10 absolute inset-0 bg-black opacity-50`;

const HeroContainer = tw.div`z-20 relative px-6 sm:px-8 mx-auto h-full flex flex-col`;
const Content = tw.div`px-4 flex flex-1 flex-col justify-center items-center`;

const Heading = styled.h1`
  ${tw`text-3xl text-center sm:text-4xl lg:text-5xl xl:text-6xl font-black text-gray-100 leading-snug -mt-24 sm:mt-0`}
  span {
    ${tw`inline-block mt-2`}
  }
`;

const PrimaryAction = tw.button`rounded-full px-8 py-3 mt-10 text-sm sm:text-base sm:mt-16 sm:px-8 sm:py-4 bg-gray-100 font-bold shadow transition duration-300 bg-blue-500 text-gray-100 hocus:bg-blue-700 hocus:text-gray-200 focus:outline-none focus:shadow-outline`;

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

export default () => {
  const navLinks = [
    <NavLinks key={1}>
      <NavLink href="/components/ListeFactures">Factures</NavLink>
      <NavLink href="/components/ListeCommandes">Commandes</NavLink>
      <NavLink href="/components/Panier">Panier</NavLink>
      <NavLink href="/components/ListeArticles">Articles</NavLink>
      <NavLink href="/components/Avoirs">Avoirs</NavLink>
    </NavLinks>,
    <NavLinks key={2}>
      <PrimaryLinkChat style={{ borderRadius: "50px" }} href="/components/Chat">Chat <ChatOutlinedIcon/></PrimaryLinkChat>
      <PrimaryLink  onClick={clearLocalStorageAndRedirect}>Se Déconnecter</PrimaryLink>
    </NavLinks>,
  ];
  const [user, setUser] = React.useState([]);
  const [factureData1, setFactureData1] = React.useState(null);
  const [ligneFactureData1, setLigneFactureData1] = React.useState(null);
  const [modalIsOpen, setModalIsOpen] = React.useState(false);

  //payment modal
  const toggleModal = () => setModalIsOpen(!modalIsOpen);

  //payment function
  const paymentAmount = localStorage.getItem("Amount");
  const handleToken = (paymentAmount, token) => {
    try {
      axios.post("http:/localhost:5000/api/stripe/pay", {
        token: token.id,
        amount: paymentAmount,
      });
    } catch (error) {
      console.log(error);
    }
  };
  const tokenHandler = (token) => {
    handleToken(paymentAmount, token);
  };
  //

  const clearLocalStorageAndRedirect = () => {
    localStorage.clear();
    window.location.href = "/components/LoginPage";
  };
  
  React.useEffect(() => {
    setUser(JSON.parse(localStorage.getItem("user")));
  }, []);

  React.useEffect(() => {
    const fetchFactureData = async () => {
      try {
        const No = localStorage.getItem("NoFacture");
        const response = await axios.get("/facture/details", {
          params: { No },
        });
        const responseLigne = await axios.get("/facture/getLignes", {
          params: { facNo: No },
        });
        setFactureData1(response.data); // Store the commande response data
        setLigneFactureData1(responseLigne.data); // Store the lignes response data
      } catch (error) {
        console.error("Error:", error);
      }
    };

    fetchFactureData();
  }, []);

  //payment button handling
  const handlePayClick = (Amount) => {
    localStorage.setItem("Amount", Amount);
  };


  //expoert excel file
  const exportToExcel = () => {
    const table = document.querySelector(".fl-table");
    const ws = XLSX.utils.table_to_sheet(table);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Sheet1");
  
    const currentDate = new Date().toISOString().slice(0, 10);
    const fileName = `Facture ${currentDate}.xlsx`;
  
    XLSX.writeFile(wb, fileName);
  }; 
  // Export button click event
const handleExportExcel = () => {
  exportToExcel();
};
  

//donwload as PDF
const exportToPDF = () => {
  const table = document.querySelector(".fl-table");

  // Create a new jsPDF instance
  const doc = new jsPDF();

  // Set the table header style
  doc.setTextColor("#FFFFFF");
  doc.setFillColor("#32a8a0");
  doc.setFont("bold");

  // Get the table dimensions
  const tableWidth = table.offsetWidth;

  // Set the initial position for rendering the table
  let x = 10;
  let y = 10;

  // Render the table header
  doc.rect(x, y, tableWidth, 10, "F");
  doc.autoTable({
    html: table,
    startY: y + 2,
    theme: "grid",
    styles: {
      halign: "center",
      valign: "middle",
      textColor: "#000000",
      cellPadding: 2,
    },
    headerStyles: {
      fillColor: "#32a8a0",
      fontStyle: "bold",
    },
  });

  // Save the PDF file
  const currentDate = new Date().toISOString().slice(0, 10);
  const fileName = `Facture ${currentDate}.pdf`;
  doc.save(fileName);
};


  return (
    <>
      <Container>
        <OpacityOverlay />
        <HeroContainer>
          <StyledHeader links={navLinks} />
          <Content>
            <Heading>
              Détails de la facture numéro
              <br />
              {factureData1 !== null && (
                <div>{factureData1.map((facture, index) => facture.No)}</div>
              )}
            </Heading>
            <PrimaryAction as="a" href="/components/ListeFactures">
              Liste des factures
            </PrimaryAction>
          </Content>
        </HeroContainer>
      </Container>
      <div>
        <h2
          style={{
            textAlign: "center",
            fontSize: "24px",
            textTransform: "uppercase",
            letterSpacing: "1px",
            color: "navy",
            fontWeight: "bold",
            padding: "30px 0",
          }}
        >
          Lignes de la facture
        </h2>

        <div className="table-wrapper">
          <table className="fl-table">
            <thead>
              <tr>
                <th>N° de facture</th>
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
              {ligneFactureData1 &&
                ligneFactureData1.map((ligne, index) => (
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
          <h2
            style={{
              textAlign: "center",
              fontSize: "18px",
              textTransform: "uppercase",
              letterSpacing: "1px",
              padding: "30px 0",
            }}
          >
            <span style={{ color: "navy", fontWeight: "bold" }}>
              Total HT :
            </span>{" "}
            {ligneFactureData1 &&
              ligneFactureData1.length > 0 &&
              ligneFactureData1[0].Total_Amount_Excl_VAT}
          </h2>
          <h2
            style={{
              textAlign: "center",
              fontSize: "18px",
              textTransform: "uppercase",
              letterSpacing: "1px",
              padding: "5px 0",
            }}
          >
            <span style={{ color: "navy", fontWeight: "bold" }}>
              Total TTC :
            </span>{" "}
            {ligneFactureData1 &&
              ligneFactureData1.length > 0 &&
              ligneFactureData1[0].Total_Amount_Incl_VAT}
          </h2>
        </div>
      </div>
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <Tooltip title="Télécharger la facture en Excel">
        <Button
         onClick={handleExportExcel}
          variant="outlined"
          style={{
            borderRadius: "50px",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            padding: "8px",
            borderColor: "#087525",
            borderWidth: "2px",
          }}
          endIcon={<TableRowsOutlinedIcon />}
        >
          <strong>Exporter Excel</strong>
        </Button>
        </Tooltip>
        &nbsp; &nbsp;
        <Tooltip title='Payer la facture'>
        <Button
          onClick={() => {
            handlePayClick(ligneFactureData1[0].Total_Amount_Incl_VAT);
            toggleModal();
          }}
          variant="contained"
          style={{
            borderRadius: "50px",
            backgroundColor: "#03fc2c",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            padding: "8px",
          }}
          endIcon={<MonetizationOnOutlinedIcon />}
        >
          <strong>Payer</strong>
        </Button>
        </Tooltip>
        &nbsp; &nbsp;
        <Tooltip title ='Télécharger la facture en PDF'>
        <Button
          variant="outlined"
          style={{
            borderRadius: "50px",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            padding: "8px",
            borderColor: "#730305",
            borderWidth: "2px",
          }}
          endIcon={<PictureAsPdfOutlinedIcon />}
          onClick={exportToPDF}
        >
          <strong>Télécharger PDF</strong>
        </Button>
        </Tooltip>
      </div>
      <style>
        {`



/* Table Styles */

.table-wrapper {
  margin: 10px 70px 70px;
  box-shadow: 0px 4px 20px rgba(0, 0, 0, 0.2);
}

.fl-table {
  border-radius: 5px;
  font-size: 14px;
  font-weight: normal;
  border: none;
  border-collapse: collapse;
  width: 100%;
  max-width: 100%;
  white-space: nowrap;
  background-color: #fff;
  overflow: hidden;
}

.fl-table td,
.fl-table th {
  text-align: center;
  padding: 12px;
}

.fl-table td {
  border-bottom: 1px solid #f0f0f0;
}

.fl-table thead th {
  color: #fff;
  background: #7a4fc3;
  padding: 16px;
}

.fl-table thead th:first-child {
  border-top-left-radius: 5px;
}

.fl-table thead th:last-child {
  border-top-right-radius: 5px;
}

.fl-table tbody td:first-child {
  text-align: left;
  padding-left: 20px;
}

.fl-table tbody tr:nth-child(even) {
  background-color: #f9f9f9;
}

.fl-table tbody tr:last-child td {
  border-bottom: none;
}

.fl-table tbody td:before {
  content: attr(data-label);
  font-weight: bold;
  display: block;
  text-align: center;
}

/* Responsive */

@media (max-width: 767px) {
  .fl-table {
    display: block;
    width: 100%;
    overflow-x: auto;
  }

  .fl-table thead,
  .fl-table tbody,
  .fl-table thead th {
    display: block;
  }

  .fl-table thead th:last-child,
  .fl-table tbody td:last-child {
    border-bottom: 1px solid #f0f0f0;
  }

  .fl-table thead {
    float: left;
  }

  .fl-table tbody {
    width: auto;
    position: relative;
    overflow-x: auto;
  }

  .fl-table td,
  .fl-table th {
    padding: 10px;
    height: auto;
    white-space: nowrap;
    font-size: 13px;
  }

  .fl-table tbody td {
    display: block;
    text-align: center;
  }
}

        `}
      </style>
      <>
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
                  <HeadingTitle>Paiement</HeadingTitle>
                  <HeadingDescription>
                    Procéder à payer les frais de la facture{" "}
                    {factureData1 !== null && (
                      <div>
                        {factureData1.map((facture, index) => facture.No)}
                      </div>
                    )}
                  </HeadingDescription>
                  <Stripe
                    stripeKey="pk_test_51NFYMWC0bbJKKtql7dzFeFURJbmvR8nPrFEZ7ltt49z7fyooAqnSoc3RR0KW4KeZfjbcrRoogJa6ZsG4V63Aca6w00Af91tEMD"
                    token={tokenHandler}
                  />
                </HeadingInfoContainer>
              </SingleColumn>
            </Container1>
          </div>
        </StyledModal>
      </>
      <Footer />
    </>
  );
};
