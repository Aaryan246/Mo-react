import React, { useEffect } from "react";

import Donation from "../components/donation/Donation";

import { useSelector } from "react-redux";
import LoadIcon from "../images/loading.gif";

let scroll = 0;

const DonationPage = () => {
  const { homePosts } = useSelector((state) => state);

  window.addEventListener("scroll", () => {
    if (window.location.pathname === "/") {
      scroll = window.pageYOffset;
      return scroll;
    }
  });

  useEffect(() => {
    setTimeout(() => {
      window.scrollTo({ top: scroll, behavior: "smooth" });
    }, 100);
  }, []);

  return (
    <div className="home row mx-0">
      <Donation />
    </div>
  );
};

export default DonationPage;
