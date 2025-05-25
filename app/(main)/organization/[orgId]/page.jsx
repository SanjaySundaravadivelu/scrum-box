import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import { getOrganization } from "@/actions/organizations";
import OrgSwitcher from "@/components/org-switcher";
import ProjectList from "./_components/project-list";
import Breadcrumb from "@/components/breadcrumbs";
export default async function OrganizationPage({ params }) {
  const { orgId } = params;
  const { userId } = await auth();

  if (!userId) {
    redirect("/sign-in");
  }

  const organization = await getOrganization(orgId);

  if (!organization) {
    return (
      <>
        <Breadcrumb
          items={[
            { label: "Home", href: "/" },

            { label: organization.name, active: true },
          ]}
        />
        <div>Organization not found</div>
      </>
    );
  }

  return (
    <div className="container mx-auto px-4">
      <div className="mb-4 flex flex-col sm:flex-row justify-between items-start">
        <Breadcrumb
          items={[
            { label: "Home", href: "/" },

            { label: organization.name, active: true },
          ]}
        />

        <OrgSwitcher />
      </div>
      <br />
      <div className="mb-4">
        <ProjectList orgId={organization.id} key={organization.name} />
      </div>
    </div>
  );
}
