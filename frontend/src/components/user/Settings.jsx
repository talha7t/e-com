import React from "react";
import ProfileCTA from "./ProfileCTA";

function Settings() {
  return (
    <>
      <ProfileCTA
        path="/"
        mainText="Regional Preferences"
        subText="Choose Favourite Language"
      />

      <ProfileCTA
        path="/"
        mainText="Privacy Policy"
        subText="Our privacy policy"
      />
    </>
  );
}

export default Settings;
