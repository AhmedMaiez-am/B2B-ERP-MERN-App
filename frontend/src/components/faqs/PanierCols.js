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
import InventoryOutlinedIcon from "@mui/icons-material/InventoryOutlined";
import FolderDeleteOutlinedIcon from "@mui/icons-material/FolderDeleteOutlined";
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
import SyncProblemOutlinedIcon from "@mui/icons-material/SyncProblemOutlined";
import FactCheckOutlinedIcon from "@mui/icons-material/FactCheckOutlined";
import BlockOutlinedIcon from "@mui/icons-material/BlockOutlined";
import DeleteForeverOutlinedIcon from "@mui/icons-material/DeleteForeverOutlined";
import InfoOutlinedIcon from '@mui/icons-material/InfoOutlined';
import useMediaQuery from "@mui/material/useMediaQuery";
import { useTheme } from "@mui/material/styles";
import axios from "axios";
import { useHistory } from "react-router-dom";

const Form = tw.form`mx-auto max-w-xs`;
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
const Actions = styled.div`
  ${tw`relative max-w-md text-center mx-auto lg:mx-0`}
  input {
    ${tw`sm:pr-40 pl-4 py-2 sm:py-3 rounded-full border-2 w-full font-medium text-sm focus:outline-none transition duration-300 focus:border-primary-500 hover:border-gray-500`}
  }
  button {
    ${tw`w-full sm:absolute right-0 top-0 bottom-0 bg-primary-500 text-gray-100 font-bold mr-2 my-3 sm:my-2 rounded-full py-3 flex items-center justify-center sm:w-2/5 sm:leading-none focus:outline-none hover:bg-primary-900 transition duration-300`}
  }
`;

const Actions1 = styled.div`
  ${tw`relative max-w-md text-center mx-auto lg:mx-0`}
  input {
    ${tw`sm:pr-40 pl-4 py-2 sm:py-3 rounded-full border-2 w-full font-medium focus:outline-none transition duration-300  focus:border-primary-500 hover:border-gray-500`}
  }
`;

