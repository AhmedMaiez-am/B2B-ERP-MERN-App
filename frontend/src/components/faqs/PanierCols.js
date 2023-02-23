import React, { useState } from "react";
import { motion } from "framer-motion";
import styled from "styled-components";
import tw from "twin.macro";
import { css } from "styled-components/macro"; //eslint-disable-line
import { Container, ContentWithPaddingXl } from "components/misc/Layouts.js";
import { ReactComponent as ChevronDownIcon } from "feather-icons/dist/icons/chevron-down.svg";
import { ReactComponent as SvgDecoratorBlob1 } from "images/svg-decorator-blob-7.svg";
import { ReactComponent as SvgDecoratorBlob2 } from "images/svg-decorator-blob-8.svg";
import { SectionHeading as HeadingTitle } from "components/misc/Headings.js";
import IconButton from "@mui/material/IconButton";
import DeleteIcon from "@mui/icons-material/DeleteOutline";
import Tooltip from "@material-ui/core/Tooltip";
import {
  Button,
  Dialog,
  DialogActions,
  DialogTitle,
  DialogContent,
  DialogContentText,
} from "@material-ui/core";
import AddShoppingCartIcon from "@mui/icons-material/AddShoppingCart";
import useMediaQuery from "@mui/material/useMediaQuery";
import { useTheme } from "@mui/material/styles";
const Column = tw.div`flex flex-col items-center`;

const FAQSContainer = tw.dl`mt-12 max-w-4xl relative`;
const FAQ = tw.div`
cursor-pointer select-none mt-5 px-8 sm:px-10 py-5 sm:py-4
rounded-lg text-gray-800 hover:text-gray-900
border border-blue-700 hover:border-blue-500
bg-transparent hover:bg-gray-100
transition duration-300
`;
const Question = tw.dt`flex justify-between items-center`;
const QuestionText = tw.span`text-lg lg:text-xl font-semibold`;
const Q = tw.span`text-xl font-bold text-blue-700 mb-4 underline`;
const P = tw.span`font-bold text-blue-500 mb-4`;

const QuestionToggleIcon = motion(styled.span`
  ${tw`ml-2 transition duration-300`}
  svg {
    ${tw`w-6 h-6`}
  }
`);
const Answer = motion(
  tw.dd`pointer-events-none text-sm sm:text-base leading-relaxed`
);

const DecoratorBlob1 = styled(SvgDecoratorBlob1)`
  ${tw`pointer-events-none -z-20 absolute right-0 top-0 h-56 w-56 opacity-15 transform translate-x-2/3 -translate-y-12 text-teal-400`}
`;
const DecoratorBlob2 = styled(SvgDecoratorBlob2)`
  ${tw`pointer-events-none -z-20 absolute left-0 bottom-0 h-64 w-64 opacity-15 transform -translate-x-2/3 text-primary-500`}
`;

