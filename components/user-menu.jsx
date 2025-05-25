"use client";
import React, { useEffect, useState } from "react";

import { UserButton } from "@clerk/nextjs";
import { ChartNoAxesGantt, CircleAlert } from "lucide-react";

const UserMenu = ({ user }) => {
  const [curr_user, setUser] = useState({
    name: "",
    plan_start: new Date(),
    plan_end: new Date(),
    plan_type: "",
  });
  useEffect(() => {
    setUser(user);
  }, []);
  return (
    <UserButton
      appearance={{
        elements: {
          avatarBox: "w-10 h-10",
        },
      }}
    >
      <UserButton.MenuItems>
        <UserButton.Link
          label="My Organizations"
          labelIcon={<ChartNoAxesGantt size={15} />}
          href="/onboarding"
        />
        <UserButton.Link
          label={"Current Plan : " + curr_user?.plan_type + " -- 🚀"}
          labelIcon={<CircleAlert size={15} />}
          href="/pricing"
        />
        <UserButton.Action label="manageAccount" />
      </UserButton.MenuItems>
    </UserButton>
  );
};

export default UserMenu;
