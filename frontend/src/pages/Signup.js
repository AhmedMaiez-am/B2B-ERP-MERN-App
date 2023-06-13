import React, { useState } from "react";
import AnimationRevealPage from "helpers/AnimationRevealPage.js";
import { Container as ContainerBase } from "components/misc/Layouts";
import tw from "twin.macro";
import Select from "react-select";
import styled from "styled-components";
import { css } from "styled-components/macro"; //eslint-disable-line
import illustration from "images/design-illustration-2.svg";
import logo from "images/logo.png";
import { ReactComponent as SignUpIcon } from "feather-icons/dist/icons/user-plus.svg";
import { connect } from "react-redux";
import { SetAlert } from "../Actions/Alert";
import { register } from "../Actions/auth";
import PropTypes from "prop-types";
import axios from "axios";
import { useHistory } from "react-router-dom";
const Container = tw(
  ContainerBase
)`min-h-screen bg-gradient-to-t from-primary-300 to-primary-900 text-white font-medium flex justify-center -m-8`;
const Content = tw.div`max-w-screen-xl m-0 sm:mx-20 sm:my-16 bg-[#060254] text-gray-100 shadow sm:rounded-lg flex justify-center flex-1`;
const MainContainer = tw.div`lg:w-1/2 xl:w-5/12 p-6 sm:p-12`;
const LogoLink = tw.a``;
const LogoImage = tw.img`h-12 mx-auto`;
const MainContent = tw.div`mt-12 flex flex-col items-center`;
const Heading = tw.h1`text-2xl xl:text-3xl font-extrabold`;
const FormContainer = tw.div`w-full flex-1 mt-8`;

const DividerTextContainer = tw.div`my-12 border-b text-center relative`;
const DividerText = tw.div`leading-none px-2 inline-block text-sm text-gray-600 tracking-wide font-medium bg-white transform -translate-y-1/2 absolute inset-x-0 top-1/2 bg-transparent`;

