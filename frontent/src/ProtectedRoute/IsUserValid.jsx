import React from "react";
import { useSelector } from "react-redux";
import { useAuth } from "../../context/AuthContext";

const IsUserValid = ({ children }) => {
  const { isAuthenticated } = useSelector((state) => state.userAuth);
  const { openAuth } = useAuth();

  // ஏற்கனவே பட்டனுக்கு onClick இருக்கான்னு பாத்துட்டு, அதையும் சேர்த்து ரன் பண்றதுதான் முறை
  const originalOnClick = children.props.onClick;

  return React.cloneElement(children, {
    onClick: (e) => {
      if (!isAuthenticated) {
        e.preventDefault();
        e.stopPropagation();
        openAuth();
      } else {
        // லாகின் இருந்தா, ஒரிஜினல் onClick-ஐயும் சேர்த்து ரன் பண்ணு
        if (originalOnClick) originalOnClick(e);
      }
    },
  });
};

export default IsUserValid;
