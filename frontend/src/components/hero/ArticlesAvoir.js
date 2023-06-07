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

const NoAvoir = localStorage.getItem("NoAvoir");
const PostList = ({
  headingText = "Articles",
  posts = [
    {
      imageSrc:
        "https://cdni.iconscout.com/illustration/premium/thumb/return-product-7981519-6414794.png",
      category: "Avoir",
      title: "Retourner un article",
      description: `Vous trouvez ci-dessous la liste des articles validés dans la facture numéro : ${NoAvoir}, ,
      sélectionner l'article que vous voulez retourner.`,
      featured: true,
    },
  ],
}) => {
  const [visible, setVisible] = useState(7);
  const [ligneArticleAvoir, setLigneArticleAvoir] = React.useState(null);

  React.useEffect(() => {
    const fetchFactureData = async () => {
      try {
        const responseLigne = await axios.get("/facture/getLignes", {
          params: { facNo: NoAvoir },
        });
        setLigneArticleAvoir(responseLigne.data); // Store the lignes response data
      } catch (error) {
        console.error("Error:", error);
      }
    };

    fetchFactureData();
  }, []);

  const history = useHistory();
  const handleReturnArticle = (ligne) => {
    // Store No in localStorage
    localStorage.setItem('RetourArticle', JSON.stringify(ligne));

    // Navigate to the second component
    history.push('/components/blocks/Hero/ComfirmAvoir');
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
              {posts.slice(0, visible).map((post, index) => (
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
            <div class="policy-container">
              <div class="policy-table">
                <div class="headings">
                  <span class="heading">N° Facture</span>
                  <span class="heading">N° Article</span>
                  <span class="heading">Description</span>
                  <span class="heading">Code Magasin</span>
                  <span class="heading">Code Unité</span>
                  <span class="heading">Prix Unitaire HT</span>
                  <span class="heading">Montant Ligne HT</span>
                  <span class="heading">Quantité</span>
                  <span class="heading">Action</span>
                </div>
                {ligneArticleAvoir &&
                  ligneArticleAvoir.map((ligne, index) => (
                    <div key={index} class="policy">
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