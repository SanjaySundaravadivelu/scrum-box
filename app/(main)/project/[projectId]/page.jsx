import React from "react";
import Backlog from "./backlog";
import SprintPage from "./sprint";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { getOrganization } from "@/actions/organizations";
import { cookies } from "next/headers";

import { getProject } from "@/actions/projects";
import { notFound } from "next/navigation";
import Breadcrumb from "@/components/breadcrumbs";
const page = async ({ params }) => {
  const { projectId } = params;
  const orgId = cookies().get("orgId")?.value;

  const organization = await getOrganization(orgId);

  const project = await getProject(projectId);
  if (!project) {
    notFound();
  }

  return (
    <div className="">
      <Breadcrumb
        items={[
          { label: "Home", href: "/" },
          {
            label: organization.name,
            href: `/organization/${orgId}`,
          },

          { label: project.name, active: true },
        ]}
      />
      <br />
      <Tabs className="mt-6" defaultValue="sprint">
        <TabsList>
          <TabsTrigger value="backlog">Backlog</TabsTrigger>
          <TabsTrigger value="sprint">Sprints</TabsTrigger>
        </TabsList>
        <TabsContent value="backlog">
          <Backlog projectId={projectId} project={project} />
        </TabsContent>
        <TabsContent value="sprint">
          <SprintPage projectId={projectId} project={project} />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default page;
