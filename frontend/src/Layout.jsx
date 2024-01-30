import { Outlet, Link } from "react-router-dom";

const Layout = () => {
  return (
    <>
      <nav   >
        <ul className="flex  m-3 p-3 space-x-5" >
          <li>
            <Link to="/">Home</Link>
          </li>
          <li>
            <Link to="/auth">Auth</Link>
          </li>
          <li>
            {/* <Link to="/contact">Contact</Link> */}
          </li>
        </ul>
      </nav>

      <Outlet />
    </>
  )
};

export default Layout;