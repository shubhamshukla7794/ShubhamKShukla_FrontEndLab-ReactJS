import { useState, useEffect } from "react";
import { getItems } from "../services/items";


const ExpenseTracker = () => {

  const [ items, setItems ] = useState([]);
  const [ error, setError ] = useState([]);
  const [ loading, setLoading ] = useState([]);

  useEffect( () => {
    const fetchItems = async () => {
        const items = await getItems();
        console.log( items );
    }     

    fetchItems();
  }, [] );

    return (
        <div>
            Expense Tracker Works
        </div>
    );
}

export default ExpenseTracker;