import * as React from "react";
import { DataGrid } from "@mui/x-data-grid";
import tw from "twin.macro";
import axios from "axios";
import { ReactComponent as SvgDotPatternIcon } from "../../images/dot-pattern.svg";
import { SectionHeading as HeadingTitle } from "../misc/Headings.js";

import Alert from "@mui/material/Alert";
import Button from "@mui/material/Button";
import AddShoppingCartIcon from "@mui/icons-material/AddShoppingCart";
import { styled } from "@mui/material/styles";
import { blue } from "@mui/material/colors";
import { Snackbar, IconButton } from "@material-ui/core";
import { Close as CloseIcon } from "@material-ui/icons";

const Container = tw.div`relative`;

const SingleColumn = tw.div`max-w-screen-xl mx-auto py-20 lg:py-24`;

const HeadingInfoContainer = tw.div`flex flex-col items-center`;

const HeadingDescription = tw.p`mt-4 font-medium text-gray-600 text-center max-w-sm`;
const SvgDotPattern1 = tw(
  SvgDotPatternIcon
)`absolute top-0 left-0 transform -translate-x-20 rotate-90 translate-y-8 -z-10 opacity-25 text-primary-500 fill-current w-24`;
const SvgDotPattern2 = tw(
  SvgDotPatternIcon
)`absolute top-0 right-0 transform translate-x-20 rotate-45 translate-y-24 -z-10 opacity-25 text-primary-500 fill-current w-24`;
const SvgDotPattern3 = tw(
  SvgDotPatternIcon
)`absolute bottom-0 left-0 transform -translate-x-20 rotate-45 -translate-y-8 -z-10 opacity-25 text-primary-500 fill-current w-24`;
const SvgDotPattern4 = tw(
  SvgDotPatternIcon
)`absolute bottom-0 right-0 transform translate-x-20 rotate-90 -translate-y-24 -z-10 opacity-25 text-primary-500 fill-current w-24`;

