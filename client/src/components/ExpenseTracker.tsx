import { useState, useEffect } from "react";
import {Container, Spinner, Alert } from 'react-bootstrap';
import IItem from "../models/IItem";
import { getItems } from "../services/items";


const ExpenseTracker = () => {

  const [ items, setItems ] = useState<IItem[]>([] as IItem[]);
  const [ error, setError ] = useState<Error | null>( null );
  const [ loading, setLoading ] = useState<boolean>( true );

  useEffect( () => {
    const fetchItems = async () => {
        try{
            const items = await getItems();
            setItems( items );
        } catch ( error ) {
            setError( error as Error);
        } finally {
            setLoading( false );
        }
    }     

    fetchItems();
  }, [] );

    return (
        <Container>
        <h1>Expense Tracker</h1>
        {
            loading && (
                <div className="d-flex justify-content-center">
                    <Spinner animation="border" role="status">
                        <span className="visually-hidden">Loading...</span>
                    </Spinner>
                </div>
            )
        }
        {
            !loading && error && (
                <Alert variant="danger">{error.message}</Alert>
            )
        } 
        {
            !loading && !error && (
                items.map (
                    item => (
                        <div key={item.id}>{item.payeeName} - {item.product}</div>
                    )
                )
            )
        }
        </Container>
    );
}

export default ExpenseTracker;