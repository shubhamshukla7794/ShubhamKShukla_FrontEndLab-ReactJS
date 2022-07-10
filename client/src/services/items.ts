import axios from 'axios';
import IItem from '../models/IItem';

const baseURL = process.env.REACT_APP_BASE_URL;

const getItems = async () => {
    const response = await axios.get<IItem[]>(
        `${baseURL}/items`
    );
    return response.data;
}

export {
    getItems
};