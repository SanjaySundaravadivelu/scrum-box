"use client";

import { usePathname } from "next/navigation";
import { useEffect } from "react";
import { useRouter } from "next/navigation";

import {
  OrganizationSwitcher,
  SignedIn,
  useOrganization,
  useUser,
} from "@clerk/nextjs";
import { setCookie } from "cookies-next"; // Or a similar library

const OrgSwitcher = () => {
  const { isLoaded, organization, membership } = useOrganization();
  const { isLoaded: isUserLoaded } = useUser();
  const pathname = usePathname();
  const router = useRouter();
  useEffect(() => {
    if (organization) {
      setCookie("orgId", organization.id, { path: "/" });
      setCookie("orgRole", membership.role, { path: "/" });
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [organization]);

  if (pathname === "/") {
    return null;
  }

  if (!isLoaded || !isUserLoaded) {
    return null;
  }

  return (
    <div className="flex justify-end mt-1">
      <SignedIn>
        <OrganizationSwitcher
          hidePersonal
          createOrganizationMode={
            pathname === "/onboarding" ? "navigation" : "modal"
          }
          afterCreateOrganizationUrl="/organization/:slug"
          afterSelectOrganizationUrl="/organization/:slug"
          createOrganizationUrl="/onboarding"
          appearance={{
            elements: {
              organizationSwitcherTrigger:
                "border border-gray-300 rounded-md px-5 py-2",
              organizationSwitcherTriggerIcon: "text-white",
            },
          }}
        />
      </SignedIn>
    </div>
  );
};

export default OrgSwitcher;