export default () => {
  const [activeQuestionIndex, setActiveQuestionIndex] = useState(null);
  const theme = useTheme();
  const fullScreen = useMediaQuery(theme.breakpoints.down("md"));
  const [open, setOpen] = React.useState(false);
  const [deleteIndex, setDeleteIndex] = useState(null);
  const [data, setData] = React.useState([]);
  //Retrieve cart from local Storage
  React.useEffect(() => {
    const panier = JSON.parse(localStorage.getItem("panier"));
    setData(panier);
  }, []);

  //calculate articles total price
  const cartTotalPrice = data.reduce((total, item) => {
    return total + item.prixUni;
  }, 0);

  //populate faqs with data from local storage to pass it into return
  const faqs = data.map((panier) => {
    return {
      id: panier.num,
      description: panier.description,
      numFrounisseur: panier.numFrounisseur,
      numGamme: panier.numGamme,
      prixUni: panier.prixUni,
      stocks: panier.stocks,
    };
  });

  //open article informations seperate from buttons click
  const handleClick = (questionIndex) => (event) => {
    setActiveQuestionIndex(
      activeQuestionIndex === questionIndex ? null : questionIndex
    );
    if (event.target.nodeName !== "BUTTON") {
      setActiveQuestionIndex(
        activeQuestionIndex === questionIndex ? null : questionIndex
      );
    }
  };

  //Open delete confirmation dialog
  const handleDeleteClick = (index) => {
    setOpen(true);
    setDeleteIndex(index);
  };
  //confirm article delete
  const handleDialogClose = (confirmDelete) => {
    setOpen(false);

    if (confirmDelete) {
      // Delete the object from local storage and refresh the page
      const panier = JSON.parse(localStorage.getItem("panier")) || [];
      panier.splice(deleteIndex, 1);
      localStorage.setItem("panier", JSON.stringify(panier));
      window.location.reload();
    }
  };

  return (
    <Container>
      <ContentWithPaddingXl>
        <Column>
          <FAQSContainer>
            {faqs.map((faq, index) => (
              <FAQ key={index} className="group">
                <Question
                  onClick={handleClick(index)}
                  open={activeQuestionIndex === index}
                >
                  <QuestionText>
                    <Q>Description de l'article:</Q> {faq.description}
                  </QuestionText>
                  <QuestionToggleIcon
                    variants={{
                      collapsed: { rotate: 0 },
                      open: { rotate: -180 },
                    }}
                    initial="collapsed"
                    animate={
                      activeQuestionIndex === index ? "open" : "collapsed"
                    }
                    transition={{
                      duration: 0.02,
                      ease: [0.04, 0.62, 0.23, 0.98],
                    }}
                  >
                    <ChevronDownIcon />
                  </QuestionToggleIcon>
                </Question>
                <Answer
                  variants={{
                    open: { opacity: 1, height: "auto", marginTop: "16px" },
                    collapsed: { opacity: 0, height: 0, marginTop: "0px" },
                  }}
                  initial="collapsed"
                  animate={activeQuestionIndex === index ? "open" : "collapsed"}
                  transition={{ duration: 0.3, ease: [0.04, 0.62, 0.23, 0.98] }}
                >
                  <P>Numéro du fournisseur:</P> {faq.numFrounisseur}
                </Answer>
                <Answer
                  variants={{
                    open: { opacity: 1, height: "auto", marginTop: "16px" },
                    collapsed: { opacity: 0, height: 0, marginTop: "0px" },
                  }}
                  initial="collapsed"
                  animate={activeQuestionIndex === index ? "open" : "collapsed"}
                  transition={{ duration: 0.3, ease: [0.04, 0.62, 0.23, 0.98] }}
                >
                  <P>Numéro du gamme:</P> {faq.numGamme}
                </Answer>
                <Answer
                  variants={{
                    open: { opacity: 1, height: "auto", marginTop: "16px" },
                    collapsed: { opacity: 0, height: 0, marginTop: "0px" },
                  }}
                  initial="collapsed"
                  animate={activeQuestionIndex === index ? "open" : "collapsed"}
                  transition={{ duration: 0.3, ease: [0.04, 0.62, 0.23, 0.98] }}
                >
                  <P>Prix Unitaire:</P> {faq.prixUni}
                </Answer>

                <Answer
                  variants={{
                    open: { opacity: 1, height: "auto", marginTop: "16px" },
                    collapsed: { opacity: 0, height: 0, marginTop: "0px" },
                  }}
                  initial="collapsed"
                  animate={activeQuestionIndex === index ? "open" : "collapsed"}
                  transition={{ duration: 0.3, ease: [0.04, 0.62, 0.23, 0.98] }}
                ></Answer>
                <Tooltip title="Retirer l'article du panier">
                  <IconButton
                    variant="outlined"
                    color="error"
                    onClick={(event) => {
                      event.stopPropagation();
                      handleDeleteClick(index);
                    }}
                  >
                    <DeleteIcon />
                  </IconButton>
                </Tooltip>
              </FAQ>
            ))}
            <HeadingTitle>
              <>
                Prix Total: <span tw="text-primary-500">{cartTotalPrice}</span>{" "}
              </>
              <br></br>
              <Button color="primary" variant="contained" endIcon={<AddShoppingCartIcon />}>
                Confirmer Panier
              </Button>
            </HeadingTitle>
          </FAQSContainer>
        </Column>
      </ContentWithPaddingXl>
      <DecoratorBlob1 />
      <DecoratorBlob2 />
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
            backgroundColor: "#F9FAFB",
            color: "#1F2937",
            fontWeight: "bold",
            fontSize: "1.25rem",
          }}
        >
          {"Confirmer suppression d'article"}
        </DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-description">
            Veuillez confirmer votre choix de suprression de l'article ?
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button
            onClick={() => handleDialogClose(false)}
            variant="outlined"
            color="primary"
          >
            Annuler
          </Button>
          <Button
            onClick={() => handleDialogClose(true)}
            variant="outlined"
            color="secondary"
            autoFocus
          >
            Suprrimer
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
};
