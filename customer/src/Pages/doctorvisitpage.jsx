import { usePostMethod } from "../components/postMethod";
import '../App.css'
import Header from "../components/header";
import Footer from "../components/footer";
import { Link } from "react-router-dom";

function DoctorVisit() {

    const data = usePostMethod();

    return (
        <>
            <Header />
            {console.log(data)}
            <div className="cards">
                <div className="container d-flex gap-4 pt-5 pb-5 flex-wrap justify-content-center bg- red">
                    {
                        data.map((item) => (
                            <div className="card rounded-3" style={{ width: '18rem' }} key={item._id}>
                                <Link to='#' style={{ textDecoration: 'none' }}>
                                    <img src={item.media.image.path} className="card-img-top" />
                                    <div className="card-body align-items-center justify-content-center">
                                        <h5 className="card-title text-center">{item.name.en}</h5>
                                        <p className="card-text text-center">AED</p>
                                        <div className="t1">
                                            <button className="button-1 d-flex align-items-center 
                                               justify-content-center">
                                                Book Now
                                            </button>
                                        </div>
                                    </div>
                                </Link>
                            </div>
                        ))}
                </div>
            </div >
            <Footer />
        </>
    )
}

export default DoctorVisit;
