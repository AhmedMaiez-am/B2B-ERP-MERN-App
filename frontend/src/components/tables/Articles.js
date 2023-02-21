import * as React from 'react';
import { DataGrid } from '@mui/x-data-grid';
import axios from "axios";

export default () => {

   const [data, setData] = React.useState([]);

   React.useEffect(() => {
    const fetchData = async () => {
      try {
        const {data:response} = await axios.get('/articles/get') 
        setData(response)
      } 
      catch (error) {
        console.log(error);
      }
    }
    fetchData();
  }, []);

const columns = [
  { field: 'id', headerName: 'Numéro', width: 100 },
  { field: 'description', headerName: 'Description', width: 230 },
  { field: 'numFrounisseur', headerName: 'Numéro Fournisseur', width: 230 },
  {
    field: 'numGamme',
    headerName: 'Numéro Gamme',
    width: 130,
  },
  {
    field: 'prixUni',
    headerName: 'Prix Unitaire',
    type: 'number',
    width: 130,
  },
  {
    field: 'stocks',
    headerName: 'Quantité Stock',
    type: 'number',
    width: 130,
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
  };
});


  return (
    <div style={{ height: 400, width: '100%' }}>
      <DataGrid
        rows={rows}
        columns={columns}
        pageSize={5}
        rowsPerPageOptions={[5]}
        checkboxSelection
      />
    </div>
  );
}