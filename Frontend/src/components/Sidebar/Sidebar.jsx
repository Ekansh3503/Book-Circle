import {
  ArrowLeftRight,
  Book,
  Flag,
  Languages,
  LayoutDashboard,
  List,
  Logs,
  Menu,
  Shield,
  Star,
  Users,
  UsersRound,
} from "lucide-react";
import React, { useEffect } from "react";
import { FaUsers } from "react-icons/fa";
import { NavLink, useLocation } from "react-router-dom";

function Sidebar(props) {
  const { activeOption, setActiveOption, role } = props;

  const location = useLocation();

  useEffect(() => {
    console.log(role);

    // Map routes to their corresponding option names
    const pathToOption = {
      "/": "Dashboard",
      "/books": "BookList",
      "/books/book-details": "BookList",
      "/mybooks": "MyBooks",
      "/members": "MyBooks",
      "/clubmembers": "clubmembers",
      "/Transactions": "transactions",
      "/reviews": "reviews",
      "/clubs": "clubs",
      "/category": "category",
    };

    const currentOption = pathToOption[location.pathname];
    if (currentOption) {
      setActiveOption(currentOption);
    }
  }, [location.pathname]);

  const getItemClass = (option) => {
    return `flex gap-x-4 items-center  px-5 py-5 h-16 rounded-xl ${
      activeOption === option ? "bg-br-blue-dark border-2" : ""
    } text-br-white hover:bg-br-blue-dark hover:cursor-pointer`;
  };
  return (
    <div
      className={`${
        props.barstate ? "w-64 p-4" : "w-24 p-4"
      } bg-br-blue-medium fixed left-0 top-0 h-screen pt-4 transition-all duration-300 ease-in-out space-y-2 flex flex-col`}
    >
      <div
        className="flex gap-x-4 items-center hover:cursor-pointer text-br-white px-5 py-5 h-16"
        onClick={() => {
          props.barstatechange(!props.barstate);
        }}
      >
        <Menu className="flex-shrink-0" />
        <div
          className={`whitespace-nowrap flex-shrink-0 text-md font-semibold overflow-hidden transition-all duration-300 ${
            props.barstate ? "w-32 opacity-100" : "w-0 opacity-0"
          }`}
        >
          BookCircle
        </div>
      </div>

      <hr className="h-px my-2 bg-gray-200 border-0 dark:bg-gray-700" />

      {/* Dashboard visible to all the users */}
      <NavLink
        to={"/"}
        className={getItemClass("Dashboard")}
        onClick={() => setActiveOption("Dashboard")}
      >
        <LayoutDashboard className="flex-shrink-0" />
        <div
          className={`whitespace-nowrap flex-shrink-0 text-md font-semibold overflow-hidden transition-all duration-300 ${
            props.barstate ? "w-32 opacity-100" : "w-0 opacity-0"
          }`}
        >
          Dashboard
        </div>
      </NavLink>

      {(role === 2 || role === 1 || role === 0) && ( // user
        <NavLink
          to={"/books"}
          className={getItemClass("BookList")}
          onClick={() => setActiveOption("BookList")}
        >
          <List className="flex-shrink-0" />
          <div
            className={`whitespace-nowrap flex-shrink-0 text-md font-semibold overflow-hidden transition-all duration-300 ${
              props.barstate ? "w-32 opacity-100" : "w-0 opacity-0"
            }`}
          >
            Book List
          </div>
        </NavLink>
      )}

      {(role === 2 ||  role===1) && ( // user
        <NavLink
          to={"/mybooks"}
          className={getItemClass("MyBooks")}
          onClick={() => setActiveOption("MyBooks")}
        >
          <Book className="flex-shrink-0" />
          <div
            className={`whitespace-nowrap flex-shrink-0 text-md font-semibold overflow-hidden transition-all duration-300 ${
              props.barstate ? "w-32 opacity-100" : "w-0 opacity-0"
            }`}
          >
            My Books
          </div>
        </NavLink>
      )}

      {role === 1 && ( // Club Admin
        <NavLink
          to={"/clubmembers"}
          className={getItemClass("clubmembers")}
          onClick={() => setActiveOption("clubmembers")}
        >
          <Users className="flex-shrink-0" />
          <div
            className={`whitespace-nowrap flex-shrink-0 text-md font-semibold overflow-hidden transition-all duration-300 ${
              props.barstate ? "w-32 opacity-100" : "w-0 opacity-0"
            }`}
          >
            Member List
          </div>
        </NavLink>
      )}

      {role === 0 && ( // Super Admin
        <NavLink
          to={"/members"}
          className={getItemClass("MyBooks")}
          onClick={() => setActiveOption("MyBooks")}
        >
          <UsersRound className="flex-shrink-0" />
          <div
            className={`whitespace-nowrap flex-shrink-0 text-md font-semibold overflow-hidden transition-all duration-300 ${
              props.barstate ? "w-32 opacity-100" : "w-0 opacity-0"
            }`}
          >
            Member List
          </div>
        </NavLink>
      )}
      {/* {(role === 0 || role === 1) && ( // Super Admin
        <NavLink
          to={"/Transactions"}
          className={getItemClass("transactions")}
          onClick={() => setActiveOption("transactions")}
        >
          <ArrowLeftRight className="flex-shrink-0" />
          <div
            className={`whitespace-nowrap flex-shrink-0 text-md font-semibold overflow-hidden transition-all duration-300 ${
              props.barstate ? "w-32 opacity-100" : "w-0 opacity-0"
            }`}
          >
            Transactions
          </div>
        </NavLink>
      )} */}

      {role === 1 && ( // Super Admin
        <NavLink
          to={"/reviews"}
          className={getItemClass("reviews")}
          onClick={() => setActiveOption("reviews")}
        >
          <Star className="flex-shrink-0" />
          <div
            className={`whitespace-nowrap flex-shrink-0 text-md font-semibold overflow-hidden transition-all duration-300 ${
              props.barstate ? "w-32 opacity-100" : "w-0 opacity-0"
            }`}
          >
            Review Approval
          </div>
        </NavLink>
      )}

      {role === 0 && ( // Super Admin
        <NavLink
          to={"/clubs"}
          className={getItemClass("clubs")}
          onClick={() => setActiveOption("clubs")}
        >
          <Shield className="flex-shrink-0" />
          <div
            className={`whitespace-nowrap flex-shrink-0 text-md font-semibold overflow-hidden transition-all duration-300 ${
              props.barstate ? "w-32 opacity-100" : "w-0 opacity-0"
            }`}
          >
            Club List
          </div>
        </NavLink>
      )}

      {role === 0 && ( // Super Admin
        <NavLink
          to={"/category"}
          className={getItemClass("category")}
          onClick={() => setActiveOption("category")}
        >
          <Languages className="flex-shrink-0" />
          <div
            className={`whitespace-nowrap flex-shrink-0 text-md font-semibold overflow-hidden transition-all duration-300 ${
              props.barstate ? "w-32 opacity-100" : "w-0 opacity-0"
            }`}
          >
            Category & Language
          </div>
        </NavLink>
      )}
    </div>
  );
}

export default Sidebar;
