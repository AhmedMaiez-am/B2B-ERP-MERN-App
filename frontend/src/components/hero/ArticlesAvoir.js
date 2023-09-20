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
import AssignmentReturnOutlinedIcon from "@mui/icons-material/AssignmentReturnOutlined";
import Tooltip from "@material-ui/core/Tooltip";
import { useHistory } from "react-router-dom";
import CommentsDisabledOutlinedIcon from "@mui/icons-material/CommentsDisabledOutlined";
import ReportProblemOutlinedIcon from "@mui/icons-material/ReportProblemOutlined";

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

const getCurrentDate = () => {
  const currentDate = new Date();
  const options = { year: "numeric", month: "long", day: "numeric" };
  return currentDate.toLocaleDateString("fr-FR", options);
};

const NoAvoir = sessionStorage.getItem("NoAvoir");
const PostList = ({
  headingText = "Articles",
  posts = [
    {
      imageSrc:
        "https://cdni.iconscout.com/illustration/premium/thumb/return-product-7981519-6414794.png",
      category: "Avoir",
      title: "Retourner un article",
      description: `Vous trouvez ci-dessous la liste des articles validés dans la facture numéro : ${NoAvoir}.`,
      featured: true,
    },
  ],
}) => {
  const [ligneArticleAvoir, setLigneArticleAvoir] = React.useState(null);
  const [selectedLigneNos, setSelectedLigneNos] = useState([]);
  const [open, setOpen] = React.useState(false);
  const theme = useTheme();
  const fullScreen = useMediaQuery(theme.breakpoints.down("md"));

  //confirm avoir Dialog
  const handleConfirmAvoirDialog = () => {
    setOpen(true);
  };
  //confirm avoir dialog
  const handleDialogClose = () => {
    setOpen(false);
  };

  React.useEffect(() => {
    const fetchFactureData = async () => {
      try {
        const responseLigne = await axios.get("/facture/getLignes", {
          params: { facNo: NoAvoir },
        });
        setLigneArticleAvoir(responseLigne.data);
      } catch (error) {
        console.error("Error:", error);
      }
    };

    fetchFactureData();
  }, []);

  const history = useHistory();
  const handleReturnArticle = (ligne) => {
    sessionStorage.setItem("RetourArticle", JSON.stringify([ligne]));

    history.push("/components/ComfirmAvoir");
  };

  //pass all lines to avoir
  const handleSelectAll = () => {
    const allLigne = ligneArticleAvoir.map((ligne) => ligne);
    setSelectedLigneNos(allLigne);
    sessionStorage.setItem("RetourArticle", JSON.stringify(allLigne));
    history.push("/components/ComfirmAvoir");
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
                        <Description>
                          {post.description}
                          <br />
                          Sélectionner l'article que vous voulez retourner.{" "}
                          <br />
                          <ReportProblemOutlinedIcon
                            style={{ color: "#ed2f21" }}
                          />
                          &nbsp;
                          <strong>
                            Aprés confirmation de l'envoi d'avoir, les articles
                            seront supprimés!
                          </strong>
                        </Description>
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
                  <span className="heading">N° Facture</span>
                  <span className="heading">N° Article</span>
                  <span className="heading">Description</span>
                  <span className="heading">Code Magasin</span>
                  <span className="heading">Code Unité</span>
                  <span className="heading">Prix Unitaire HT</span>
                  <span className="heading">Montant Ligne HT</span>
                  <span className="heading">Quantité</span>
                  <span className="heading">Retourner</span>
                </div>
                {ligneArticleAvoir &&
                  ligneArticleAvoir.map((ligne, index) => (
                    <div key={index} className="policy">
                      <span>{ligne.Document_No}</span>
                      <span>{ligne.No}</span>
                      <span>{ligne.Description}</span>
                      <span>{ligne.Location_Code}</span>
                      <span>{ligne.Unit_of_Measure_Code}</span>
                      <span>{ligne.Unit_Price}</span>
                      <span>{ligne.Line_Amount}</span>
                      <span>{ligne.Quantity}</span>
                      <span>
                        <Tooltip title={`Retourner ${ligne.Description}`}>
                          <IconButton
                            variant="outlined"
                            color="error"
                            style={{ color: "#ed2f21" }}
                            onClick={() => handleReturnArticle(ligne)}
                          >
                            <AssignmentReturnOutlinedIcon />
                          </IconButton>
                        </Tooltip>
                      </span>
                    </div>
                  ))}
              </div>
            </div>
          </ContentWithPaddingXl>
        </Container>
        <Tooltip title="Retourner tous les articles dans la commande">
          <div
            style={{
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            <Button
              variant="outlined"
              style={{
                borderRadius: "50px",
                display: "flex",
                alignItems: "center",
                padding: "2px 40px",
                borderColor: "#eb4034",
                borderWidth: "2px",
                whiteSpace: "nowrap",
              }}
              endIcon={
                <CommentsDisabledOutlinedIcon style={{ color: "#ed2f21" }} />
              }
              onClick={() => handleConfirmAvoirDialog()}
            >
              <strong>Retourner Tous</strong>
            </Button>
          </div>
        </Tooltip>
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
              backgroundColor: "#fdf5e7",
              color: "#9b2c33",
              fontWeight: "bold",
              fontSize: "1.25rem",
              borderRadius: "10px 10px 0px 0px",
              padding: "1rem",
            }}
          >
            {"Confirmer la sélection des articles"}
          </DialogTitle>
          <DialogContent style={{ borderRadius: "20px" }}>
            <DialogContentText
              id="alert-dialog-description"
              style={{ color: "#4F4F4F" }}
            >
              Vous serez redirigé vers la page de sélection du motif de l'avoir.
              Une fois votre avoir envoyé, les articles seront supprimés !
            </DialogContentText>
          </DialogContent>
          <DialogActions>
            <Button
              onClick={() => handleDialogClose(false)}
              variant="contained"
              color="primary"
              style={{
                backgroundColor: "#f5d0ce",
                color: "#050505",
                borderRadius: "50px",
              }}
            >
              <strong>Retour</strong>
            </Button>
            <Button
              onClick={() => handleSelectAll()}
              variant="contained"
              color="secondary"
              style={{
                backgroundColor: "#de1f29",
                color: "#FFFFFF",
                borderRadius: "50px",
              }}
            >
              <strong>Confirmer</strong>
            </Button>
          </DialogActions>
        </Dialog>
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
`}
      </style>
    </>
  );
};

export default PostList;
