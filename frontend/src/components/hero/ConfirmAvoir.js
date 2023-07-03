import React from "react";
import AnimationRevealPage from "helpers/AnimationRevealPage.js";
import { Container, ContentWithPaddingXl } from "components/misc/Layouts";
import tw from "twin.macro";
import styled from "styled-components";
import { css } from "styled-components/macro";
import Header from "components/headers/light.js";
import Footer from "components/footers/MainFooter.js";
import { SectionHeading } from "components/misc/Headings";
import MotifAvoir from "./MotifAvoir";

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
        "https://static.vecteezy.com/system/resources/previews/015/277/506/original/product-return-concept-illustration-flat-design-eps10-modern-graphic-element-for-landing-page-empty-state-ui-infographic-icon-vector.jpg",
      category: "Avoir",
      title: "Retourner un article",
      description: `Vous trouvez ci-dessous la liste des articles validés dans la facture numéro : ${NoAvoir}, ,
      sélectionner l'article que vous voulez retourner.`,
      featured: true,
    },
  ],
}) => {


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
           <MotifAvoir/>
          </ContentWithPaddingXl>
        </Container>
      </AnimationRevealPage>
      <Footer />
    </>
  );
};

export default PostList;
