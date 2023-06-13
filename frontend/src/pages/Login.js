import React, { useState } from "react"; 
import AnimationRevealPage from "helpers/AnimationRevealPage.js";
import { Container as ContainerBase } from "components/misc/Layouts";
import tw from "twin.macro";
import styled from "styled-components";
import {css} from "styled-components/macro"; //eslint-disable-line
import illustration from "images/login-illustration.svg";
import logo from "images/logo.png";
import { ReactComponent as LoginIcon } from "feather-icons/dist/icons/log-in.svg";
import { Link } from "react-router-dom";
import { login } from "../Actions/auth";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import axios from "axios";
import { useHistory} from "react-router-dom";
import { IconButton } from "@material-ui/core";
import { Visibility, VisibilityOff } from "@material-ui/icons";
import Tooltip from "@material-ui/core/Tooltip";
const Container = tw(
  ContainerBase
)`min-h-screen bg-gradient-to-b from-transparent via-transparent to-blue-300 text-white font-medium flex justify-center -m-8`;
const DividerTextContainer = tw.div`my-12 border-b text-center relative`;
const DividerText = tw.div`leading-none px-2 inline-block text-sm text-gray-600 tracking-wide font-medium bg-white transform -translate-y-1/2 absolute inset-x-0 top-1/2 bg-transparent`;

const Content = tw.div`max-w-screen-xl m-0 sm:mx-20 sm:my-16 bg-white text-gray-900 shadow sm:rounded-lg flex justify-center flex-1`;

const MainContainer = tw.div`lg:w-1/2 xl:w-5/12 p-6 sm:p-12`;

const LogoLink = tw.a``;
const LogoImage = tw.img`h-12 mx-auto`;

const MainContent = tw.div`mt-12 flex flex-col items-center`;

const Heading = tw.h1`text-2xl xl:text-3xl font-extrabold`;

const FormContainer = tw.div`w-full flex-1 mt-8`;

const Form = tw.form`mx-auto max-w-xs`;

const Input = tw.input`inline-flex w-full px-2 py-4 rounded-lg font-medium bg-gray-100 border border-blue-200 placeholder-gray-500 text-sm focus:outline-none focus:border-blue-400 focus:bg-white mt-5 first:mt-0`;

const SubmitButton = styled.button`
  ${tw`mt-5 tracking-wide font-semibold bg-blue-500 text-gray-100 w-full py-4 rounded-lg hover:bg-blue-900 transition-all duration-300 ease-in-out flex items-center justify-center focus:shadow-outline focus:outline-none`}
  .icon {
    ${tw`w-6 h-6 -ml-2`}
  }
  .text {
    ${tw`ml-3`}
  }
`;

const IllustrationContainer = tw.div`sm:rounded-r-lg flex-1 bg-blue-100 text-center hidden lg:flex justify-center`;
const IllustrationImage = styled.div`
  ${(props) => `background-image: url("${props.imageSrc}");`}
  ${tw`m-12 xl:m-16 w-full max-w-sm bg-contain bg-center bg-no-repeat`}
`;

function Login ({
  logoLinkUrl = "#",
  illustrationImageSrc = illustration,
  headingText = "Bienvenue à votre espace de gestion des ressources",
  submitButtonText = "Se Connecter",
  SubmitButtonIcon = LoginIcon,
  signupUrl = "/components/SignupPage",

}) {
  let history = useHistory();

  const [password, setPassword] = React.useState("");
  const [showPassword, setShowPassword] = React.useState(false);

  const handleInputChange = (e) => {
    setPassword(e.target.value);
  };

  const handleShowPassword = () => {
    setShowPassword(!showPassword);
  };

  const [fromData, setFormData] = useState({
    email: "",
    password: "",
  });
  const { email } = fromData;
  const [errors, setErrors] = useState([]);
  const hundelchange = (e) =>
    setFormData({ ...fromData, [e.target.name]: e.target.value });
  const onsubmit = (e) => {
    e.preventDefault();
    // login(email, password);
    loginFetch(email, password);
  };

  const loginFetch = async (email, password) => {
    try {
      const result = await axios.post("/users", { email, password });
      console.log(result);
      localStorage.setItem("user", JSON.stringify(result.data.user));
      localStorage.setItem("token", result.data.token);
        history.push("/components/ListeArticles");
      
    } catch (error) {
      setErrors(error.response.data.errors);
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
                <DividerText>Veuillez insérer vos coordonnées de connexion</DividerText>
              </DividerTextContainer>
              <Form onSubmit={(e) => onsubmit(e)}>
              <Input
                    type="email"
                    name="email"
                    value={email}
                    onChange={(e) => hundelchange(e)}
                    required
                    placeholder="Email"
                  />
                <Input
                    type={showPassword ? "text" : "password"}
                    placeholder="Mot de passe"
                    value={password}
                    onChange={handleInputChange}
                  />
                  <div tw="text-center">
                    <IconButton onClick={handleShowPassword}>
                      {showPassword ? (
                        <Tooltip title="Masquer mot de passe">
                          <VisibilityOff />
                        </Tooltip>
                      ) : (
                        <Tooltip title="Voir mot de passe">
                          <Visibility />
                        </Tooltip>
                      )}
                    </IconButton>
                  </div>
                  <br />
                <SubmitButton style={{ borderRadius: "50px" }} type="submit">
                  <SubmitButtonIcon className="icon" />
                  <span className="text">{submitButtonText}</span>
                </SubmitButton>
              </Form>
              {errors.length !== 0 ? (
                  <p tw="mt-6 text-xs text-red-600 text-center">
                    <span
                      tw="border-red-500"
                      style={{ fontSize: "15px", color: " red" }}
                    >
                      {errors[0].msg}
                    </span>
                  </p>
                ) : null}
                <p tw="mt-6 text-xs text-gray-600 text-center">
                  <Link
                    // href={forgotPLinksswordUrl}
                    to="/ForgetPassword"
                    tw="border-b border-gray-500 border-dotted"
                  >
                  Mot de passe oublié ?
                  </Link>
              </p>
              <p tw="mt-8 text-sm text-gray-600 text-center">
                Vous n'avez pas de compte ?{" "}
                <a href={signupUrl} tw="border-b border-gray-500 border-dotted">
                  Créer un compte
                </a> maintenant
              </p>
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
Login.propTypes = {
  login: PropTypes.func.isRequired,
  isAuthenticated: PropTypes.bool,
};
const mapStateToProps = (state) => ({
  isAuthenticated: state.auth.isAuthenticated,
});
export default connect(mapStateToProps, { login })(Login);