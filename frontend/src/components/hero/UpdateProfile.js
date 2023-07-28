import React, { useState, useEffect } from "react";
import { Container as ContainerBase } from "components/misc/Layouts";
import tw from "twin.macro";
import Select from "react-select";
import styled from "styled-components";
import { css } from "styled-components/macro"; //eslint-disable-line
import axios from "axios";
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
  import SystemUpdateAltOutlinedIcon from '@mui/icons-material/SystemUpdateAltOutlined';

const Container = tw(
  ContainerBase
)`min-h-screen bg-transparent text-white font-medium flex justify-center -m-8`;
const Content = tw.div`max-w-screen-xl m-0 sm:mx-20 sm:my-16 bg-transparent text-gray-900 shadow sm:rounded-lg flex justify-center flex-1`;
const MainContainer = tw.div`lg:w-1/2 xl:w-5/12 p-6 sm:p-12`;
const MainContent = tw.div`mt-12 flex flex-col items-center`;
const FormContainer = tw.div`w-full flex-1`;

const Form = tw.form`mx-auto max-w-xs`;
const Input = tw.input`w-full px-8 py-4 rounded-lg font-medium bg-gray-100 border border-blue-200 placeholder-gray-500 text-sm focus:outline-none focus:border-blue-400 focus:bg-white mb-5 first:mt-0`;
const SelectWrapper = styled(Select)`
  ${tw`w-full px-8 py-4 rounded-lg font-medium bg-gray-100 border border-blue-200 placeholder-gray-500 text-sm focus:outline-none focus:border-blue-400 focus:bg-white mb-5 first:mt-0`}
`;
const SubmitButton = styled.button`
  ${tw`mt-5 tracking-wide font-semibold bg-green-500 text-gray-100 w-full py-4 rounded-lg hover:bg-green-900 transition-all duration-300 ease-in-out flex items-center justify-center focus:shadow-outline focus:outline-none`}
  .icon {
    ${tw`w-6 h-6 -ml-2`}
  }
  .text {
    ${tw`ml-3`}
  }
`;
const PlaceholderLabel = tw.label`text-sm font-medium text-gray-600 mt-3`;
function UpdateProfile({
  submitButtonText = "Mettre à jour",
  SubmitButtonIcon = SystemUpdateAltOutlinedIcon,
}) {
    const [open, setOpen] = React.useState(false);
    const theme = useTheme();
    const fullScreen = useMediaQuery(theme.breakpoints.down("md"));
  const [fromData, setFormData] = useState({
    no: "",
    name: "",
    email: "",
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
    // Function to retrieve user data from sessionStorage
    const getUserFromSessionStorage = () => {
        const user = JSON.parse(sessionStorage.getItem("user"));
        if (user) {
          setFormData({
            ...fromData,
            no: user.no,
            name: user.name,
            email: user.email,
            tel: user.tel,
            address: user.address,
            genBusGroup: user.genBusGroup,
            customerGroup: user.customerGroup,
            code_magasin: user.code_magasin,
            codeLivraison: user.codeLivraison,
            codeTVA: user.codeTVA,
            paymentTerm: user.paymentTerm,
            paymentCode: user.paymentCode,
          });
        }
      };
    
      // Call the getUserFromSessionStorage function when the component mounts
      useEffect(() => {
        getUserFromSessionStorage();
      }, []);

      
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
  const {
    no,
    name,
    email,
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
    setOpen(true);
    RegisterSend(fromData);
  };
  const RegisterSend = async (fromData) => {
    try {
      // Make a POST request to update the user by 'no'
      const response = await axios.post(`/users/updateUser`, fromData);
  
      // Getting updated user in mongodb and business central response data
      const updatedUser = response.data;
      // Update the user in sessionStorage with the updated data
      sessionStorage.setItem('user', JSON.stringify(updatedUser));
  
      // Handle the success response or any other logic if needed.
    } catch (error) {
      console.log(error);
    }
  };
  
  
  const handleDialogClose = () => {
    setOpen(false);
    window.location.reload();
  };

  return (
    <Container>
      <Content>
        <MainContainer>
          <MainContent>
            <FormContainer>
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
                <PlaceholderLabel htmlFor="Adresse">Adresse :</PlaceholderLabel>
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
              </Form>
            </FormContainer>
          </MainContent>
        </MainContainer>
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
              backgroundColor: "#e7fde8",
              color: "#2c339b",
              fontWeight: "bold",
              fontSize: "1.25rem",
              borderRadius: "10px 10px 0px 0px",
              padding: "1rem",
            }}
          >
            {"Informations modifiées avec succés"}
          </DialogTitle>
          <DialogContent style={{ borderRadius: "20px" }}>
            <DialogContentText
              id="alert-dialog-description"
              style={{ color: "#4F4F4F" }}
            >
              Vos informations du profil ont été bien modifiées.
            </DialogContentText>
          </DialogContent>
          <DialogActions style={{ justifyContent: "center" }}>
            <Button
              onClick={() => handleDialogClose(false)}
              variant="contained"
              color="primary"
              style={{
                backgroundColor: "#cecff5",
                color: "#050505",
                borderRadius: "50px",
              }}
            >
              <strong>OK</strong>
            </Button>
          </DialogActions>
        </Dialog>
      </Content>
    </Container>
  );
}
export default UpdateProfile;
