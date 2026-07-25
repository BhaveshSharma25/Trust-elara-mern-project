import 'bootstrap/dist/css/bootstrap.min.css';

function Footer() {
    return (
        <>
            <div className="footer">
                <div className="container">
                    <div className="footerContents">
                        <div className='footerTable'>
                            <div className='footerContact'>
                                <h2>Elara Health</h2>
                                <a className='footerLink' href='#' >support@teustelara.com</a>
                            </div>
                            <div className='footerServices'>
                                <h6> Services Categories </h6>
                                <ul className='footerLinks list-unstyled'>
                                    <li><a className='footerLink' href='#'> Doctor Visit </a></li>
                                    <li><a className='footerLink' href='#'> Physiotherapy </a></li>
                                    <li><a className='footerLink' href='#'> IV Therapy</a></li>
                                    <li><a className='footerLink' href='#'> Lab Tests</a></li>
                                    <li><a className='footerLink' href='#'> Health Care</a></li>
                                    <li><a className='footerLink' href='#'> Browse all categories</a></li>
                                </ul>
                            </div>
                            <div className='footerPages'>
                                <h6> Pages </h6>
                                <ul className='footerLinks list-unstyled'>
                                    <li><a className='footerLink' href='#'> About Us </a></li>
                                    <li><a className='footerLink' href='#'> Contact Us </a></li>
                                    <li><a className='footerLink' href='#'> Help & Support</a></li>
                                    <li><a className='footerLink' href='#'> Cancellation and Refund Policy</a></li>
                                    <li><a className='footerLink' href='#'> Terms and Conditions</a></li>
                                    <li><a className='footerLink' href='#'> Privacy Policy</a></li>
                                    <li><a className='footerLink' href='#'> FAQ’s</a></li>
                                </ul>
                            </div>
                            <div className='footerPayments'>
                                <h6> Accepted Payment </h6>
                                <a className='paymentLogo' href='#'>
                                    <img className='paymentImage' src='/Images/logos_mastercard.png'></img>
                                </a>
                                <a className='paymentLogo' href='#'>
                                    <img className='paymentImage' src='/Images/logos_visa.png'></img>
                                </a>
                            </div>
                        </div>
                        <div className='copyrightLine'>
                            <p>© Elara Health 2025. All rights reserved</p>
                            <div className="socialLinks">
                                <a className="socialLink" href="#">
                                    <img src="/Images/instagram-logo.png" alt="insta icon" height={25} />
                                </a>
                                <a className="socialLink" href="#">
                                    <img src="/Images/social-media.png  " alt="facebook icon"height={25} />
                                </a>
                                <a className="socialLink" href="#">
                                    <img src="/Images/business.png" alt="linkedin icon" height={25}/>
                                </a>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    )
}

export default Footer;