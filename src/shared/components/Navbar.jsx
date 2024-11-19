export const NavbarComponent = () => {
    return(       
        <header className="navbar navbar-expand navbar-light fixed-top navbar-box-shadow bg-light px-3 px-lg-4" data-scroll-header data-fixed-element>
            <a className="navbar-brand d-lg-none" href="dev-setup.html">
              <img src="../src/assets/img/logo.png" alt="test" width="130" />
            </a>
            <button className="navbar-toggler d-block d-lg-none mr-3 ml-auto" type="button" data-toggle="offcanvas" data-target="componentsNav">
              <span className="navbar-toggler-icon"></span>
            </button>
            <ul className="navbar-nav ml-auto d-none d-lg-flex align-items-center">
 
              <li className="nav-item">
                <a className="nav-link py-0" href="../components/typography.html">
                  <i className="cxi-profile align-middle mt-n1 mr-2"></i>
                  Adevprolatam
                </a>
              </li>
         
            </ul>
          
        </header>
    )
}
