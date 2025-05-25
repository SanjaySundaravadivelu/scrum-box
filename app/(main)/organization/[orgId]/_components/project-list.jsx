"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useOrganization } from "@clerk/nextjs";

import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { getProjects } from "@/actions/organizations";
import { Button } from "@/components/ui/button";
import { BadgePlus } from "lucide-react";
import { BarLoader } from "react-spinners";
import DeleteProject from "./delete-project";
import "./notfound.css";
export default function ProjectList() {
  const { organization, isLoaded } = useOrganization();
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!isLoaded || !organization) return;

    const fetchProjects = async () => {
      setLoading(true);
      const data = await getProjects(organization.id);
      setProjects(data);
      setLoading(false);
    };

    fetchProjects();
  }, [organization, isLoaded]);

  if (loading) {
    return <BarLoader className="mt-4" width={"100%"} color="#36d7b7" />;
  }

  if (projects.length === 0) {
    return (
      <section className="page_404 mt-4">
        <div className="container">
          <div className="row">
            <div className="col-sm-12 ">
              <div className="col-sm-10 col-sm-offset-1  text-center">
                <div className="four_zero_four_bg">
                  <h1 className="text-outline text-center bg-gradient-to-r from-violet-800 to-zinc-400 bg-clip-text text-transparent">
                    Oops ! No projects found
                  </h1>
                </div>

                <div className="contant_box_404 text-gray-900">
                  <Button
                    variant="ghost"
                    className="mt-2 hover:text-slate-200 text-blue-800"
                  >
                    <Link
                      className="underline underline-offset-2 "
                      href="/project/create"
                    >
                      Create New.
                    </Link>
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    );
  }

  return (
    <div className=" rounded-xl bg-gray-800 p-6">
      <div className="w-full flex justify-center mb-4">
        <Button variant="primary " className="bg-gray-600">
          <BadgePlus className="h-4 w-4 mr-1" />
          <Link href="/project/create">Create New.</Link>
        </Button>
      </div>
      <br />
      <div className="grid grid-cols-1 md:grid-cols-2 gap-2 justify-items-center">
        {projects.map((project) => (
          <Card
            key={project.id}
            className=" w-full max-w-md rounded-2xl border border-slate-800 bg-[url(/card.jpg)] shadow-xl transition-transform hover:scale-105"
          >
            <div className="p-6 space-y-4 text-center">
              {/* Header */}
              <CardHeader className="p-0">
                <CardTitle className="text-lg font-semibold text-gray-200 flex justify-between items-center">
                  <span className="truncate">{project.name}</span>
                  <DeleteProject projectId={project.id} />
                </CardTitle>
              </CardHeader>

              {/* Content */}
              <CardContent className="p-0">
                <p className="text-sm text-slate-300 m-6 p-6 ">
                  {project.description.length > 100
                    ? project.description.slice(0, 100) + "..."
                    : project.description}
                </p>

                <Link
                  href={`/project/${project.id}`}
                  className="inline-block rounded-sm bg-gray-600 text-white px-6 py-2 text-sm font-medium transition hover:bg-gray-700"
                >
                  View Project
                </Link>
              </CardContent>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}
