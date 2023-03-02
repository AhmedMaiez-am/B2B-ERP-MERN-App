import React, { useState } from "react";
import axios from "axios";
import tw from "twin.macro";
import styled from "styled-components";
import { ReactComponent as LoginIcon } from "feather-icons/dist/icons/log-in.svg";
import { useHistory } from "react-router-dom";
import logo from "images/logo.png";
import { Container as ContainerBase } from "components/misc/Layouts";
import AnimationRevealPage from "helpers/AnimationRevealPage";

const Container = tw(
  ContainerBase
)`min-h-screen bg-gradient-to-b from-teal-100 to-teal-400 text-white font-medium flex justify-center -m-8`;
const Content = tw.div`max-w-screen-xl m-0 sm:mx-24 sm:my-16 bg-white text-gray-900 shadow sm:rounded-lg flex justify-center flex-1`;
const MainContainer = tw.div`lg:w-1/2 xl:w-5/12 p-6 sm:p-12`;
const LogoLink = tw.a``;
const LogoImage = tw.img`h-12 mx-auto`;
const MainContent = tw.div`mt-12 flex flex-col items-center`;
const Heading = tw.h1`text-2xl xl:text-3xl font-extrabold`;
const FormContainer = tw.div`w-full flex-1 mt-8`;
const Form = tw.form`mx-auto max-w-xs`;
const Input = tw.input`w-full px-8 py-4 rounded-lg font-medium bg-gray-100 border border-gray-200 placeholder-gray-500 text-sm focus:outline-none focus:border-gray-400 focus:bg-white mt-5 first:mt-0`;


const SubmitButton = styled.button`
  ${tw`mt-5 tracking-wide font-semibold bg-teal-500 text-gray-100 w-full py-4 rounded-lg hover:bg-teal-900 transition-all duration-300 ease-in-out flex items-center justify-center focus:shadow-outline focus:outline-none`}
  .icon {
    ${tw`w-6 h-6 -ml-2`}
  }
  .text {
    ${tw`ml-3`}
  }
`;
const SubmitButtonIcon = LoginIcon;
// const  illustrationImageSrc = illustration
const ForgotPassword = () => {
  let history = useHistory();
  const [step, setStep] = useState(1);
  const [error, setErrors] = useState(null);
  const [email, setEmail] = useState("");
  const [user, setUser] = useState(null);
  const [secretcode, setSecretCode] = useState("");
  const [password, setPassword] = useState("");
  const [newpassword, setNewPassword] = useState("");

  const checkEmail = async (email) => {
    try {
      const result = await axios.post("/users/resetPassword", { email });
      console.log(result);
      setErrors(null)
      setStep(2);
    } catch (error) {
      // console.log(error.response)
      setErrors(error.response.data.msg);
    }
  };
  const sendCode = async (code) => {
    try {
      const result = await axios.post("/users/CheckSecretCode", { code });
      console.log(result);
      setUser(result.data.findcode.user);
      setErrors(null)
      setStep(3);
    } catch (error) {
      // console.log(error.response)
      setErrors(error.response.data.msg);
    }
  };
  const resetPassword = async (id) => {
    try {
      const result = await axios.put(`/users/resetNewPassword/${id}`, {
        newpass: password,
        confirmpass: newpassword,
      });
      console.log(result);
      // setUser(result.data.findcode.user)
      history.push("/components/innerPages/LoginPage");
    } catch (error) {
      console.log(error.response)
      setErrors(error.response.data.msg);
    }
  };
  return (
    <AnimationRevealPage>
      <Container>
        <Content>
          <MainContainer>
            <LogoLink href="/">
              <LogoImage src={logo} />
            </LogoLink>
            <MainContent>
              <Heading>Mot de passe oublié ?</Heading>
              {step === 1 ? (
                <FormContainer>
                  <p
                    style={{ width: "107%" }}
                    tw="mt-6 text-lg text-gray-600 text-center"
                  >
                    Entrer votre adresse email pour qu'on puisse vous envoyer le code de récupération
                  </p>
                  <Form
                    tw="mt-6"
                    onSubmit={(e) => {
                      checkEmail(email);
                      e.preventDefault();
                    }}
                  >
                    <Input
                      type="email"
                      name="email"
                      // value={email}
                      // onChange={(e) => hundelchange(e)}
                      required
                      placeholder="Email"
                      style={{ marginTop: "7%" }}
                      onChange={(e) => setEmail(e.target.value)}
                    />
                    {error !== null ? (
                      <p tw="mt-6 text-xs text-red-600 text-center">
                        <span
                          tw="border-red-500"
                          style={{ fontSize: "15px", color: " red" }}
                        >
                          {error}
                        </span>
                      </p>
                    ) : null}
                    <SubmitButton type="submit">
                      <SubmitButtonIcon className="icon" />
                      <span className="text">Envoyer</span>
                    </SubmitButton>
                  </Form>
                </FormContainer>
              ) : null}
              {step === 2 ? (
                <FormContainer>
                  <p
                    style={{ width: "107%" }}
                    tw="mt-6 text-lg text-gray-600 text-center"
                  >
                    Entrer le code de récupération
                  </p>
                  <Form
                    tw="mt-6"
                    onSubmit={(e) => {
                      sendCode(secretcode);
                      e.preventDefault();
                    }}
                  >
                    <Input
                      type="text"
                      name="email"
                      // value={email}
                      // onChange={(e) => hundelchange(e)}
                      required
                      placeholder="Secret Code"
                      style={{ marginTop: "7%" }}
                      onChange={(e) => setSecretCode(e.target.value)}
                    />
                    {error !== null ? (
                      <p tw="mt-6 text-xs text-red-600 text-center">
                        <span
                          tw="border-red-500"
                          style={{ fontSize: "15px", color: " red" }}
                        >
                          {error}
                        </span>
                      </p>
                    ) : null}
                    <SubmitButton type="submit">
                      <SubmitButtonIcon className="icon" />
                      <span className="text">Envoyer</span>
                    </SubmitButton>
                  </Form>
                </FormContainer>
              ) : null}
              {step === 3 ? (
                <FormContainer>
                  <p
                    style={{ width: "107%" }}
                    tw="mt-6 text-lg text-gray-600 text-center"
                  >
                    Entrer le nouveau mot de passe
                  </p>
                  <Form
                    tw="mt-6"
                    onSubmit={(e) => {
                      resetPassword(user._id);
                      e.preventDefault();
                    }}
                  >
                    <Input
                      type="password"
                      name="email"
                      required
                      placeholder="Password"
                      style={{ marginTop: "7%" }}
                      onChange={(e) => setPassword(e.target.value)}
                    />
                    <Input
                      type="password"
                      name="email"
                      // value={email}
                      // onChange={(e) => hundelchange(e)}
                      required
                      placeholder="New Password"
                      style={{ marginTop: "7%" }}
                      onChange={(e) => setNewPassword(e.target.value)}
                    />
                    {error !== null ? (
                      <p tw="mt-6 text-xs text-red-600 text-center">
                        <span
                          tw="border-red-500"
                          style={{ fontSize: "15px", color: " red" }}
                        >
                          {error}
                        </span>
                      </p>
                    ) : null}
                    <SubmitButton type="submit">
                      <SubmitButtonIcon className="icon" />
                      <span className="text">Changer</span>
                    </SubmitButton>
                  </Form>
                </FormContainer>
              ) : null}
            </MainContent>
          </MainContainer>
        </Content>
      </Container>
    </AnimationRevealPage>
  );
};

export default ForgotPassword;
