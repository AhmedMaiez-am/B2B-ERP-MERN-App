import React, { useState, useEffect } from "react";
import tw from "twin.macro";
import styled from "styled-components";
import { css } from "styled-components/macro"; //eslint-disable-line
import {
  SectionHeading,
  Subheading as SubheadingBase,
} from "components/misc/Headings.js";
import { SectionDescription } from "components/misc/Typography.js";
import { PrimaryButton as PrimaryButtonBase } from "components/misc/Buttons.js";
import { Container, ContentWithPaddingXl } from "components/misc/Layouts.js";
import { ReactComponent as SvgDecoratorBlob } from "images/svg-decorator-blob-6.svg";
import axios from "axios";
import { useHistory } from "react-router-dom";

const Form = tw.form`mx-auto max-w-xs`;
const HeaderContainer = tw.div`mt-10 w-full flex flex-col items-center`;
const Subheading = tw(SubheadingBase)`mb-4`;
const Heading = tw(SectionHeading)`w-full`;
const Description = tw(SectionDescription)`w-full text-center`;

const Plan = styled.div`
  ${tw`w-full max-w-md mt-16 lg:mr-8 lg:last:mr-0 text-center px-8 rounded-lg shadow relative pt-2 text-gray-900 bg-white flex flex-col`}
  .planHighlight {
    ${tw`rounded-t-lg absolute top-0 inset-x-0 h-2`}
  }

  ${(props) =>
    props.featured &&
    css`
      background: rgb(100,21,255);
      background: linear-gradient(135deg, rgba(100,21,255,1) 0%, rgba(128,64,252,1) 100%);