export default () => {
  const [data, setData] = React.useState([]);
  const [message, setMessage] = React.useState("");
  const [messageErreur, setMessageErreur] = React.useState("");
  const [selectedRow, setSelectedRow] = React.useState(null);
  const [snackbarOpen, setSnackbarOpen] = React.useState(false);
  const [snackbarMessage, setSnackbarMessage] = React.useState("");

  React.useEffect(() => {
    const fetchData = async () => {
      try {
        const { data: response } = await axios.get("/articles/get");
        setData(response);
      } catch (error) {
        console.log(error);
      }
    };
    fetchData();
  }, []);

  const columns = [
    {
      field: "id",
      headerName: "Numéro Article",
      headerClassName: "header-style",
      width: 140,
    },
    {
      field: "description",
      headerName: "Description",
      headerClassName: "header-style",
      width: 210,
    },
    {
      field: "numFrounisseur",
      headerName: "Numéro Fournisseur",
      headerClassName: "header-style",
      width: 180,
    },
    {
      field: "numGamme",
      headerName: "Numéro Gamme",
      headerClassName: "header-style",
      width: 150,
    },
    {
      field: "prixUni",
      headerName: "Prix Unitaire",
      headerClassName: "header-style",
      type: "number",
      width: 140,
    },
    {
      field: "stocks",
      headerName: "Quantité Stock",
      headerClassName: "header-style",
      type: "number",
      width: 140,
    },
    {
      field: "status",
      headerName: "Disponibilité",
      headerClassName: "header-style",
      width: 130,
      renderCell: (params) => (
        <div className={`status ${params.value.toLowerCase()}`}>
          {params.value}
        </div>
      ),
    },
  ];

  const rows = data.map((rowData) => {
    return {
      id: rowData.num,
      description: rowData.description,
      numFrounisseur: rowData.numFrounisseur,
      numGamme: rowData.numGamme,
      prixUni: rowData.prixUni,
      stocks: rowData.stocks,
      status: rowData.isAvailable,
    };
  });
  const containerWidth = 200 + columns.length * 130;

  const handleRowClick = (params) => {
    if (params.row.status === "Disponible") {
      setMessage(` "${params.row.description}" `);
      setMessageErreur(null);
      setSelectedRow(params.row);
    } else {
      setMessageErreur(` "${params.row.description}" `);
      setMessage(null);
    }
  };

  const ColorButton = styled(Button)(({ theme }) => ({
    color: theme.palette.getContrastText(blue[500]),
    backgroundColor: blue[500],
    "&:hover": {
      backgroundColor: blue[800],
    },
  }));

  function handleAddToCart() {
    const cartItems = JSON.parse(localStorage.getItem("panier")) || [];
    cartItems.push(selectedRow);
    localStorage.setItem("panier", JSON.stringify(cartItems));
    setSnackbarMessage(
      `Article "${selectedRow.description}" ajouté au panier avec succés !`
    );
    setSnackbarOpen(true);
  }

  const handleSnackbarClose = () => {
    setSnackbarOpen(false);
  };

  return (
    <Container>
      <SingleColumn>
        <HeadingInfoContainer>
          <HeadingTitle>Liste des articles</HeadingTitle>
          <HeadingDescription>
            Sélectionner la ligne de l'article de choix pour l'ajouter à votre
            panier
          </HeadingDescription>{" "}
          <br />
          <div className="container" style={{ width: containerWidth }}>
            <DataGrid
              rows={rows}
              columns={columns}
              pageSize={10}
              rowsPerPageOptions={[10]}
              autoHeight
              autoWidth
              onRowClick={handleRowClick}
              {...rows}
            />
            {message && (
              <Alert
                variant="outlined"
                severity="info"
                color="info"
                action={
                  <ColorButton
                    variant="outlined"
                    size="small"
                    onClick={handleAddToCart}
                  >
                    <AddShoppingCartIcon />
                    <strong>&nbsp; Ajouter au panier</strong>
                  </ColorButton>
                }
              >
                Article<strong>{message}</strong>sélectionné
              </Alert>
            )}
            {messageErreur && (
              <Alert variant="outlined" severity="warning" color="error">
                Article<strong>{messageErreur}</strong>n'est plus en stock
              </Alert>
            )}

            <Snackbar
              anchorOrigin={{
                vertical: "bottom",
                horizontal: "center",
              }}
              open={snackbarOpen}
              autoHideDuration={3000}
              onClose={handleSnackbarClose}
              message={snackbarMessage}
              style={{ backgroundColor: "#2196f3", color: "#fff" }}
              action={
                <React.Fragment>
                  <IconButton
                    size="small"
                    aria-label="close"
                    color="inherit"
                    onClick={handleSnackbarClose}
                  >
                    <CloseIcon fontSize="small" />
                  </IconButton>
                </React.Fragment>
              }
            />

            <style>
              {`
        
        .header-style {
          background-color: transparent;
          color: #333;
          font-size: 16px;
          font-weight: bold;
          display: flex;
          align-items: center;
          border-bottom: 1px solid #ccc;
        }
        
        .header-style .MuiDataGrid-columnSeparator {
          display: block;
        }
        
        .status {
          display: inline-block;
          padding: 2px 8px;
          border-radius: 8px;
          font-size: 14px;
          font-weight: 600;
          text-align: center;
          text-transform: capitalize;
        }
        
        .epuisé {
          background-color: transparent;
          color: #ff4d4f;
          border: 2px solid #ff4d4f;
        }
        
        .disponible {
          background-color: transparent;
          color: #73d13d;
          border: 2px solid #73d13d;
        }
        
        
        `}
            </style>
          </div>
        </HeadingInfoContainer>
      </SingleColumn>
      <SvgDotPattern1 />
      <SvgDotPattern2 />
      <SvgDotPattern3 />
      <SvgDotPattern4 />
    </Container>
  );
};
