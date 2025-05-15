import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import NavBar from './components/NavBar';
import CategoryList from './components/CategoryList';
import SubcategoryList from './components/SubcategoryList';
import './App.css';
import AddProduct from './components/AddProduct';
import AllProductData from './components/AllProductData';
import UsersPage from './components/UserPage';
import CartsPage from './components/CartsPage';
import OrdersPage from './components/OrdersPage';


export default function App() {
  return (
    <div>
      <NavBar />
      <Routes>
        <Route path="/" element={<Navigate to="/categories" replace />} />
        <Route path="/categories" element={<CategoryList />} />
        <Route path="/categories/:catId" element={<SubcategoryList />} />
        <Route path="/add-product" element={<AddProduct />} />
        <Route path="/all-data" element={<AllProductData />} />
        <Route path="/users" element={<UsersPage />} />
        <Route path="/carts" element={<CartsPage />} />
        <Route path="/orders" element={<OrdersPage />} />
      </Routes>
    </div>
  );
}