background: rgb(85,60,154);
background: linear-gradient(135deg, rgba(85,60,154,1) 0%, rgba(128,90,213,1) 100%);
background: rgb(76,81,191);
background: linear-gradient(135deg, rgba(76,81,191,1) 0%, rgba(102,126,234,1) 100%);
      ${tw`bg-primary-500 text-gray-100`}
      .planHighlight {
        ${tw`hidden`}
      }
      .duration {
        ${tw`text-gray-200!`}
      }
      ${PlanFeatures} {
        ${tw`border-indigo-500`}
      }
      .feature:not(.mainFeature) {
        ${tw`text-gray-300!`}
      }
      ${BuyNowButton} {
        ${tw`bg-gray-100 text-primary-500 hocus:bg-gray-300 hocus:text-primary-800`}
    `}
`;

const PlanHeader = styled.div`
  ${tw`flex flex-col uppercase leading-relaxed py-8`}
  .name {
    ${tw`font-bold text-xl`}
  }
  .price {
    ${tw`font-bold text-4xl sm:text-5xl my-1`}
  }
  .duration {
    ${tw`text-gray-500 font-bold tracking-widest`}
  }
`;
const PlanFeatures = styled.div`
  ${tw`flex flex-col -mx-8 px-8 py-8 border-t-2 border-b-2 flex-1`}
  .feature {
    ${tw`mt-1 font-medium`}
    &:not(.mainFeature) {
      ${tw`text-gray-600`}
    }
  }
  .mainFeature {
    ${tw`text-xl font-bold tracking-wide`}
  }
`;

const PlanAction = tw.div`px-4 sm:px-8 xl:px-16 py-8`;
const BuyNowButton = styled(PrimaryButtonBase)`
  ${tw`rounded-full uppercase tracking-wider py-4 w-full text-sm hover:shadow-xl transform hocus:translate-x-px hocus:-translate-y-px focus:shadow-outline`}
`;

const DecoratorBlob = styled(SvgDecoratorBlob)`
  ${tw`pointer-events-none -z-20 absolute left-0 bottom-0 h-64 w-64 opacity-25 transform -translate-x-1/2 translate-y-1/2`}
`;

export default ({
  subheading = "Finaliser votre avoir",
  heading = `Détails Article`,
  description = `Vous trouvez ici les détails de l'article choisi, veuillez sélectionner le motif de retour avant de retourner l'article`,
  plans = null,
  primaryButtonText = "Valider",
}) => {
  ////////////get RetourArticle///////
  const [RetourArticle, setRetourArticle] = useState(
    JSON.parse(localStorage.getItem("RetourArticle"))
  );
  /////////////////
  useEffect(() => {
    // Update RetourArticle state whenever the value in localStorage changes
    setRetourArticle(JSON.parse(localStorage.getItem("RetourArticle")));
  }, []);
  const defaultPlans = [
    {
      Description: `${RetourArticle.Description}`,
      Montant: `${RetourArticle.Line_Amount}`,
      Numéro: `${RetourArticle.No}`,
      Quantité: `${RetourArticle.Quantity}`,
      UnitéMesure: `${RetourArticle.Unit_of_Measure}`,
      PrixUnitaire: `${RetourArticle.Unit_Price}`,
    },
  ];

  let history = useHistory();
  const [formData, setFormData] = useState({
    Reason_Code: "", // Initialize with an empty value
  });


  const user = JSON.parse(localStorage.getItem("user"));

  const handleChange = (e) => {
    setFormData((prevFormData) => ({
      ...prevFormData,
      Reason_Code: e.target.value,
    }));
  };

  const onsubmit = (e) => {
    e.preventDefault();
    const updatedRetourArticle = {
      ...RetourArticle,
      Reason_Code: formData.Reason_Code,
    };
    UpdateSend(updatedRetourArticle, formData.Reason_Code, user);
  };

  const UpdateSend = async (updatedRetourArticle, Reason_Code, user) => {
    const dataToSend = {
      RetourArticle: updatedRetourArticle,
      Reason_Code: Reason_Code,
      User: user,
    };

    try {
      // Send data to the crate entete avoir
      await axios.post("/avoir/create", dataToSend);

      //alert("Retour effectué avec succès !");
      //history.push("/components/innerPages/ListCitoyenPage");
    } catch (error) {
      // Handle error
      console.error(error);
    }
  };

  if (!plans) plans = defaultPlans;

  const highlightGradientsCss = [
    css`
      background: rgb(56, 178, 172);
      background: linear-gradient(
        115deg,
        rgba(56, 178, 172, 1) 0%,
        rgba(129, 230, 217, 1) 100%
      );
    `,
  ];

  return (
    <Container>
      <ContentWithPaddingXl>
        <HeaderContainer>
          {subheading && <Subheading>{subheading}</Subheading>}
          <Heading>{heading}</Heading>
          {description && <Description>{description}</Description>}

          {plans.map((plan, index) => (
            <Plan key={index} featured={plan.featured}>
              {!plan.featured && (
                <div
                  className="planHighlight"
                  css={
                    highlightGradientsCss[index % highlightGradientsCss.length]
                  }
                />
              )}
              <PlanHeader>
                <span className="duration">Description d'article</span>
                <span className="name">{plan.Description}</span>
                <br />
                <span className="duration">Numéro d'article</span>
                <span className="price">{plan.Numéro}</span>
              </PlanHeader>
              <PlanFeatures>
                <span className="feature mainFeature">Unité de mesure</span>
                <span className="feature">{plan.UnitéMesure}</span>
                <br />
                <span className="feature mainFeature">Quantité</span>
                <span className="feature">{plan.Quantité}</span>
                <br />
                <span className="feature mainFeature">Prix Unitaire</span>
                <span className="feature">{plan.PrixUnitaire}</span>
                <br />
                <span className="feature mainFeature">Montant</span>
                <span className="feature">{plan.Montant}</span>
              </PlanFeatures>
              <Form onSubmit={(e) => onsubmit(e)}>
                Sélectionner le motif de retour :
                <select
                  tw="text-gray-500 w-full px-8 py-4 rounded-lg font-medium bg-purple-100 border border-gray-200 placeholder-gray-500 text-sm focus:outline-none focus:border-gray-400 focus:bg-white mt-5 first:mt-0"
                  className="Reason_Code"
                  name="Reason_Code"
                  value={formData.Reason_Code} // Use formData.Reason_Code as the value
                  onChange={handleChange} // Use the updated handleChange function
                >
                  <option value="" disabled defaultValue>
                    Selectionner un motif
                  </option>
                  <option className="100" value="100">
                    Produit défectueux
                  </option>
                  <option className="111" value="111">
                    Produit ne correspond la description
                  </option>
                  <option className="120" value="120">
                    Incompatibilité
                  </option>
                  <option className="130" value="130">
                    Problème de fabrication
                  </option>
                  <option className="140" value="140">
                    Taille inadaptée
                  </option>
                  <option className="150" value="150">
                    Problème de performance
                  </option>
                  <option className="222" value="222">
                    Produit ne répondait pas aux attentes
                  </option>
                  <option className="333" value="333">
                    Produit endommagé
                  </option>
                  <option className="444" value="444">
                    Mauvaise taille/couleur
                  </option>
                  <option className="555" value="555">
                    Problèmes de qualité
                  </option>
                  <option className="666" value="666">
                    Changement d'avis
                  </option>
                  <option className="777" value="777">
                    Problèmes d'expédition/de manipulation
                  </option>
                  <option className="888" value="888">
                    Commande incomplète
                  </option>
                  <option className="999" value="999">
                    Produit expiré
                  </option>
                </select>
                <PlanAction>
                  <BuyNowButton
                    type="submit"
                    css={!plan.featured && highlightGradientsCss[index]}
                  >
                    {primaryButtonText}
                  </BuyNowButton>
                </PlanAction>
              </Form>
            </Plan>
          ))}
        </HeaderContainer>
        <DecoratorBlob />
      </ContentWithPaddingXl>
    </Container>
  );
};
