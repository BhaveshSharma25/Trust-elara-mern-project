import { Routes, Route } from "react-router-dom";
import DoctorVisit from '../Pages/doctorvisitpage';
import Home from '../Pages/home';
import CustomerLogin from '../Pages/CustomerLogin';
import CustomerRegister from '../Pages/CustomerRegister';
import ServiceListing from '../Pages/ServiceListing';
import ServiceDetail from '../Pages/ServiceDetail';
import Cart from '../Pages/Cart';
import Checkout from '../Pages/Checkout';
import CategoryServices from '../Pages/CategoryServices';
import MyOrders from '../Pages/MyOrders';
import Profile from '../Pages/Profile';
import Categories from '../Pages/Categories';

function Routing() {
    return (
        <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/services/doctor-visit" element={<DoctorVisit />} />
            <Route path="/login" element={<CustomerLogin />} />
            <Route path="/register" element={<CustomerRegister />} />
            <Route path="/all-services" element={<ServiceListing />} />
            <Route path="/services/:id" element={<ServiceDetail />} />
            <Route path="/cart" element={<Cart />} />
            <Route path="/checkout" element={<Checkout />} />
            <Route path="/category/:id" element={<CategoryServices />} />
            <Route path="/categories" element={<Categories />} />
            <Route path="/my-orders" element={<MyOrders />} />
            <Route path="/profile" element={<Profile />} />
        </Routes>
    );
}

export default Routing;
