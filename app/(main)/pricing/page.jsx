import React from "react";
import Pricing from "./_components/pricing";
import { getUser } from "@/actions/getPlan";

const page = async () => {
  const user = await getUser();

  return <Pricing user={user} />;
};

export default page;
