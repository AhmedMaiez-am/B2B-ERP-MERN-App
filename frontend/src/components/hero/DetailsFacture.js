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

export default () => {
  const navLinks = [
    <NavLinks key={1}>
      <NavLink href="/components/blocks/Hero/ListeFactures">Factures</NavLink>
      <NavLink href="/components/blocks/Hero/ListeCommandes">Commandes</NavLink>
      <NavLink href="/components/blocks/Hero/Panier">Panier</NavLink>
      <NavLink href="/components/blocks/Hero/ListeArticles">Articles</NavLink>
    </NavLinks>,
    <NavLinks key={2}>
      <PrimaryLink href="/#">Se Déconnecter</PrimaryLink>
    </NavLinks>,
  ];
  const [user, setUser] = React.useState([]);
  const [factureData1, setFactureData1] = React.useState(null);
  const [ligneFactureData1, setLigneFactureData1] = React.useState(null);

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
            <PrimaryAction as="a" href="/components/blocks/Hero/ListeFactures">
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
        <Button
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
      <Footer />
    </>
  );
};
