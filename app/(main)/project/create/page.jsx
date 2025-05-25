"use client";

import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { useOrganization, useUser } from "@clerk/nextjs";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import useFetch from "@/hooks/use-fetch";
import { projectSchema } from "@/app/lib/validators";
import { createProject } from "@/actions/projects";
import { BarLoader } from "react-spinners";
import OrgSwitcher from "@/components/org-switcher";
import Breadcrumb from "@/components/breadcrumbs";

export default function CreateProjectPage() {
  const router = useRouter();
  const { isLoaded: isOrgLoaded, membership, organization } = useOrganization();
  const { isLoaded: isUserLoaded } = useUser();
  const [isAdmin, setIsAdmin] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(projectSchema),
  });

  useEffect(() => {
    if (isOrgLoaded && isUserLoaded && membership) {
      setIsAdmin(membership.role === "org:admin");
    }
  }, [isOrgLoaded, isUserLoaded, membership]);

  const {
    loading,
    error,
    data: project,
    fn: createProjectFn,
  } = useFetch(createProject);

  const onSubmit = async (data) => {
    if (!isAdmin) {
      alert("Only organization admins can create projects");
      return;
    }

    createProjectFn(data);
  };

  useEffect(() => {
    if (project) router.push(`/project/${project.id}`);
  }, [loading]);

  if (!isOrgLoaded || !isUserLoaded) {
    return null;
  }

  if (!isAdmin) {
    return (
      <div className="flex flex-col gap-2 items-center">
        <Breadcrumb
          items={[
            { label: "Home", href: "/" },
            {
              label: organization.name,
              href: `/organization/${organization.id}`,
            },

            { label: "Create Project", active: true },
          ]}
        />
        <p className="text-2xl gradient-title">
          Oops! Only Admins can create projects.
        </p>
        <OrgSwitcher />
      </div>
    );
  }

  return (
    <div className="rounded-xl bg-gray-800 bg-opacity-50 px-16 py-10 shadow-lg backdrop-blur-md max-sm:px-8">
      <Breadcrumb
        items={[
          { label: "Home", href: "/" },
          {
            label: organization.name,
            href: `/organization/${organization.id}`,
          },

          { label: "Create Project", active: true },
        ]}
      />
      <div className="text-white">
        <div className="mb-8 flex flex-col items-center">
          <img src={"/create.png"} width="150" alt="" srcset="" />
          <h1 className="my-2 text-2xl">Create new project</h1>
        </div>
        <form onSubmit={handleSubmit(onSubmit)} className="my-4 px-10">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mt-6  ">
            <div className="mb-4 text-lg">
              <Input
                id="name"
                className="rounded-small border-none bg-indigo-600 bg-opacity-50 px-6 py-2 text-center text-inherit placeholder-slate-100 shadow-lg outline-none backdrop-blur-md"
                {...register("name")}
                placeholder="Project Name"
              />
              {errors.name && (
                <p className="text-red-500 text-sm mt-1">
                  {errors.name.message}
                </p>
              )}
            </div>

            <div className="mb-4 text-lg">
              <Input
                id="key"
                {...register("key")}
                placeholder="Project Key (Ex: RCYT)"
                className="rounded-small border-none bg-indigo-600 bg-opacity-50 px-6 py-2 text-center text-inherit placeholder-slate-100 shadow-lg outline-none backdrop-blur-md"
              />
              {errors.key && (
                <p className="text-red-500 text-sm mt-1">
                  {errors.key.message}
                </p>
              )}
            </div>
            <div className="mb-4 text-lg col-span-3">
              <Textarea
                id="description"
                {...register("description")}
                className=" rounded-small border-none bg-indigo-600 bg-opacity-50 px-6 py-2 text-center text-inherit placeholder-slate-100 shadow-lg outline-none backdrop-blur-md"
                placeholder="Project Description"
              />
              {errors.description && (
                <p className="text-red-500 text-sm mt-1">
                  {errors.description.message}
                </p>
              )}
            </div>
          </div>
          <div className="mt-8 flex justify-center text-lg text-black">
            {loading && (
              <BarLoader className="mb-4" width={"100%"} color="#36d7b7" />
            )}
            <br />
            <Button
              type="submit"
              size="lg"
              disabled={loading}
              className="rounded-small bg-indigo-600 bg-opacity-50 px-10 py-2 text-white shadow-xl backdrop-blur-md transition-colors duration-300 hover:bg-indigo-600"
            >
              {loading ? "Creating..." : "Create Project"}
            </Button>
            {error && <p className="text-red-500 mt-2">{error.message}</p>}
          </div>
        </form>
      </div>
    </div>
  );
}
