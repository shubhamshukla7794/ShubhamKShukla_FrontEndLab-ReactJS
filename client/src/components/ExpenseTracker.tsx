import { useState, useEffect, useRef, FormEvent } from "react";
import {Container, Spinner, Alert, Table, Button, Modal, Form } from 'react-bootstrap';
import IItem from "../models/IItem";
import { addItem, getItems } from "../services/items";


const ExpenseTracker = () => {

  const [ items, setItems ] = useState<IItem[]>([] as IItem[]);
  const [ error, setError ] = useState<Error | null>( null );
  const [ loading, setLoading ] = useState<boolean>( true );
  const [show, setShow] = useState(false);

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


  const totalByPayee = ( payee:string) => {

    let total = 0;

    for(let i = 0; i < items.length; i++) {
        if ( items[i].payeeName === payee ) {
            total += items[i].price;
        }
    }

    return total;
  };


  const differncePayment = () => {
    let difference = 0;
    let rahulAmt = 0;
    let rameshAmt = 0;
    let payee = '';

    for(let i = 0; i < items.length; i++) {
        if (items[i].payeeName === 'Rahul') {
            rahulAmt += items[i].price;
        } else {
            rameshAmt += items[i].price;
        }
    }

    if (rahulAmt > rameshAmt) {
        difference = (rahulAmt - rameshAmt) / 2 ;
        payee = 'Ramesh'
    } else {
        difference = (rameshAmt - rahulAmt) / 2 ;
        payee = 'Rahul'
    }
        return { difference , payee};
  };

  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);

  const payeeNameRef = useRef<HTMLSelectElement>( null );
  const productRef = useRef<HTMLInputElement>( null );
  const priceRef = useRef<HTMLInputElement>( null );

  const addExpense = async ( event : FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const expense = {
        payeeName: payeeNameRef?.current?.value as string,
        product: productRef?.current?.value as string,
        price: parseFloat(priceRef?.current?.value as string) as number,
        setDate: ((new Date()).toISOString().substring(0,10)) as string
    } as Omit<IItem, 'id'>;

    const updatedItem = await addItem( expense );
    console.log ( updatedItem);

    handleClose();

  };

    return (
        <Container className="my-4">
        <h1>
            Expense Tracker
            <Button variant="primary" onClick={handleShow}className="float-end">Add Expense</Button>
        </h1>

        <Modal show={show} onHide={handleClose}>
            <Modal.Header closeButton>
                <Modal.Title>Add an expense</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <Form onSubmit={addExpense}>
                    <Form.Group className="mb-3" controlId="payeeName">
                        <Form.Label>Who Paid?</Form.Label>
                        <Form.Select aria-label="Payee name" ref={payeeNameRef}>
                            <option>--Select payee--</option>
                            <option value="Rahul">Rahul</option>
                            <option value="Ramesh">Ramesh</option>
                        </Form.Select>
                    </Form.Group>

                    <Form.Group className="mb-3" controlId="product">
                        <Form.Label>What for?</Form.Label>
                        <Form.Control type="text" placeholder="Enter decription" ref={productRef} />
                    </Form.Group>

                    <Form.Group className="mb-3" controlId="price">
                        <Form.Label>How Much?</Form.Label>
                        <Form.Control type="number" min="0" ref={priceRef} />
                    </Form.Group>

                    <Button variant="secondary" onClick={handleClose}>Close</Button>
                    <Button variant="primary" type="submit">Add Expense</Button>
                </Form>
            </Modal.Body>
      </Modal>
        
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
<Table striped bordered hover>
      <thead>
        <tr>
          <th>Sr. No.</th>
          <th>Payee</th>
          <th>Description</th>
          <th>Date</th>
          <th className="text-end">Amount</th>
        </tr>
      </thead>
      <tbody>
                {
                    items.map (
                        (item, idx) => (
                            <tr key={item.id}>
                                <td>{idx +1}</td>
                                <td>{item.payeeName}</td>
                                <td>{item.product}</td>
                                <td>{item.setDate}</td>
                                <td className="font-monospace text-end">&#8377;{item.price}</td>
                            </tr>
                        )
                    )
                }
                <tr>
                    <td colSpan={4} className="text-end"><strong>Rahul Paid</strong></td>
                    <td className="font-monospace text-end"><strong>&#8377;{totalByPayee('Rahul')}</strong></td>
                </tr>
                <tr>
                    <td colSpan={4} className="text-end"><strong>Ramesh Paid</strong></td>
                    <td className="font-monospace text-end"><strong>&#8377;{totalByPayee('Ramesh')}</strong></td>
                </tr>
                <tr>
                    <td colSpan={4} className="text-end"><strong>{differncePayment().payee} has to pay </strong></td>
                    <td className="font-monospace text-end"><strong>&#8377;{differncePayment().difference.toFixed(2)}</strong></td>
                </tr>
                </tbody>
            </Table>
            )
        }
        </Container>
    );
}

export default ExpenseTracker;