"use client";

import { OrganizationList, useOrganization } from "@clerk/nextjs";
import { useEffect } from "react";
import { setCookie } from "cookies-next"; // Or a similar library

export default function OrgList() {
  const { organization, membership } = useOrganization();

  useEffect(() => {
    if (organization) {
      setCookie("orgId", organization.id, { path: "/" });
      setCookie("orgRole", membership.role, { path: "/" });
      //router.push(`/organization/${organization.slug}`);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [organization]);

  return (
    <OrganizationList
      hidePersonal
      afterCreateOrganizationUrl="/organization/:slug"
      afterSelectOrganizationUrl="/organization/:slug"
    />
  );
}
