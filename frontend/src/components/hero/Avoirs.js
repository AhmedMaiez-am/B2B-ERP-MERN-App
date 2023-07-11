import React from "react";
import AnimationRevealPage from "helpers/AnimationRevealPage.js";
import { Container, ContentWithPaddingXl } from "components/misc/Layouts";
import tw from "twin.macro";
import styled from "styled-components";
import { css } from "styled-components/macro";
import Header from "components/headers/light.js";
import Footer from "components/footers/MainFooter.js";
import { SectionHeading } from "components/misc/Headings";
import axios from "axios";
import { useHistory } from "react-router-dom";
import { Button } from "@material-ui/core";

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

const PostList = ({
  headingText = "Avoirs",
  posts = [
    {
      imageSrc:
        "https://cdn.shopify.com/s/files/1/1246/6441/files/Returns_and_Exchanges.jpg?v=1637686293",
      category: "Avoir",
      title: "Retourner un article",
      description:
        "Si vous avez reçu votre commande et vous n'êtes pas satisfait, vous pouvez retourner un ou plusieurs articles dans la commande, veuillez mentionner la raison du retour.",
      featured: true,
    },
  ],
}) => {
  const [factureData, setFactureData] = React.useState(null);

  //get the list of all commandes validés (facture enregistrées) assigned to the connected user
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
  const handleDetailsClick1 = (No) => {
    // Store No in localStorage
    localStorage.setItem("NoAvoir", No);

    // Navigate to the second component
    history.push("/components/ArticlesAvoir");
  };

  const handleSavedAvoirsRedirect = () => {
    // Navigate to the saved avoirs component
    history.push("/components/SavedAvoirs");
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
                          {post.description} <br />
                          Vous pouvez consulter la liste de vos avoirs récents
                          qui ont été validés par le fournisseur :
                          <Button
                            variant="outlined"
                            style={{
                              borderRadius: "50px",
                              display: "flex",
                              alignItems: "center",
                              padding: "2px 40px",
                              borderColor: "#8f34eb",
                              borderWidth: "2px",
                              whiteSpace: "nowrap",
                            }}
                            onClick={() => handleSavedAvoirsRedirect()}
                          >
                            <p style={{ color: "#8f34eb" }}>
                              <strong>Avoirs Validés</strong>
                            </p>
                          </Button>
                        </Description>
                      )}
                    </Info>
                  </Post>
                </PostContainer>
              ))}
            </Posts>
            <div className="container">
              {factureData &&
                factureData.map((ligne, index) => (
                  <div className="card">
                    <div className="box">
                      <div className="content">
                        <h2>N° facture</h2>
                        <br />
                        <br />
                        <br />
                        <h3>{ligne.No}</h3>
                        <p>
                          <strong>Propriétaire</strong>
                        </p>
                        <p1>{ligne.Sell_to_Customer_Name}</p1>
                        <br />
                        <br />
                        <p>
                          <strong>N° facture</strong>{" "}
                        </p>
                        <p1>{ligne.No}</p1>
                        <br />
                        <br />
                        <p>
                          <strong>Date de facturation</strong>
                        </p>
                        <p1>{ligne.Posting_Date}</p1>
                        <br />
                        <a
                          style={{ borderRadius: "50px" }}
                          onClick={() => handleDetailsClick1(ligne.No)}
                        >
                          Articles
                        </a>
                      </div>
                    </div>
                  </div>
                ))}
            </div>
          </ContentWithPaddingXl>
        </Container>
      </AnimationRevealPage>
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

.container .card:nth-child(1) .box .content a {
  background: linear-gradient(135deg, #2196f3, #00acc1);
}

.container .card:nth-child(2) .box .content a {
  background: linear-gradient(135deg, #e91e63, #9c27b0);
}

.container .card:nth-child(3) .box .content a {
  background: linear-gradient(135deg, #23c186, #4caf50);
}

.container .card .box {
  position: absolute;
  top: 20px;
  left: 20px;
  right: 20px;
  bottom: 20px;
  background: linear-gradient(to bottom, #eb8787, #fff);
  border-radius: 15px;
  display: flex;
  justify-content: center;
  align-items: center;
  overflow: hidden;
  transition: 0.5s;
}

.container .card .box:hover {
  transform: translateY(-10px);
}

.container .card .box:before {
  content: "";
  position: absolute;
  top: 0;
  left: 0;
  width: 50%;
  height: 100%;
  background: rgba(255, 255, 255, 0.03);
}

.container .card .box .content {
  padding: 20px;
  text-align: center;
}

.container .card .box .content h2 {
  font-family: "Poppins", sans-serif;
  position: absolute;
  top: 30px;
  left: 25px;
  font-size: 2rem;
  color: rgba(255, 255, 255, 0.6);
  transition: 0.5s;
}

.container .card:hover .box .content h2 {
  color: rgba(255, 255, 255, 1);
}

.container .card .box .content h3 {
    font-family: "Poppins", sans-serif;
    font-size: 1.8rem;
    color: #020957;
    z-index: 1;
    transition: 0.5s;
    margin-bottom: 10px;
    margin-left: 5px;
    opacity: 1;
    transform: translateY(0);
  }

.container .card .box .content p1 {
  font-family: "Poppins", sans-serif;
  font-size: 1rem;
  font-weight: 300;
  color: #020957;
  z-index: 1;
  transition: 0.5s;
  opacity: 0;
  transform: translateY(-20px);
}

.container .card:hover .box .content p1 {
  opacity: 1;
  transform: translateY(0);
}

.container .card .box .content p {
  font-family: "Poppins", sans-serif;
  font-size: 1rem;
  font-weight: bold;
  color: #010638;
  z-index: 1;
  transition: 0.5s;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
  opacity: 0;
  transform: translateY(-20px);
}

.container .card:hover .box .content p {
  opacity: 1;
  transform: translateY(0);
}

.container .card .box .content a {
  font-family: "Poppins", sans-serif;
  position: relative;
  display: inline-block;
  padding: 10px 30px;
  background: black;
  border-radius: 50px;
  text-decoration: none;
  color: white;
  margin-top: 20px;
  opacity: 0;
  transform: translateY(-20px);
  transition: opacity 0.3s ease-in-out, transform 0.3s ease-in-out;
}

.container .card:hover .box .content a {
  opacity: 1;
  transform: translateY(0);
}

.container .card .box .content a:hover {
  background: white;
  color: black;
}

`}
      </style>
    </>
  );
};

export default PostList;