export default () => {
  const [activeQuestionIndex, setActiveQuestionIndex] = useState(null);
  const theme = useTheme();
  const fullScreen = useMediaQuery(theme.breakpoints.down("md"));
  const [open, setOpen] = React.useState(false);
  const [open1, setOpen1] = React.useState(false);
  const [open2, setOpen2] = React.useState(false);
  const [open3, setOpen3] = React.useState(false);
  const [open4, setOpen4] = React.useState(false);
  const [open5, setOpen5] = React.useState(false);
  const [deleteIndex, setDeleteIndex] = useState(null);
  const [newMagasin, setNewMagasin] = useState(null);
  const [maxQtePerLocationText, setMaxQtePerLocationText] = useState("");
  const [maxQtePerLocationNumber, setMaxQtePerLocationNumber] = useState(0);


  const [data, setData] = React.useState([]);
  const history = useHistory();

  //Retrieve cart from local Storage
  React.useEffect(() => {
    const panier = JSON.parse(sessionStorage.getItem("panier"));
    setData(panier || []);
  }, []);

  //calculate articles total price
  const cartTotalPrice = data.reduce((total, item) => {
    return total + item.prixUni;
  }, 0);

  //emptyCartDialog
  const handleDeleteCartDialog = () => {
    setOpen4(true);
  };
  //empty cart
  const handleDeleteCart = () => {
    sessionStorage.removeItem("panier");
    window.location.reload();
  };
  //populate faqs with data from local storage to pass it into return
  const faqs = data.map((panier) => {
    return {
      id: panier.id,
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
      const panier = JSON.parse(sessionStorage.getItem("panier")) || [];
      panier.splice(deleteIndex, 1);
      sessionStorage.setItem("panier", JSON.stringify(panier));
      window.location.reload();
    }
  };

  //check stock
  const handleDeleteClick1 = (index, inputValues) => {
    const stockValue = data[index].stocks;
    const inputValue = inputValues[index]?.value;
    if (inputValues.length === 0) {
      setOpen3(true);
    } else {
      if (inputValue && inputValue <= stockValue) {
        setOpen2(true);
      } else {
        setOpen1(true);
      }
    }
    setInputValues([]);
  };
  //confirm unavailable article delete
  const handleDialogClose1 = () => {
    setOpen1(false);
  };

  //confirm unavailable article delete
  const handleDialogClose2 = () => {
    setOpen2(false);
  };

  //insert quantity warning
  const handleDialogClose3 = () => {
    setOpen3(false);
  };

  //empty cart dialog
  const handleDialogClose4 = () => {
    setOpen4(false);
  };

  //max quantity by location
  const handleDialogClose5 = () => {
    setOpen5(false);
  };

  //quantité disponible dans un autre magasin modal
  const handleOpenQteDispoAutreMagasin = (newMagasin) => {
    setOpen1(true);
    console.log(newMagasin);
  };

  //quantité maximale disponible par magasin
  const handleOpenMaxQtePerLocation = (text, number) => {
    setOpen5(true);
    setMaxQtePerLocationText(text);
    setMaxQtePerLocationNumber(parseInt(number));
  };

  const [inputValues, setInputValues] = useState([]);

  //search variables
  const [filteredResults, setFilteredResults] = useState([]);
  const [searchInput, setSearchInput] = useState("");

  ///////Filter list by search value//////////////
  const searchItems = (searchValue) => {
    setSearchInput(searchValue);
    if (searchInput !== "") {
      const filteredData = data.filter((item) => {
        return Object.values(item)
          .join("")
          .toLowerCase()
          .includes(searchInput.toLowerCase());
      });
      setFilteredResults(filteredData);
    } else {
      setFilteredResults(data);
    }
  };
  const getCurrentUser = () => {
    const userJson = sessionStorage.getItem("user");
    if (userJson) {
      return JSON.parse(userJson);
    }
    return null; // No active user
  };

  // Function to handle the button click event
  const handleButtonClickAddCommande = async () => {
    try {
      // Retrieve cart items from sessionStorage
      const articles = JSON.parse(sessionStorage.getItem("panier"));
      const user = getCurrentUser();

      // Create a new array with updated article objects
      const updatedArticles = articles.map((article, index) => {
        // Retrieve the input value for the corresponding article
        const inputValue = inputValues[index]?.value || "";

        // Create a new article object with the quantity property
        const updatedArticle = {
          ...article,
          quantity: parseInt(inputValue),
        };

        return updatedArticle;
      });
      // Make a POST request to your server's "/add" endpoint using Axios
      const response = await axios.post("/enteteVentes/add", {
        articles: updatedArticles,
        user,
      });
      console.log(response.data); // Display the response from the server
      // Delete "panier" from sessionStorage
      sessionStorage.removeItem("panier");

      // Programmatically redirect to another component
      history.push("/components/Commande");
    } catch (error) {
      console.error("Error:", error);
    }
  };

  // Stock check button handle
  const handleStockCheck = (faq, magasin, quantity) => {
    // Prepare the request data
    const requestData = {
      articleId: faq.id,
      magasin,
      quantity,
    };

    // Make the API call
    axios
      .post("/stocks/getInventory", requestData)
      .then((response) => {
        const { inventory, magasinValide, maxQtePerLocation } = response.data;
        if (inventory) {
          // Option 1: Stock validé dans le magasin choisi
          setOpen2(true);
        } else if (magasinValide) {
          // Option 2: Stock disponible dans un autre magasin
          setNewMagasin(magasinValide);
          handleOpenQteDispoAutreMagasin(newMagasin);
        } else if (maxQtePerLocation) {
          // Option 3: Quantité saisie n'est pas disponible + Proposition du max quantité disponbible
          const maxQtePerLocationString = response.data.maxQtePerLocation;
          const [text, number] = maxQtePerLocationString.split(" - ");
          handleOpenMaxQtePerLocation(text, number);
        } else {
          // Handle any other response options here if needed
          console.log("Unknown stock check response:", response.data);
        }
      })
      .catch((error) => {
        console.error("Stock check error:", error);
        // Handle the error case
      });
  };

  /////////////////////////////////////////////////

  return (
    <Container>
      <ContentWithPaddingXl>
        <Column>
          <FAQSContainer>
            <Actions1>
              <input
                type="text"
                placeholder="Chercher un article"
                onChange={(e) => searchItems(e.target.value)}
              />
            </Actions1>
            {searchInput.length > 1
              ? filteredResults.map((item, index) => {
                  return (
                    <FAQ key={index} className="group">
                      <Question
                        onClick={handleClick(index)}
                        open={activeQuestionIndex === index}
                      >
                        <QuestionText>
                          <Q>Description de l'article:</Q> {item.description}
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
                          open: {
                            opacity: 1,
                            height: "auto",
                            marginTop: "16px",
                          },
                          collapsed: {
                            opacity: 0,
                            height: 0,
                            marginTop: "0px",
                          },
                        }}
                        initial="collapsed"
                        animate={
                          activeQuestionIndex === index ? "open" : "collapsed"
                        }
                        transition={{
                          duration: 0.3,
                          ease: [0.04, 0.62, 0.23, 0.98],
                        }}
                      >
                        <P>Numéro du fournisseur:</P> {item.numFrounisseur}
                      </Answer>
                      <Answer
                        variants={{
                          open: {
                            opacity: 1,
                            height: "auto",
                            marginTop: "16px",
                          },
                          collapsed: {
                            opacity: 0,
                            height: 0,
                            marginTop: "0px",
                          },
                        }}
                        initial="collapsed"
                        animate={
                          activeQuestionIndex === index ? "open" : "collapsed"
                        }
                        transition={{
                          duration: 0.3,
                          ease: [0.04, 0.62, 0.23, 0.98],
                        }}
                      >
                        <P>Numéro du gamme:</P> {item.numGamme}
                      </Answer>
                      <Answer
                        variants={{
                          open: {
                            opacity: 1,
                            height: "auto",
                            marginTop: "16px",
                          },
                          collapsed: {
                            opacity: 0,
                            height: 0,
                            marginTop: "0px",
                          },
                        }}
                        initial="collapsed"
                        animate={
                          activeQuestionIndex === index ? "open" : "collapsed"
                        }
                        transition={{
                          duration: 0.3,
                          ease: [0.04, 0.62, 0.23, 0.98],
                        }}
                      >
                        <P>Prix Unitaire:</P> {item.prixUni}
                      </Answer>
                      <br />
                      <P>Sélectionner un magasin: </P>
                      <select
                        tw="text-gray-900 w-40 py-2 rounded-lg font-medium bg-blue-100 border border-gray-200 placeholder-gray-500 text-sm focus:outline-none focus:border-gray-400 focus:bg-white mt-2 mb-4 first:mt-0"
                        className="magasin"
                        name="magasin"
                      >
                        <option value="" disabled selected>
                          Choisir un magasin
                        </option>
                        <option className="" value="ARGENTE">
                          Argente
                        </option>
                        <option className="" value="BLANC">
                          Blanc
                        </option>
                        <option className="" value="BLEU">
                          Bleu
                        </option>
                        <option className="" value="JAUNE">
                          Jaune
                        </option>
                        <option className="" value="ROUGE">
                          Rouge
                        </option>
                        <option className="" value="VERT">
                          Vert
                        </option>
                      </select>
                      <Actions>
                        <input
                          type="number"
                          placeholder="Quantité désirée"
                          value={inputValues[index]?.value || ""}
                          onChange={(event) => {
                            setInputValues((prevInputValues) => {
                              const newInputValues = [...prevInputValues];
                              newInputValues[index] = {
                                value: event.target.value,
                              };
                              return newInputValues;
                            });
                          }}
                        />
                        <button
                          onClick={(event) => {
                            event.stopPropagation();
                            const selectedMagasin =
                              document.querySelector(".magasin").value;
                            const quantity = inputValues[index]?.value || "";
                            handleStockCheck(item, selectedMagasin, quantity);
                          }}
                        >
                          <InventoryOutlinedIcon /> Vérifier Stock
                        </button>
                      </Actions>
                      <Tooltip title="Retirer l'article du panier">
                        <IconButton
                          variant="outlined"
                          color="error"
                          style={{ color: "#c2111b" }}
                          onClick={(event) => {
                            event.stopPropagation();
                            handleDeleteClick(index);
                          }}
                        >
                          <DeleteIcon />
                        </IconButton>
                      </Tooltip>
                    </FAQ>
                  );
                })
              : faqs.map((faq, index) => {
                  return (
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
                          open: {
                            opacity: 1,
                            height: "auto",
                            marginTop: "16px",
                          },
                          collapsed: {
                            opacity: 0,
                            height: 0,
                            marginTop: "0px",
                          },
                        }}
                        initial="collapsed"
                        animate={
                          activeQuestionIndex === index ? "open" : "collapsed"
                        }
                        transition={{
                          duration: 0.3,
                          ease: [0.04, 0.62, 0.23, 0.98],
                        }}
                      >
                        <P>Numéro du fournisseur:</P> {faq.numFrounisseur}
                      </Answer>
                      <Answer
                        variants={{
                          open: {
                            opacity: 1,
                            height: "auto",
                            marginTop: "16px",
                          },
                          collapsed: {
                            opacity: 0,
                            height: 0,
                            marginTop: "0px",
                          },
                        }}
                        initial="collapsed"
                        animate={
                          activeQuestionIndex === index ? "open" : "collapsed"
                        }
                        transition={{
                          duration: 0.3,
                          ease: [0.04, 0.62, 0.23, 0.98],
                        }}
                      >
                        <P>Numéro du gamme:</P> {faq.numGamme}
                      </Answer>
                      <Answer
                        variants={{
                          open: {
                            opacity: 1,
                            height: "auto",
                            marginTop: "16px",
                          },
                          collapsed: {
                            opacity: 0,
                            height: 0,
                            marginTop: "0px",
                          },
                        }}
                        initial="collapsed"
                        animate={
                          activeQuestionIndex === index ? "open" : "collapsed"
                        }
                        transition={{
                          duration: 0.3,
                          ease: [0.04, 0.62, 0.23, 0.98],
                        }}
                      >
                        <P>Prix Unitaire:</P> {faq.prixUni}
                      </Answer>
                      <br />
                      <P>Sélectionner un magasin: </P>
                      <select
                        tw="text-gray-900 w-40 py-2 rounded-lg font-medium bg-blue-100 border border-gray-200 placeholder-gray-500 text-sm focus:outline-none focus:border-gray-400 focus:bg-white mt-2 mb-4 first:mt-0"
                        className="magasin"
                        name="magasin"
                      >
                        <option value="" disabled selected>
                          Choisir un magasin
                        </option>
                        <option className="" value="ARGENTE">
                          Argente
                        </option>
                        <option className="" value="BLANC">
                          Blanc
                        </option>
                        <option className="" value="BLEU">
                          Bleu
                        </option>
                        <option className="" value="JAUNE">
                          Jaune
                        </option>
                        <option className="" value="ROUGE">
                          Rouge
                        </option>
                        <option className="" value="VERT">
                          Vert
                        </option>
                      </select>
                      <Actions>
                        <input
                          type="number"
                          placeholder="Quantité désirée"
                          value={inputValues[index]?.value || ""}
                          onChange={(event) => {
                            setInputValues((prevInputValues) => {
                              const newInputValues = [...prevInputValues];
                              newInputValues[index] = {
                                value: event.target.value,
                              };
                              return newInputValues;
                            });
                          }}
                        />
                        <button
                          onClick={(event) => {
                            event.stopPropagation();
                            const selectedMagasin =
                              document.querySelector(".magasin").value;
                            const quantity = inputValues[index]?.value || "";
                            handleStockCheck(faq, selectedMagasin, quantity);
                          }}
                        >
                          <InventoryOutlinedIcon /> Vérifier Stock
                        </button>
                      </Actions>
                      <Tooltip title="Retirer l'article du panier">
                        <IconButton
                          variant="outlined"
                          color="error"
                          style={{ color: "#c2111b" }}
                          onClick={(event) => {
                            event.stopPropagation();
                            handleDeleteClick(index);
                          }}
                        >
                          <DeleteIcon />
                        </IconButton>
                      </Tooltip>
                    </FAQ>
                  );
                })}
            <HeadingTitle>
              <>
                Prix Total: <span tw="text-primary-500">{cartTotalPrice}</span>{" "}
              </>
              <br></br>
              <Button
                color="primary"
                variant="contained"
                style={{ borderRadius: "50px" }}
                endIcon={<AddShoppingCartIcon />}
                onClick={handleButtonClickAddCommande}
              >
                Confirmer Panier
              </Button>
              <br />
              <Button
                onClick={() => handleDeleteCartDialog()}
                variant="contained"
                color="secondary"
                style={{ borderRadius: "50px" }}
                endIcon={<DeleteForeverOutlinedIcon />}
              >
                Vider Panier
              </Button>
            </HeadingTitle>
          </FAQSContainer>
        </Column>
      </ContentWithPaddingXl>
      <DecoratorBlob1 />
      <DecoratorBlob2 />

      {/* delete article dialog  */}
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
            style={{ borderRadius: "50px" }}
          >
            Annuler
          </Button>
          <Button
            onClick={() => handleDialogClose(true)}
            variant="outlined"
            color="secondary"
            style={{ borderRadius: "50px" }}
          >
            Suprrimer
          </Button>
        </DialogActions>
      </Dialog>

      {/* quantity available in another location dialog */}
      <Dialog
        fullScreen={fullScreen}
        open={open1}
        onClose={() => handleDialogClose1(false)}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle
          id="alert-dialog-title"
          style={{
            backgroundColor: "#e7e8fd",
            color: "#2c2c9b",
            fontWeight: "bold",
            fontSize: "1.25rem",
            borderRadius: "10px 10px 0px 0px",
            padding: "1rem",
          }}
        >
          <InfoOutlinedIcon />
          &nbsp;
          {"Quantité insérée n'est pas disponible"}
        </DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-description">
            La quantité insérée pour cet article n'est plus disponible dans le
            magasin choisi, elle est disponible dans le{"(s)"} magasin{" "}
            <strong>{newMagasin}</strong><br/>
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button
            onClick={() => handleDialogClose1(false)}
            variant="outlined"
            color="primary"
            style={{
              backgroundColor: "#4543a0",
              color: "#FFFFFF",
              borderRadius: "50px",
            }}
          >
            Changer Choix
          </Button>
        </DialogActions>
      </Dialog>

      {/* max quantity available by location */}
      <Dialog
        fullScreen={fullScreen}
        open={open5}
        onClose={() => handleDialogClose5(false)}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle
          id="alert-dialog-title"
          style={{
            backgroundColor: "#fdfde7",
            color: "#9b972c",
            fontWeight: "bold",
            fontSize: "1.25rem",
            borderRadius: "10px 10px 0px 0px",
            padding: "1rem",
          }}
        >
          <InfoOutlinedIcon />
          &nbsp;
          {"Quantité insérée n'est pas disponible dans tous les magasins"}
        </DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-description">
            La quantité saisie n'est pas disponible. La quantité maximale de cet article est
            disponible dans le magasin <strong>{maxQtePerLocationText}</strong> contenant{" "}
            <strong>{maxQtePerLocationNumber}</strong>.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button
            onClick={() => handleDialogClose5(false)}
            variant="outlined"
            style={{
              backgroundColor: "#a06b43",
              color: "#FFFFFF",
              borderRadius: "50px",
            }}
          >
            Changer Choix
          </Button>
        </DialogActions>
      </Dialog>

      {/* stock verification success dialog */}
      <Dialog
        fullScreen={fullScreen}
        open={open2}
        onClose={() => handleDialogClose2(false)}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle
          id="alert-dialog-title"
          style={{
            backgroundColor: "#ebfde7",
            color: "#4f9b2c",
            fontWeight: "bold",
            fontSize: "1.25rem",
            borderRadius: "10px 10px 0px 0px",
            padding: "1rem",
          }}
        >
          <FactCheckOutlinedIcon />
          &nbsp;
          {"Article validé en stock"}
        </DialogTitle>
        <DialogContent style={{ borderRadius: "20px" }}>
          <DialogContentText
            id="alert-dialog-description"
            style={{ color: "#4F4F4F" }}
          >
            La quantité insérée est disponible en stock.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button
            onClick={() => handleDialogClose2(false)}
            variant="contained"
            color="primary"
            style={{
              backgroundColor: "#43A047",
              color: "#FFFFFF",
              borderRadius: "50px",
            }}
          >
            Continuer
          </Button>
        </DialogActions>
      </Dialog>

      {/* user forgot to insert quantity warning */}
      <Dialog
        fullScreen={fullScreen}
        open={open3}
        onClose={() => handleDialogClose3(false)}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle
          id="alert-dialog-title"
          style={{
            backgroundColor: "#fdfde7",
            color: "#9b9b2c",
            fontWeight: "bold",
            fontSize: "1.25rem",
            borderRadius: "10px 10px 0px 0px",
            padding: "1rem",
          }}
        >
          <SyncProblemOutlinedIcon /> &nbsp;
          {"Veuillez indiquer la quatité"}
        </DialogTitle>
        <DialogContent style={{ borderRadius: "20px" }}>
          <DialogContentText
            id="alert-dialog-description"
            style={{ color: "#4F4F4F" }}
          >
            Veuillez insérer la quantité désirée afin de vérifier si le stock
            est suffisant.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button
            onClick={() => handleDialogClose3(false)}
            variant="contained"
            color="primary"
            style={{
              backgroundColor: "#98a043",
              color: "#FFFFFF",
              borderRadius: "50px",
            }}
          >
            OK
          </Button>
        </DialogActions>
      </Dialog>

      {/* empty cart confirmation dialog */}
      {/* user forgot to insert quantity warning */}
      <Dialog
        fullScreen={fullScreen}
        open={open4}
        onClose={() => handleDialogClose4(false)}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle
          id="alert-dialog-title"
          style={{
            backgroundColor: "#fde7e7",
            color: "#9b2c33",
            fontWeight: "bold",
            fontSize: "1.25rem",
            borderRadius: "10px 10px 0px 0px",
            padding: "1rem",
          }}
        >
          <FolderDeleteOutlinedIcon /> &nbsp;
          {"Confirmer la suppression des articles"}
        </DialogTitle>
        <DialogContent style={{ borderRadius: "20px" }}>
          <DialogContentText
            id="alert-dialog-description"
            style={{ color: "#4F4F4F" }}
          >
            Voulez vous supprimer tous les articles dans votre panier?
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button
            onClick={() => handleDialogClose4(false)}
            variant="contained"
            color="primary"
            style={{
              backgroundColor: "#438fa0",
              color: "#FFFFFF",
              borderRadius: "50px",
            }}
          >
            Non
          </Button>
          <Button
            onClick={() => handleDeleteCart()}
            variant="contained"
            color="secondary"
            style={{
              backgroundColor: "#de1f29",
              color: "#FFFFFF",
              borderRadius: "50px",
            }}
          >
            Oui
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
};