const Form = tw.form`mx-auto max-w-xs`;
const Input = tw.input`w-full px-8 py-4 rounded-lg font-medium bg-gray-100 border border-blue-200 placeholder-gray-500 text-sm focus:outline-none focus:border-blue-400 focus:bg-white mb-5 first:mt-0`;
const SelectWrapper = styled(Select)`
  ${tw`w-full px-8 py-4 rounded-lg font-medium bg-gray-100 border border-blue-200 placeholder-gray-500 text-sm focus:outline-none focus:border-blue-400 focus:bg-white mb-5 first:mt-0`}
`;
const SubmitButton = styled.button`
  ${tw`mt-5 tracking-wide font-semibold bg-blue-500 text-gray-100 w-full py-4 rounded-lg hover:bg-blue-900 transition-all duration-300 ease-in-out flex items-center justify-center focus:shadow-outline focus:outline-none`}
  .icon {
    ${tw`w-6 h-6 -ml-2`}
  }
  .text {
    ${tw`ml-3`}
  }
`;
const IllustrationContainer = tw.div`sm:rounded-r-lg flex-1 bg-primary-900 text-center hidden lg:flex justify-center`;
const IllustrationImage = styled.div`
  ${(props) => `background-image: url("${props.imageSrc}");`}
  ${tw`m-12 xl:m-16 w-full max-w-lg bg-contain bg-center bg-no-repeat`}
`;
const PlaceholderLabel = tw.label`text-sm font-medium text-gray-600 mt-3`;
function Signup({
  logoLinkUrl = "#",
  illustrationImageSrc = illustration,
  headingText = "Bienvenue à votre espace de gestion des ressources",
  submitButtonText = "Créer Compte",
  SubmitButtonIcon = SignUpIcon,
  signInUrl = "/components/LoginPage",
}) {
  let history = useHistory();
  const [fromData, setFormData] = useState({
    no: "",
    name: "",
    email: "",
    password: "",
    tel: "",
    address: "",
    genBusGroup: "",
    customerGroup: "",
    code_magasin: "",
    codeLivraison: "",
    codeTVA: "",
    paymentTerm: "",
    paymentCode: "",
  });
  const genBusGroupOptions = [
    { value: "EXPORTER", label: "EXPORTER" },
    { value: "INTERSOC", label: "INTERSOC" },
    { value: "INTRA", label: "INTRA" },
    { value: "NATIONAL", label: "NATIONAL" },
  ];

  const customerGroupOptions = [
    { value: "ETRANGER", label: "ETRANGER" },
    { value: "INTRA", label: "INTRA" },
    { value: "NATIONAL", label: "NATIONAL" },
  ];

  const codeMagasinOptions = [
    { value: "ARGENTE", label: "ARGENTE" },
    { value: "BLANC", label: "BLANC" },
    { value: "BLEU", label: "BLEU" },
    { value: "JAUNE", label: "JAUNE" },
    { value: "ROUGE", label: "ROUGE" },
    { value: "VERT", label: "VERT" },
  ];

  const codeLivraisonOptions = [
    { value: "CAF", label: "CAF" },
    { value: "CF", label: "CF" },
    { value: "CIP", label: "CIP" },
    { value: "CPT", label: "CPT" },
    { value: "DAF", label: "DAF" },
    { value: "DDP", label: "DDP" },
    { value: "DEQ", label: "DEQ" },
    { value: "DES", label: "DES" },
    { value: "DISTRIB", label: "DISTRIB" },
    { value: "ENLEVEMENT", label: "ENLEVEMENT" },
    { value: "FXW", label: "FXW" },
    { value: "FAS", label: "FAS" },
    { value: "FCA", label: "FCA" },
    { value: "FOB", label: "FOB" },
    { value: "RDD", label: "RDD" },
  ];

  const codeTVAOptions = [
    { value: "EXPORTER", label: "EXPORTER" },
    { value: "INTRA", label: "INTRA" },
    { value: "NATIONAL", label: "NATIONAL" },
  ];

  const paymentTermOptions = [
    { value: "10 JOURS", label: "10 JOURS" },
    { value: "14 JOURS", label: "14 JOURS" },
    { value: "15 JOURS", label: "15 JOURS" },
    { value: "1M(8J)", label: "1M(8J)" },
    { value: "2 JOURS", label: "2 JOURS" },
    { value: "21 JOURS", label: "21 JOURS" },
    { value: "30 JOURS", label: "30 JOURS" },
    { value: "60 JOURS", label: "60 JOURS" },
    { value: "7 JOURS", label: "7 JOURS" },
    { value: "FM", label: "FM" },
    { value: "PR", label: "PR" },
  ];

  const paymentCodeOptions = [
    { value: "BANQUE", label: "BANQUE" },
    { value: "BNKCONVDOM", label: "BNKCONVDOM" },
    { value: "BNKCONVINT", label: "BNKCONVINT" },
    { value: "CARTE", label: "CARTE" },
    { value: "CHEQUE", label: "CHEQUE" },
    { value: "PAYPAL", label: "PAYPAL" },
    { value: "PLUSIEURS", label: "PLUSIEURS" },
    { value: "PRELEV", label: "PRELEV" },
    { value: "TRÉSORERIE", label: "TRÉSORERIE" },
    { value: "VIREMENT", label: "VIREMENT" },
    { value: "VIREMENTS", label: "VIREMENTS" },
    { value: "WORLDPAY", label: "WORLDPAY" },
  ];
  React.useEffect(() => {
    // Generate a random string of numbers
    const randomNo = Math.floor(Math.random() * 90000000) + 10000000;
    setFormData({ ...fromData, no: String(randomNo) });
  }, []);

  const {
    no,
    name,
    email,
    password,
    tel,
    address,
    genBusGroup,
    customerGroup,
    code_magasin,
    codeLivraison,
    codeTVA,
    paymentTerm,
    paymentCode,
  } = fromData;
  const hundelchange = (e) =>
    setFormData({ ...fromData, [e.target.name]: e.target.value });
  const onsubmit = (e) => {
    e.preventDefault();
    RegisterSend(fromData);
  };
  const RegisterSend = async (fromData) => {
    try {
      await axios.post("/users/addUser", { ...fromData });
      alert("Compte ajouté avec succés !");
      history.push("/components/LoginPage");
    } catch (error) {
      console.log(error);
    }
  };

  return (
      <Container>
        <Content>
          <MainContainer>
            <LogoLink href={logoLinkUrl}>
              <LogoImage src={logo} />
            </LogoLink>
            <MainContent>
              <Heading>{headingText}</Heading>
              <FormContainer>
                <DividerTextContainer>
                  <DividerText>Créer votre compte maintenant</DividerText>
                </DividerTextContainer>
                <Form onSubmit={(e) => onsubmit(e)}>
                  <PlaceholderLabel htmlFor="no">No° :</PlaceholderLabel>
                  <Input
                    className="myinput"
                    type="number"
                    placeholder="No°"
                    name="no"
                    value={no}
                    onChange={(e) => hundelchange(e)}
                    readOnly
                  />
                  <PlaceholderLabel htmlFor="name">
                    Nom et prénom :
                  </PlaceholderLabel>
                  <Input
                    className="myinput"
                    type="text"
                    placeholder="Nom et prénom"
                    name="name"
                    value={name}
                    onChange={(e) => hundelchange(e)}
                  />
                  <PlaceholderLabel htmlFor="email">
                    Adresse Mail :
                  </PlaceholderLabel>
                  <Input
                    className="myinput"
                    type="email"
                    placeholder="Email"
                    name="email"
                    value={email}
                    onChange={(e) => hundelchange(e)}
                  />
                  <PlaceholderLabel htmlFor="password">
                    Mot de passe :
                  </PlaceholderLabel>
                  <Input
                    className="myinput"
                    type="password"
                    placeholder="Mot de passe"
                    name="password"
                    value={password}
                    minLength="6"
                    onChange={(e) => hundelchange(e)}
                  />
                  <PlaceholderLabel htmlFor="tel">
                    Numéro de téléphone :
                  </PlaceholderLabel>
                  <Input
                    className="myinput"
                    type="number"
                    placeholder="Numèro de téléphone"
                    name="tel"
                    value={tel}
                    minLength="6"
                    onChange={(e) => hundelchange(e)}
                  />
                  <PlaceholderLabel htmlFor="Adresse">
                    Adresse :
                  </PlaceholderLabel>
                  <Input
                    className="myinput"
                    type="text"
                    placeholder="Adresse"
                    name="address"
                    value={address}
                    onChange={(e) => hundelchange(e)}
                  />
                  <PlaceholderLabel htmlFor="genBusGroup">
                    Groupe commercial général :
                  </PlaceholderLabel>
                  <SelectWrapper
                    className="myinput"
                    options={genBusGroupOptions}
                    placeholder="Groupe commercial général"
                    name="genBusGroup"
                    value={genBusGroupOptions.find(
                      (option) => option.value === genBusGroup
                    )}
                    onChange={(selectedOption) =>
                      setFormData({
                        ...fromData,
                        genBusGroup: selectedOption.value,
                      })
                    }
                  />
                  <PlaceholderLabel htmlFor="customerGroup">
                    Type du marché :
                  </PlaceholderLabel>
                  <SelectWrapper
                    className="myinput"
                    options={customerGroupOptions}
                    placeholder="Type du marché"
                    name="customerGroup"
                    value={customerGroupOptions.find(
                      (option) => option.value === customerGroup
                    )}
                    onChange={(selectedOption) =>
                      setFormData({
                        ...fromData,
                        customerGroup: selectedOption.value,
                      })
                    }
                  />
                  <PlaceholderLabel htmlFor="code_magasin">
                    Code magasin :
                  </PlaceholderLabel>
                  <SelectWrapper
                    className="myinput"
                    options={codeMagasinOptions}
                    placeholder="Code magasin"
                    name="code_magasin"
                    value={codeMagasinOptions.find(
                      (option) => option.value === code_magasin
                    )}
                    onChange={(selectedOption) =>
                      setFormData({
                        ...fromData,
                        code_magasin: selectedOption.value,
                      })
                    }
                  />
                  <PlaceholderLabel htmlFor="codeTVA">
                    Code TVA :
                  </PlaceholderLabel>
                  <SelectWrapper
                    className="myinput"
                    options={codeTVAOptions}
                    placeholder="Code TVA"
                    name="codeTVA"
                    value={codeTVAOptions.find(
                      (option) => option.value === codeTVA
                    )}
                    onChange={(selectedOption) =>
                      setFormData({
                        ...fromData,
                        codeTVA: selectedOption.value,
                      })
                    }
                  />
                  <PlaceholderLabel htmlFor="codeLivraison">
                    Code de livraison :
                  </PlaceholderLabel>
                  <SelectWrapper
                    className="myinput"
                    options={codeLivraisonOptions}
                    placeholder="Code de livraison"
                    name="codeLivraison"
                    value={codeLivraisonOptions.find(
                      (option) => option.value === codeLivraison
                    )}
                    onChange={(selectedOption) =>
                      setFormData({
                        ...fromData,
                        codeLivraison: selectedOption.value,
                      })
                    }
                  />
                  <PlaceholderLabel htmlFor="paymentTerm">
                    Code conditions paiement :
                  </PlaceholderLabel>
                  <SelectWrapper
                    className="myinput"
                    options={paymentTermOptions}
                    placeholder="Code conditions paiement"
                    name="paymentTerm"
                    value={paymentTermOptions.find(
                      (option) => option.value === paymentTerm
                    )}
                    onChange={(selectedOption) =>
                      setFormData({
                        ...fromData,
                        paymentTerm: selectedOption.value,
                      })
                    }
                  />
                  <PlaceholderLabel htmlFor="paymentCode">
                    Code mode de règlement :
                  </PlaceholderLabel>
                  <SelectWrapper
                    className="myinput"
                    options={paymentCodeOptions}
                    placeholder="Code mode de règlement"
                    name="paymentCode"
                    value={paymentCodeOptions.find(
                      (option) => option.value === paymentCode
                    )}
                    onChange={(selectedOption) =>
                      setFormData({
                        ...fromData,
                        paymentCode: selectedOption.value,
                      })
                    }
                  />
                  <SubmitButton style={{ borderRadius: "50px" }} type="submit">
                    <SubmitButtonIcon className="icon" />
                    <span className="text">{submitButtonText}</span>
                  </SubmitButton>

                  <p tw="mt-8 text-sm text-gray-600 text-center">
                    Déjà inscri ?{" "}
                    <a
                      href={signInUrl}
                      tw="border-b border-gray-500 border-dotted"
                    >
                      Connecter-vous
                    </a>
                  </p>
                </Form>
              </FormContainer>
            </MainContent>
          </MainContainer>
          <IllustrationContainer>
            <IllustrationImage imageSrc={illustrationImageSrc} />
          </IllustrationContainer>
        </Content>
      </Container>
  );
}
Signup.propTypes = {
  SetAlert: PropTypes.func.isRequired,
  register: PropTypes.func.isRequired,
  isAuthenticated: PropTypes.bool,
};
const mapStateToProps = (state) => ({
  isAuthenticated: state.auth.isAuthenticated,
});
export default connect(mapStateToProps, { SetAlert, register })(Signup);
