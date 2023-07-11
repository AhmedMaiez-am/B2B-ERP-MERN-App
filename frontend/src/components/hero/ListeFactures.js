import React from "react";
import tw from "twin.macro";
import styled from "styled-components";
import { css } from "styled-components/macro"; //eslint-disable-line

import Header, {
  LogoLink,
  NavLinks,
  NavLink as NavLinkBase,
} from "../headers/light.js";
import Footer from "components/footers/MainFooter.js";
import axios from "axios";
import { useHistory } from "react-router-dom";
import ChatOutlinedIcon from "@mui/icons-material/ChatOutlined";

const StyledHeader = styled(Header)`
  ${tw`justify-between`}
  ${LogoLink} {
    ${tw`mr-8 pb-0`}
  }
`;

const NavLink = tw(NavLinkBase)`
  sm:text-sm sm:mx-6
`;

 const PrimaryLink = tw(NavLink)`
  lg:mx-0
  px-8 py-3 rounded bg-blue-500 text-gray-100
  hocus:bg-blue-700 hocus:text-gray-200 focus:shadow-outline
  border-b-0
`;

 const PrimaryLinkChat = tw(NavLink)`
  lg:mx-3
  px-8 py-3 rounded bg-green-500 text-gray-100
  hocus:bg-green-700 hocus:text-gray-200 focus:shadow-outline
  border-b-0
`;

const Container = tw.div`relative -mx-8 -mt-8`;
const TwoColumn = tw.div`flex flex-col lg:flex-row bg-gradient-to-t from-transparent to-blue-200`;
const LeftColumn = tw.div`ml-32 mr-6 xl:pl-10 py-8`;
const RightColumn = styled.div`
  background-image: url("https://bookipi.com/wp-content/uploads/2021/04/invoice_free_invoicemaker-1024x1024.png");
  ${tw`bg-transparent bg-cover bg-center xl:ml-12 h-80 lg:h-auto lg:w-1/3 lg:flex-1`}
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

  heading = (
    <>
      Liste des
      <wbr />
      <br />
      <span tw="text-primary-500">Factures</span>
    </>
  ),
  description = "Veuillez trouvez ci-dessous la liste des commandes validés par le fournisseur. Si vous voulez passer une nouvelle commande ou vérifier vos commandes existantes :",
  primaryActionUrl = "/components/ListeArticles",
  primaryActionText = "Articles",
  secondaryActionUrl = "/components/ListeCommandes",
  secondaryActionText = "Commandes",
}) => {
  const [factureData, setFactureData] = React.useState(null);
  const handleLogout = () => {
    localStorage.clear();
    window.location.href = "/components/LoginPage";
  }
  const navLinks = [
    <NavLinks key={1}>
      <NavLink href="/components/ListeCommandes">Commandes</NavLink>
      <NavLink href="/components/Panier">Panier</NavLink>
      <NavLink href="/components/ListeArticles">Articles</NavLink>
      <NavLink href="/components/Avoirs">Avoirs</NavLink>
    </NavLinks>,
    <NavLinks key={2}>
    <PrimaryLinkChat style={{ borderRadius: "50px" }} href="/components/Chat">Chat <ChatOutlinedIcon/></PrimaryLinkChat>
    <PrimaryLink style={{ borderRadius: "50px" }} onClick={handleLogout}>Se Déconnecter</PrimaryLink>
  </NavLinks>
  ];
  
  //get the list of all facture assigned to the connected user
  React.useEffect(() => {
    const sendConnectedUserData = async () => {
      try {
        const user = JSON.parse(localStorage.getItem("user"));
        const response = await axios.get("/facture/getAll", {
          params: { userNo: user.tel },
        });
        setFactureData(response.data); // Store the latest commande response data
      } catch (error) {
        console.error("Error:", error);
      }
    };

    sendConnectedUserData();
  }, []);

  const history = useHistory();
  const handleDetailsClick = (No) => {
    // Store No in localStorage
    localStorage.setItem('NoFacture', No);

    // Navigate to the second component
    history.push('/components/DetailsFacture');
  };
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
                <a
                  style={{ borderRadius: "50px" }}
                  href={primaryActionUrl}
                  className="action primaryAction"
                >
                  {primaryActionText}
                </a>
                <a
                  style={{ borderRadius: "50px" }}
                  href={secondaryActionUrl}
                  className="action secondaryAction"
                >
                  {secondaryActionText}
                </a>
              </Actions>
            </Content>
          </LeftColumn>
          <RightColumn></RightColumn>
        </TwoColumn>
      </Container>
      <div className="container">
        {factureData &&
          factureData.map((ligne, index) => (
            <div className="card">
              <div className="box">
                <div className="content">
                  <h2>N°</h2>
                  <br/><br/><br/>
                  <h3>{ligne.No}</h3>
                  <p>
                    <strong>Client</strong>
                  </p>{" "}
                  <p1>{ligne.Sell_to_Customer_Name}</p1>
                  <br /><br/>
                  <p>
                    <strong>Date de facturation</strong>{" "}
                  </p>{" "}
                  <p1>{ligne.Posting_Date}</p1>
                  <br/><br/>
                  <p>
                    <strong>Date d'échéance</strong>
                  </p>{" "}
                  <p1>{ligne.Due_Date}</p1><br/>
                  <a style={{ borderRadius: "50px" }} onClick={() => handleDetailsClick(ligne.No)}>Détails</a>
                </div>
              </div>
            </div>
          ))}
      </div>
      <Footer />
      <style>
        {`
        @import url("https://fonts.googleapis.com/css2?family=Poppins:wght@300;400;500;700;800&display=swap");
        .container {
          display: flex;
          justify-content: center;
          align-items: center;
          flex-wrap: wrap;
          max-width: 1200px;
          margin: 40px auto;
        }
        
    .container .card {
  position: relative;
  min-width: 320px;
  height: 440px;
  box-shadow: inset 5px 5px 5px rgba(0, 0, 0, 0.2),
    inset -5px -5px 15px rgba(255, 255, 255, 0.1),
    5px 5px 15px rgba(0, 0, 0, 0.3), -5px -5px 15px rgba(255, 255, 255, 0.1);
  border-radius: 15px;
  margin: 30px;
  transition: 0.5s;
}

