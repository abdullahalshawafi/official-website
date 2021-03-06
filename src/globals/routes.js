import Home from "modules/Home";
import SingleCommittee from "modules/Committees/components/SingleCommitteePage";
import AboutPage from "modules/About/components/page";
import BlogsPage from './../modules/Blogs';
import Events from "modules/Events/Events";
import Crew from "modules/Crew/Crew";
import Contacts from "modules/Contact";
import RegisterationPage from "modules/Register";
import LoginPage from "modules/Login";
import Verfied from "modules/Verfied";

export default [
  {
    path: "/",
    component: Home,
    inNavbar: {
      shown: true,
      label: "Home"
    }
  },
  {
    path: "/about-us",
    component: AboutPage,
    inNavbar: {
      shown: true,
      label: "About"
    }
  },
  {
    path: "/blogs",
    component: BlogsPage,
    inNavbar: {
      shown: true,
      label: "Blogs"
    },
  },
  {
    path: "/committee/:id",
    component: SingleCommittee,
    inNavbar: {
      shown: false,
      label: "" // generated dynamically
    }
  },
  {
    path: "/events",
    component: Events,
    inNavbar: {
      shown: true,
      label: "Events"
    }
  },
  {
    path: "/crew",
    component: Crew,
    inNavbar: {
      shown: true,
      label: "Crew"
    }
  },
  // {
  //   path: "/events/:id/:title",
  //   component: SingleEvent,
  //   inNavbar: {
  //     shown: false,
  //     label: "Events"
  //   }
  // },
  {
    path: "/contact-us",
    component: Contacts,
    inNavbar: {
      shown: true,
      label: "Contact us"
    }
  },
  {
    path: "/verfied",
    component: Verfied,
    inNavbar: {
      shown: false,
      label: ""
    }
  },
  //make sure that signup and login be the last two here
  {
    path: "/signup",
    component: RegisterationPage,
    inNavbar: {
      shown: JSON.parse(localStorage.getItem("user")) ? false : true,
      label: "Sign Up"
    }
  },
  {
    path: "/login",
    component: LoginPage,
    inNavbar: {
      shown: JSON.parse(localStorage.getItem("user")) ? false : true,
      label: "Log In"
    }
  }
];
