import React, { useState } from "react";
import AnimationRevealPage from "helpers/AnimationRevealPage.js";
import { Container, ContentWithPaddingXl } from "components/misc/Layouts";
import tw from "twin.macro";
import styled from "styled-components";
import { css } from "styled-components/macro";
import Header from "components/headers/light.js";
import Footer from "components/footers/MainFooter.js";
import { SectionHeading } from "components/misc/Headings";
import axios from "axios";
import IconButton from "@mui/material/IconButton";
import DisplaySettingsOutlinedIcon from "@mui/icons-material/DisplaySettingsOutlined";
import Tooltip from "@material-ui/core/Tooltip";
import ReactModalAdapter from "../../helpers/ReactModalAdapter.js";
import { ReactComponent as CloseIcon } from "feather-icons/dist/icons/x.svg";
import { SectionHeading as HeadingTitle } from "../misc/Headings.js";

const Container1 = tw.div`relative`;

const SingleColumn = tw.div`max-w-screen-xl mx-auto`;

const HeadingInfoContainer = tw.div`flex flex-col items-center`;

const HeadingDescription = tw.p`mt-4 font-medium text-gray-600 text-center max-w-sm`;
const HeadingRow = tw.div`flex`;
const Heading = tw(SectionHeading)`text-gray-900`;
const Posts = tw.div`mt-6 sm:-mr-8 flex flex-wrap`;
const PostContainer = styled.div`
  ${tw`mt-10 w-full sm:w-1/2 lg:w-1/3 sm:pr-8`}
  ${(props) =>
    props.featured &&
    css`
      ${tw`w-full!`}
      ${Post} {
        ${tw`sm:flex-row! h-full sm:pr-4`}
      }
      ${Image} {
        ${tw`sm:h-96 sm:min-h-full sm:w-1/2 lg:w-2/3 sm:rounded-t-none sm:rounded-l-lg`}
      }
      ${Info} {
        ${tw`sm:-mr-4 sm:pl-8 sm:flex-1 sm:rounded-none sm:rounded-r-lg sm:border-t-2 sm:border-l-0`}
      }
      ${Description} {
        ${tw`text-sm mt-3 leading-loose text-gray-600 font-medium`}
      }
    `}
`;
const Post = tw.div`cursor-pointer flex flex-col bg-gray-100 rounded-lg`;
const Image = styled.div`
  ${(props) =>
    css`
      background-image: url("${props.imageSrc}");
    `}
  ${tw`h-64 w-full bg-cover bg-center rounded-t-lg`}
`;
const Info = tw.div`p-8 border-2 border-t-0 rounded-lg rounded-t-none`;
const Category = tw.div`uppercase text-primary-500 text-xs font-bold tracking-widest leading-loose after:content after:block after:border-b-2 after:border-primary-500 after:w-8`;
const CreationDate = tw.div`mt-4 uppercase text-gray-600 italic font-semibold text-xs`;
const Title = tw.div`mt-1 font-black text-2xl text-gray-900 group-hover:text-primary-500 transition duration-300`;
const Description = tw.div``;
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

const getCurrentDate = () => {
  const currentDate = new Date();
  const options = { year: "numeric", month: "long", day: "numeric" };
  return currentDate.toLocaleDateString("fr-FR", options);
};