body .container .card:nth-child(1) .box .content a {
  background: #2196f3;
}

body .container .card:nth-child(2) .box .content a {
  background: #e91e63;
}

body .container .card:nth-child(3) .box .content a {
  background: #23c186;
}

body .container .card .box {
  position: absolute;
  top: 20px;
  left: 20px;
  right: 20px;
  bottom: 20px;
  background: linear-gradient(to bottom, #87ceeb, #fff); /* Use linear-gradient with color stops */
  border-radius: 15px;
  display: flex;
  justify-content: center;
  align-items: center;
  overflow: hidden;
  transition: 0.5s;
}


body .container .card .box:hover {
  transform: translateY(-50px);
}

body .container .card .box:before {
  content: "";
  position: absolute;
  top: 0;
  left: 0;
  width: 50%;
  height: 100%;
  background: rgba(255, 255, 255, 0.03);
}

body .container .card .box .content {
  padding: 20px;
  text-align: center;
}

body .container .card .box .content h2 {
  font-family: "Poppins", sans-serif;
  position: absolute;
  top: -10px;
  left: 30px;
  font-size: 8rem;
  color: rgba(255, 255, 255, 0.3);
}

body .container .card .box .content h3 {
  font-family: "Poppins", sans-serif;
  font-size: 1.8rem;
  color: #020957;
  z-index: 1;
  transition: 0.5s;
  margin-bottom: 15px;
  margin-left: 50px;
}

body .container .card .box .content p1 {
  font-family: "Poppins", sans-serif;
  font-size: 1rem;
  font-weight: 300;
  color: #020957;
  z-index: 1;
  transition: 0.5s;
}
.container .card .box .content p {
  font-family: "Poppins", sans-serif;
  font-size: 1rem;
  font-weight: bold; /* Add font-weight property */
  color: #010638;
  z-index: 1;
  transition: 0.5s;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2); /* Add box-shadow property */
}


body .container .card .box .content a {
  font-family: "Poppins", sans-serif;
  position: relative;
  display: inline-block;
  padding: 8px 20px;
  background: black;
  border-radius: 5px;
  text-decoration: none;
  color: white;
  margin-top: 20px;
  box-shadow: 0 10px 20px rgba(0, 0, 0, 0.2);
  transition: 0.5s;
}
body .container .card .box .content a:hover {
  box-shadow: 0 10px 20px rgba(0, 0, 0, 0.6);
  background: #fff;
  color: #000;
}
`}
      </style>
    </>
  );
};
