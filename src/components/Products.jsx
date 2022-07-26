import React, { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import '../App.css'
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';


export default function Products() {
    const [products, setProducts] = useState([]);

    const notify = () => toast.success('Product Deleted !', {
        hideProgressBar: true,
        autoClose: 1000,
    });

    useEffect(() => {
        getProducts();
    }, [])

    const getProducts = async () => {
        let result = await fetch('http://localhost:5000/products', {
            headers: {
                authorization: JSON.stringify(localStorage.getItem('token'))
            }
        });
        result = await result.json();
        setProducts(result);
    }

    const deleteProduct = async (id) => {
        const isdelete = window.confirm("do you really want to delete this product?");

        if (isdelete) {
            let result = await fetch(`http://localhost:5000/product/${id}`, {
                method: 'Delete'
            })
            result = await result.json()

            if (result) {
                notify();
                getProducts();
            }
        }

    }

    const searchHandler = async (event) => {
        let key = event.target.value;
        if (key) {
            let result = await fetch(`http://localhost:5000/search/${key}`)
            result = await result.json();
            if (result) {
                setProducts(result)
            }
        } else {
            getProducts();
        }
    }

    return (
        <div className='products'>
            <h2 style={{ 'textAlign': 'center' }}>Products List</h2>

            <div className="product-list">
                <input type="text" className='product-search-box' placeholder='Search Product'
                    onChange={(e) => searchHandler(e)} />
                <ul style={{ 'fontWeight': 'bold' }}>
                    <li>S No.</li>
                    <li>Name</li>
                    <li>Price</li>
                    <li>Category</li>
                    <li>Operation</li>
                </ul>
                {
                    products.length > 0 ? products.map((product, index) =>
                        <ul key={product._id}>
                            <li>{index + 1}</li>
                            <li>{product.name} </li>
                            <li>${product.price} </li>
                            <li>{product.category} </li>
                            <li>
                                <button className='delete-button' title='Delete product' onClick={() => deleteProduct(product._id)}>Delete</button>
                                <Link to={`/update/${product._id}`} ><button className='update-button' >Update</button></Link>
                            </li>
                        </ul>
                    )
                        :
                        <h1>No Result Found</h1>
                }

            </div>
            <ToastContainer />
        </div>
    )
}
