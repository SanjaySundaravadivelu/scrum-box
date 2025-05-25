import React from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

const Pricing = ({ user }) => {
  const today = new Date();

  return (
    <section className="py-10 bg-gray-900 sm:py-16 lg:py-24 rounded-md">
      <div className="px-4 mx-auto max-w-7xl sm:px-6 lg:px-8">
        <div className="max-w-xl mx-auto text-center">
          <h2 className="text-4xl font-bold  lg:text-5xl sm:text-5xl">
            Pricing &amp; Plans
          </h2>
          <br />
          {today > user.plan_end && (
            <>
              <p className="mt-4 text-lg leading-relaxed text-slate-2 00">
                Oops it seems your subscription have ended 😓
              </p>
              <br />
              <p className="mt-4 text-lg leading-relaxed text-slate-2 00">
                Don&#39;t worry we have special offers for you 😇
              </p>
              <br />
            </>
          )}
          <p className="mt-4 text-lg leading-relaxed text-slate-2 00">
            Manage your teams and projects with ease. From sprints to issues,
            all your agile tools in one place.
          </p>
        </div>
      </div>

      <section className="my-16 ">
        <div className="p-4 lg:p-0">
          <div className="mx-auto grid max-w-5xl grid-cols-1 gap-4 md:grid-cols-2">
            <div className="flex flex-col space-y-5 rounded-md bg-gray-200 p-8">
              <div className="flex items-center justify-start">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth="2"
                  className="mr-1.5 h-4 w-4 rotate-180 transform text-gray-600"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M7 11l5-5m0 0l5 5m-5-5v12"
                  />
                </svg>
                <h2 className="text-sm font-semibold text-gray-700">
                  What&#39;s included with your Full Access Pass
                </h2>
              </div>

              {/* Feature List Start */}
              {[
                {
                  title: "Create and Manage Organizations",
                  desc: "Easily set up organizations and manage team members with role-based access.",
                  color: "rgb(247, 149, 51)",
                  icon: (
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                      strokeWidth="2"
                      className="w-6 h-6 text-white"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M8 14v3m4-3v3m4-3v3M3 21h18M3 10h18M3 7l9-4 9 4M4 10h16v11H4V10z"
                      ></path>
                    </svg>
                  ),
                },
                {
                  title: "Project and Sprint Management",
                  desc: "Plan and track sprints, assign issues, and monitor progress using agile workflows.",
                  color: "rgb(243, 112, 85)",
                  icon: (
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                      strokeWidth="2"
                      className="w-6 h-6 text-white"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M17 14v6m-3-3h6M6 10h2a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v2a2 2 0 002 2zm10 0h2a2 2 0 002-2V6a2 2 0 00-2-2h-2a2 2 0 00-2 2v2a2 2 0 002 2zM6 20h2a2 2 0 002-2v-2a2 2 0 00-2-2H6a2 2 0 00-2 2v2a2 2 0 002 2z"
                      ></path>
                    </svg>
                  ),
                },
                {
                  title: "Custom Issue Tracking",
                  desc: "Create and organize tasks, bugs, and features with customizable issue types and statuses.",
                  color: "rgb(239, 78, 123)",
                  icon: (
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                      strokeWidth="2"
                      className="w-6 h-6 text-white"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M9 17V7m0 10a2 2 0 01-2 2H5a2 2 0 01-2-2V7a2 2 0 012-2h2a2 2 0 012 2m0 10a2 2 0 002 2h2a2 2 0 002-2M9 7a2 2 0 012-2h2a2 2 0 012 2m0 10V7m0 10a2 2 0 002 2h2a2 2 0 002-2V7a2 2 0 00-2-2h-2a2 2 0 00-2 2"
                      ></path>
                    </svg>
                  ),
                },
                {
                  title: "Real-time Collaboration",
                  desc: "Comment, assign, and get notified in real-time — your team stays in sync.",
                  color: "rgb(161, 102, 171)",
                  icon: (
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                      strokeWidth="2"
                      className="w-6 h-6 text-white"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
                      ></path>
                    </svg>
                  ),
                },

                {
                  title: "Continuous Feature Updates",
                  desc: "New tools, integrations, and improvements are shipped regularly to enhance productivity.",
                  color: "rgb(16, 152, 173)",
                  icon: (
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                      strokeWidth="2"
                      className="w-6 h-6 text-white"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M12 9v3m0 0v3m0-3h3m-3 0H9m12 0a9 9 0 11-18 0 9 9 0 0118 0z"
                      ></path>
                    </svg>
                  ),
                },
              ].map(({ title, desc, color, icon }) => (
                <div className="flex items-start space-x-4" key={title}>
                  <div
                    className="w-10 h-10 flex justify-center items-center rounded-lg"
                    style={{ backgroundColor: color }}
                  >
                    {icon}
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900">{title}</h3>
                    <p className="text-sm text-gray-700">{desc}</p>
                  </div>
                </div>
              ))}
              {/* Feature List End */}
            </div>

            {/* Pricing Cards (unchanged except context) */}
            <div className="grid grid-cols-1 grid-rows-3 gap-4">
              {/* Basic Plan */}
              <div className="relative rounded-xl border border-black bg-gray-800">
                <div className="p-6 md:px-8">
                  <div className="grid grid-cols-5">
                    <div className="col-span-2">
                      <p className="text-xl font-semibold text-white md:text-2xl">
                        Current
                      </p>
                    </div>
                    <div className="col-span-3 mt-5 xl:mt-0">
                      <p className="text-lg font-normal text-gray-200">
                        <span className="font-bold text-green-500">Basic</span>
                      </p>
                      <p className="text-xs text-gray-400">
                        remaining days : 3
                      </p>
                      <div className="group relative mt-6 inline-flex items-center justify-center">
                        <div className="group-hover:shadow-cyan-500/50 absolute -inset-px rounded-full bg-gradient-to-r from-cyan-500 to-purple-500 transition-all duration-200 group-hover:shadow-lg"></div>
                        <a
                          href="#"
                          className="pointer-events-none cursor-not-allowed relative inline-flex items-center justify-center rounded-full border border-transparent bg-black px-8 py-3 text-sm font-normal text-white hover:bg-gray-800 md:text-xs lg:text-base"
                          onClick={(e) => e.preventDefault()}
                        >
                          Active
                        </a>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* One Year Plan */}
              <div className="relative rounded-xl border border-black bg-gray-800">
                <p className="absolute top-0 left-5 -translate-y-1/2 transform rounded-md bg-yellow-500 py-1 px-2 text-[10px] font-semibold uppercase tracking-wide text-white md:left-7">
                  Limited time deal!
                </p>
                <div className="p-6 md:px-8">
                  <div className="grid grid-cols-5">
                    <div className="col-span-2">
                      <p className="text-2xl font-semibold text-white md:text-3xl">
                        ₹5999
                      </p>
                      <p className="text-xs text-gray-400 space-x-1 mt-2">
                        <div className="text-red-500">₹12000</div>
                        <span className="text-green-500">Save 50%</span>
                      </p>
                      <p className="mt-1 whitespace-nowrap text-xs font-normal text-gray-400">
                        Renews every year,
                        <br />
                        cancel any time
                      </p>
                    </div>
                    <div className="col-span-3 mt-5 xl:mt-0">
                      <p className="text-lg font-normal text-gray-200">
                        <span className="font-bold text-yellow-500">
                          One year{" "}
                        </span>
                        full access
                      </p>
                      <p className="text-xs text-gray-400">
                        Unlimited users, organizations, and projects.
                      </p>
                      <div className="group relative mt-6 inline-flex items-center justify-center">
                        <div className="group-hover:shadow-cyan-500/50 absolute -inset-px rounded-full bg-gradient-to-r from-cyan-500 to-purple-500 transition-all duration-200 group-hover:shadow-lg"></div>

                        <Dialog>
                          <DialogTrigger asChild>
                            <button className="relative inline-flex items-center justify-center rounded-full border border-transparent bg-purple-500 px-8 py-3 text-sm font-normal text-white hover:bg-gray-800 md:text-xs lg:text-base">
                              Get one year access!
                            </button>
                          </DialogTrigger>
                          <DialogContent>
                            <DialogHeader>
                              <DialogTitle>Payments Unavailable</DialogTitle>
                              <DialogDescription>
                                Sorry, for now we are currently not accepting
                                payments.
                                <br />
                                For more details, contact{" "}
                                <span className="font-semibold">
                                  s.sanjaysundaram@gmail.com
                                </span>
                                .
                              </DialogDescription>
                            </DialogHeader>
                          </DialogContent>
                        </Dialog>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Quarterly Plan */}
              <div className="relative rounded-xl border border-black bg-gray-800">
                <div className="p-6 md:px-8">
                  <div className="grid grid-cols-5">
                    <div className="col-span-2">
                      <p className="text-2xl font-semibold text-white md:text-3xl">
                        ₹3999
                      </p>
                      <p className="mt-1 whitespace-nowrap text-xs font-normal text-gray-400">
                        Renews every quarter,
                        <br />
                        cancel any time
                      </p>
                    </div>
                    <div className="col-span-3 mt-5 xl:mt-0">
                      <p className="text-lg font-normal text-gray-200">
                        <span className="font-bold text-purple-500">
                          Three months{" "}
                        </span>
                        full access
                      </p>
                      <p className="text-xs text-gray-400">
                        Ideal for small agile teams and short-term projects.
                      </p>
                      <div className="group relative mt-6 inline-flex items-center justify-center">
                        <div className="group-hover:shadow-cyan-500/50 absolute -inset-px rounded-full bg-gradient-to-r from-cyan-500 to-purple-500 transition-all duration-200 group-hover:shadow-lg"></div>
                        <Dialog>
                          <DialogTrigger asChild>
                            <button className="relative inline-flex items-center justify-center rounded-full border border-transparent bg-black px-8 py-3 text-sm font-normal text-white hover:bg-gray-800 md:text-xs lg:text-base">
                              Get three months access
                            </button>
                          </DialogTrigger>
                          <DialogContent>
                            <DialogHeader>
                              <DialogTitle>Payments Unavailable</DialogTitle>
                              <DialogDescription>
                                Sorry, for now we are currently not accepting
                                payments.
                                <br />
                                For more details, contact{" "}
                                <span className="font-semibold">
                                  s.sanjaysundaram@gmail.com
                                </span>
                                .
                              </DialogDescription>
                            </DialogHeader>
                          </DialogContent>
                        </Dialog>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </section>
  );
};

export default Pricing;
