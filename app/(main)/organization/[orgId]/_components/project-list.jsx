"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useOrganization } from "@clerk/nextjs";

import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { getProjects } from "@/actions/organizations";
import { Button } from "@/components/ui/button";
import {
  Plus,
  Rocket,
  Code2,
  Calendar,
  ExternalLink,
  Trash2,
  Sparkles,
  FolderX,
} from "lucide-react";
import { BarLoader } from "react-spinners";
import DeleteProject from "./delete-project";

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
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex items-center justify-center">
        <div className="text-center space-y-6">
          <div className="relative ml-6">
            <div className="w-20 h-20 border-4 border-cyan-400/30 border-t-cyan-400 rounded-full animate-spin"></div>
            <div className="absolute inset-0 w-20 h-20 border-4 border-purple-400/20 border-b-purple-400 rounded-full animate-spin animation-delay-150"></div>
          </div>
          <div className="space-y-2">
            <h3 className="text-xl font-semibold text-white">
              Loading Projects
            </h3>
            <p className="text-slate-400">Fetching your workspace...</p>
          </div>
        </div>
      </div>
    );
  }

  if (projects.length === 0) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex items-center justify-center p-6">
        <div className="text-center space-y-8 max-w-lg">
          {/* Animated Empty State */}
          <div className="relative">
            <div className="w-40 h-40 mx-auto relative">
              {/* Outer glow ring */}
              <div className="absolute inset-0 bg-gradient-to-r from-cyan-400 to-purple-500 rounded-full opacity-20 animate-pulse"></div>
              {/* Main container */}
              <div className="absolute inset-4 bg-slate-800/50 backdrop-blur-xl rounded-full border border-slate-700/50 flex items-center justify-center">
                <FolderX className="w-16 h-16 text-slate-400" />
              </div>
              {/* Floating particles */}
              <div className="absolute top-6 right-8 w-3 h-3 bg-cyan-400 rounded-full animate-bounce animation-delay-300"></div>
              <div className="absolute bottom-8 left-6 w-2 h-2 bg-purple-400 rounded-full animate-bounce animation-delay-700"></div>
            </div>
          </div>

          <div className="space-y-4 ">
            <h2 className="text-4xl font-bold bg-gradient-to-r from-cyan-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">
              No Projects Found
            </h2>
            <p className="text-slate-300 text-lg leading-relaxed mb-4">
              Your workspace is empty. Time to create something extraordinary
              and bring your ideas to life!
            </p>
          </div>
          <br />

          <Link href="/project/create">
            <Button className="group relative overflow-hidden bg-gradient-to-r from-cyan-500 to-purple-600 hover:from-cyan-400 hover:to-purple-500 text-white px-8 py-4 rounded-2xl font-semibold text-lg shadow-2xl hover:shadow-cyan-500/25 transition-all duration-300 hover:-translate-y-1">
              <div className="absolute inset-0 bg-gradient-to-r from-white/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              <Sparkles className="w-5 h-5 mr-2 " />
              Launch Your First Project
            </Button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="rounded-xl bg-gradient-to-br from-slate-900 via-indigo-900 to-slate-900 p-6">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Glassmorphism Header */}
        <div className="relative">
          <div className="absolute inset-0 bg-gradient-to-r from-cyan-500/10 to-purple-500/10 rounded-3xl blur-xl"></div>
          <div className="relative bg-slate-800/30 backdrop-blur-xl border border-slate-700/50 rounded-3xl p-8">
            <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-6">
              <div className="space-y-2">
                <div className="flex items-center gap-3">
                  <Code2 className="w-8 h-8 text-cyan-400" />
                  <h1 className="text-3xl font-bold bg-gradient-to-r from-white to-slate-300 bg-clip-text text-transparent">
                    Your Projects
                  </h1>
                </div>
                <p className="text-slate-400 text-lg">
                  {projects.length} active project
                  {projects.length !== 1 ? "s" : ""} in development
                </p>
              </div>

              <Link href="/project/create">
                <Button className="group relative overflow-hidden bg-gradient-to-r from-cyan-500 to-purple-600 hover:from-cyan-400 hover:to-purple-500 text-white px-6 py-3 rounded-xl font-medium shadow-lg hover:shadow-cyan-500/25 transition-all duration-300 hover:-translate-y-0.5">
                  <div className="absolute inset-0 bg-gradient-to-r from-white/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                  <Plus className="w-5 h-5 mr-2" />
                  New Project
                </Button>
              </Link>
            </div>
          </div>
        </div>

        {/* Projects Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
          {projects.map((project, index) => (
            <div
              key={project.id}
              className="group relative"
              style={{
                animationDelay: `${index * 150}ms`,
              }}
            >
              {/* Glow Effect */}
              <div className="absolute -inset-0.5 bg-gradient-to-r from-cyan-500 to-purple-500 rounded-2xl opacity-0 group-hover:opacity-20 transition-opacity duration-300 blur"></div>

              <Card className="relative bg-slate-800/40 backdrop-blur-xl border border-slate-700/50 rounded-2xl overflow-hidden hover:border-slate-600/50 transition-all duration-300 hover:-translate-y-2">
                {/* Top Gradient Line */}
                <div className="h-1 bg-gradient-to-r from-cyan-400 via-purple-500 to-pink-500"></div>

                <div className="p-6 space-y-4">
                  {/* Header */}
                  <CardHeader className="p-0">
                    <div className="flex justify-between items-start">
                      <div className="flex-1">
                        <CardTitle className="text-xl font-bold text-white group-hover:text-cyan-400 transition-colors duration-200 line-clamp-2 leading-tight">
                          {project.name}
                        </CardTitle>
                        <div className="flex items-center text-slate-400 text-sm mt-2">
                          <Calendar className="w-4 h-4 mr-2" />
                          <span>Recently updated</span>
                        </div>
                      </div>

                      <div className="opacity-0 group-hover:opacity-100 transition-all duration-200 translate-x-2 group-hover:translate-x-0">
                        <DeleteProject projectId={project.id}>
                          <Button
                            variant="ghost"
                            size="sm"
                            className="h-8 w-8 p-0 hover:bg-red-500/20 hover:text-red-400 rounded-lg transition-all duration-200"
                          >
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </DeleteProject>
                      </div>
                    </div>
                  </CardHeader>

                  {/* Content */}
                  <CardContent className="p-0 space-y-4">
                    <div className="relative">
                      <p className="text-slate-300 text-sm leading-relaxed line-clamp-3 min-h-[4rem]">
                        {project.description.length > 120
                          ? project.description.slice(0, 120) + "..."
                          : project.description ||
                            "No description available for this project."}
                      </p>
                    </div>

                    {/* Action Button */}
                    <Link href={`/project/${project.id}`}>
                      <Button
                        variant="outline"
                        className="w-full bg-slate-700/30 border-slate-600/50 hover:bg-slate-600/40 hover:border-cyan-400/50 text-slate-200 hover:text-white rounded-xl font-medium transition-all duration-200 group/btn backdrop-blur-sm"
                      >
                        <Rocket className="w-4 h-4 mr-2 group-hover/btn:text-cyan-400 transition-colors duration-200" />
                        <span>Launch Project</span>
                        <ExternalLink className="w-4 h-4 ml-2 group-hover/btn:translate-x-0.5 transition-transform duration-200" />
                      </Button>
                    </Link>
                  </CardContent>
                </div>

                {/* Subtle Bottom Gradient */}
                <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-slate-600/50 to-transparent"></div>
              </Card>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
