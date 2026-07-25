import React from "react";
import { Link } from 'react-router-dom'
import '../App.css'
import Header from "../components/header";
import Footer from "../components/footer";
import Banner from "../components/banner";

const Home = () => {
    return (
        <>
            <Header />
            <Banner />
            <Footer />
        </>
    )
}

export default Home;