const PostList = ({
  headingText = "Avoirs Validés",
  posts = [
    {
      imageSrc:
        "https://cdn.shopify.com/s/files/1/0015/6526/1913/files/Exchnage_Return.jpg?v=1622012142",
      category: "Avoir",
      title: "",
      description: `Vous trouvez ci-dessous la liste des avoirs validés par votre fournisseur.`,
      featured: true,
    },
  ],
}) => {
  const [SavedAvoirs, setSavedAvoirs] = React.useState(null);
  const [ligneAvoirsData, setLigneAvoirsData] = React.useState(null);
  const [modalIsOpen, setModalIsOpen] = useState(false);

  const toggleModal = () => setModalIsOpen(!modalIsOpen);

  React.useEffect(() => {
    const fetchAvoirsData = async () => {
      try {
        const user = JSON.parse(localStorage.getItem("user"));
        const response = await axios.get("/avoir/getAll", {
          params: { userNo: user.tel },
        });
        setSavedAvoirs(response.data); // Store the avoirs response data
      } catch (error) {
        console.error("Error:", error);
      }
    };

    fetchAvoirsData();
  }, []);

  const handleDetailsClick = async (No) => {
    try {
      const responseLigne = await axios.get("/avoir/getLignes", {
        params: { avNo: No },
      });
      toggleModal();
      setLigneAvoirsData(responseLigne.data);
    } catch (error) {
      console.error("Error:", error);
    }
  };

  return (
    <>
      <AnimationRevealPage>
        <Header />
        <Container>
          <ContentWithPaddingXl>
            <HeadingRow>
              <Heading>{headingText}</Heading>
            </HeadingRow>
            <Posts>
              {posts.map((post, index) => (
                <PostContainer key={index} featured={post.featured}>
                  <Post className="group">
                    <Image imageSrc={post.imageSrc} />
                    <Info>
                      <Category>{post.category}</Category>
                      <CreationDate>{getCurrentDate()}</CreationDate>
                      <Title>{post.title}</Title>
                      {post.featured && post.description && (
                        <Description>{post.description}</Description>
                      )}
                    </Info>
                  </Post>
                </PostContainer>
              ))}
            </Posts>
            <br />
            <br />
            <div className="policy-container">
              <div className="policy-table">
                <div className="headings">
                  <span className="heading">N° Avoir</span>
                  <span className="heading">Nom</span>
                  <span className="heading">Adresse</span>
                  <span className="heading">Email</span>
                  <span className="heading">
                    &nbsp;&nbsp;&nbsp;&nbsp;Date de demande
                  </span>
                  <span className="heading">
                    &nbsp;&nbsp;&nbsp;&nbsp;Adresse Livraison
                  </span>
                  <span className="heading">N° contact</span>
                  <span className="heading">Articles</span>
                </div>
                {SavedAvoirs &&
                  SavedAvoirs.map((ligne, index) => (
                    <div key={index} className="policy">
                      <span>{ligne.No}</span>
                      <span>{ligne.Sell_to_Customer_Name}</span>
                      <span>{ligne.Sell_to_Address}</span>
                      <span>{ligne.SellToEmail}</span>
                      <span>{ligne.Posting_Date}</span>
                      <span>{ligne.Ship_to_Address}</span>
                      <span>{ligne.Bill_to_Contact_No}</span>
                      <span>
                        <Tooltip
                          title={`Liste d'article dans l'avoir N° :  ${ligne.No}`}
                        >
                          <IconButton
                            variant="outlined"
                            color="success"
                            style={{ color: "#49f5e8" }}
                            onClick={() => handleDetailsClick(ligne.No)}
                          >
                            <DisplaySettingsOutlinedIcon />
                          </IconButton>
                        </Tooltip>
                      </span>
                    </div>
                  ))}
              </div>
            </div>
          </ContentWithPaddingXl>
        </Container>
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
                  <HeadingTitle>Articles</HeadingTitle>
                  <HeadingDescription>
                    Vous trouver ici la liste des articles validés pour votre
                    avoir numéro :
                    {ligneAvoirsData !== null && (
                      <div>
                        {ligneAvoirsData.length > 0 &&
                          ligneAvoirsData[0].Document_No}
                      </div>
                    )}
                  </HeadingDescription>
                </HeadingInfoContainer>
              </SingleColumn>
              <div className="new-table">
                <div className="table-header">
                  <div className="table-heading">N° Avoir</div>
                  <div className="table-heading">N° ligne</div>
                  <div className="table-heading">N° article</div>
                  <div className="table-heading">Description</div>
                  <div className="table-heading">Prix Unitaire</div>
                  <div className="table-heading">Quantité</div>
                  <div className="table-heading">Prix Total</div>
                  <div className="table-heading">Prix TVA</div>
                </div>
                {ligneAvoirsData &&
                  ligneAvoirsData.map((ligne, index) => (
                    <div key={index} className="table-row">
                      <div className="table-cell">{ligne.Document_No}</div>
                      <div className="table-cell">{ligne.Line_No}</div>
                      <div className="table-cell">{ligne.No}</div>
                      <div className="table-cell">{ligne.Description}</div>
                      <div className="table-cell">{ligne.Unit_Price}</div>
                      <div className="table-cell">{ligne.Quantity}</div>
                      <div className="table-cell">{ligne.Line_Amount}</div>
                      <div className="table-cell">
                        {ligne.Total_Amount_Incl_VAT}
                      </div>
                    </div>
                  ))}
              </div>
            </Container1>
          </div>
        </StyledModal>
      </AnimationRevealPage>
      <Footer />
      <style>
        {`       
.policy-table {
  color: grey;
  text-align: center;
}

.headings, .policy {
  display: -webkit-box;
  display: -ms-flexbox;
  display: flex;
  -webkit-box-pack: justify;
  -ms-flex-pack: justify;
  justify-content: space-between;
  margin-bottom: 1em;
  padding: 1em;
}

.heading {
  flex-basis: 33.333%;
  font-weight: bold;
}

.policy {
  border-radius: 2em;
  background-color: white;
  margin-bottom: 20px;
  -moz-box-shadow: 0 0 3px grey;
  -webkit-box-shadow: 0 0 3px grey;
  box-shadow: 0 0 5px grey;
}

span {
  flex-basis: 33.333%;
}

a {
  text-decoration: none;
  color: #4c4c4c;
}


.new-table {
    color: #333;
    text-align: center;
  }
  
  .table-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 1em;
    padding: 1em;
    background-color: #daf5f3;
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  }
  
  .table-heading {
    flex-basis: 33.333%;
    font-weight: bold;
    color: #333;
  }
  
  .table-row {
    display: flex;
    justify-content: space-between;
    align-items: center;
    border-radius: 2em;
    background-color: #ffffff;
    margin-bottom: 20px;
    box-shadow: 0 0 5px rgba(0, 0, 0, 0.2);
    transition: box-shadow 0.3s ease;
  }
  
  .table-row:hover {
    box-shadow: 0 4px 8px rgba(0, 213, 255, 0.2);
  }
  
  .table-cell {
    flex-basis: 33.333%;
    padding: 1em;
  }
  
  .link {
    text-decoration: none;
    color: #4c4c4c;
  }
  
  .link:hover {
    color: #0066cc;
  }
  
  
`}
      </style>
    </>
  );
};

export default PostList;
