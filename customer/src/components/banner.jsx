import '../App.css'
import Banner_Image from '/Images/nurse-banner.png'
import Right_Icon from '/Images/right-Icon.svg'
import WhatsApp_Icon from '/Images/whatsapp-icon.svg'
import Phone_Icon from '/Images/phone-icon.svg'

const Banner = () => {
    return (
        <div className="banner">
            <div className="bannerImage">
                <img src={Banner_Image} width="100%" />
            </div>
            <div className="main-content">
                <div className="container">
                    <div className="row">
                        <div className="col-9"></div>
                        <div className="col-3">
                            <div className="mt-5 pt-5">
                                <p className="bannerText mt-5 pt-5">
                                    Your All-in-One Platform for Booking <br /><br /><span className="bannerTextTail">Delivered Right
                                            to Your Doorstep.</span>
                                </p>
                            </div>
                            <div>
                                <a href="#" className="t1"  style={{ textDecoration: 'none' }}>
                                    <button className="button-1 d-flex align-items-center gap-2
                                     justify-content-center">
                                        Browse for More <img className="icon-2" src={Right_Icon} width="100%" />
                                    </button>
                                </a>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Banner;