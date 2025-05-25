import React from "react";
import Link from "next/link";
import {
  ChevronRight,
  Layout,
  Calendar,
  BarChart,
  ArrowRight,
  ChevronDown,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import CompanyCarousel from "@/components/company-carousel";
import Image from "next/image";

const faqs = [
  {
    question: "What is ScrumBox?",
    answer:
      "ScrumBox is a dynamic project management platform tailored for agile teams. Manage your tasks, plan sprints, and track progress effortlessly — all in one powerful workspace.",
  },
  {
    question: "How does ScrumBox stand out from other tools?",
    answer:
      "ScrumBox combines the simplicity of a user-friendly interface with the depth needed for complex agile workflows. Whether you're running sprints, managing backlogs, or tracking issues, ScrumBox adapts to your team's needs with ease.",
  },
  {
    question: "Is ScrumBox good for startups and small teams?",
    answer:
      "Absolutely! ScrumBox is built to scale with your team. From startups to large organizations, our intuitive workflows help you stay organized, collaborate efficiently, and deliver results faster.",
  },
  {
    question: "What features does ScrumBox offer?",
    answer:
      "ScrumBox features include agile boards (Kanban and Scrum), sprint planning tools, backlog management, customizable workflows, real-time collaboration, and insightful reporting — everything you need to power up your project management.",
  },
  {
    question: "Can I manage multiple projects at once in ScrumBox?",
    answer:
      "Yes! ScrumBox is designed for teams handling multiple projects. Seamlessly switch between projects, track dependencies, and keep your entire organization aligned from a single dashboard.",
  },
  {
    question: "Is ScrumBox beginner-friendly?",
    answer:
      "Definitely. ScrumBox offers a smooth onboarding experience, with clean UI, helpful guides, and easy-to-navigate features, so new users can hit the ground running without any steep learning curve.",
  },
];

const features = [
  {
    title: "Agile Boards Made Simple",
    description:
      "Visualize tasks and workflows with flexible Kanban and Scrum boards designed for productivity and clarity.",
    icon: Layout,
  },
  {
    title: "Smart Sprint Planning",
    description:
      "Plan, prioritize, and execute sprints efficiently. Keep your team focused and always moving forward.",
    icon: Calendar,
  },
  {
    title: "Insightful Analytics",
    description:
      "Measure team performance with customizable reports, sprint reviews, and real-time insights.",
    icon: BarChart,
  },
];

export default function Home() {
  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="grid grid-cols-1 lg:grid-cols-2 gap-2 px-8 py-10 ">
        <div className="description my-10">
          <div className="title">
            <h1>
              <span className="gradient-text">
                Supercharge Your Agile Teams
              </span>{" "}
              with
            </h1>
            <h2 className="text-6xl sm:text-7xl lg:text-8xl font-extrabold gradient-title pb-6 flex flex-col">
              Scrum Box
            </h2>
          </div>

          <p className="paragraph">
            Plan smarter, collaborate faster, and deliver better with ScrumBox
            the ultimate agile workspace.
          </p>
          <form id="form">
            <Link href="/onboarding">
              <Button size="lg" className=" btn mr-4">
                Get Started <ChevronRight className="ml-1" size={18} />
              </Button>
            </Link>
            <Link href="#features">
              <Button size="lg" className=" btn ml-4">
                Learn More{" "}
                <ChevronDown size={18} className="ml-1 animate-bounce " />
              </Button>
            </Link>
          </form>
        </div>

        <div className="users-color-container my-10">
          <span className="item" style={{ "--i": 1 }}></span>
          <Image
            width={200} // set appropriate width
            height={200} // set appropriate height
            className="item"
            src={"/img1.png"}
            style={{ "--i": 2 }}
            alt=""
          />
          <span className="item" style={{ "--i": 3 }}></span>
          <Image
            width={200} // set appropriate width
            height={200} // set appropriate height
            className="item"
            src={"/img3.png"}
            style={{ "--i": 4 }}
            alt=""
          />

          <Image
            width={200} // set appropriate width
            height={200} // set appropriate height
            className="item"
            src={"/img7.png"}
            style={{ "--i": 10 }}
            alt=""
          />
          <span className="item" style={{ "--i": 11 }}></span>
          <Image
            width={200} // set appropriate width
            height={200} // set appropriate height
            className="item"
            src={"/img2.png"}
            style={{ "--i": 12 }}
            alt=""
          />
          <span className="item" style={{ "--i": 5 }}></span>

          <span className="item" style={{ "--i": 9 }}></span>
          <Image
            width={200} // set appropriate width
            height={200} // set appropriate height
            className="item"
            src={"/img5.png"}
            style={{ "--i": 8 }}
            alt=""
          />
          <span className="item" style={{ "--i": 7 }}></span>
          <Image
            width={200} // set appropriate width
            height={200} // set appropriate height
            className="item"
            src={"/img4.png"}
            style={{ "--i": 6 }}
            alt=""
          />
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="bg-gray-900 py-20 px-5">
        <div className="container mx-auto">
          <h3 className="text-3xl font-bold mb-12 text-center">Key Features</h3>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <Card key={index} className="bg-gray-800">
                <CardContent className="pt-6">
                  <feature.icon className="h-12 w-12 mb-4 text-blue-300" />
                  <h4 className="text-xl font-semibold mb-2">
                    {feature.title}
                  </h4>
                  <p className="text-gray-300">{feature.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>
      <div className="bg-gray-900 grid grid-cols-1 lg:grid-cols-2 gap-2 mt-10 px-8 py-10 ">
        {/* CTA Section */}
        <section className="py-20 text-center px-5 flex justify-center">
          <div className="container mx-auto ">
            <h3 className="text-3xl font-bold mb-6">
              Ready to Power Up Your Projects?
            </h3>
            <p className="text-xl mb-12">
              Join teams around the world using ScrumBox to deliver work faster,
              smarter, and better.
            </p>
            <Link href="/onboarding">
              <Button size="lg" className="animate-bounce">
                Start For Free <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </Link>
          </div>
        </section>

        {/* FAQ Section */}
        <section className="bg-gray-800 py-20 px-5 mt-10 lg:mt-auto">
          <div className="container mx-auto">
            <h3 className="text-3xl font-bold mb-12 text-center">
              Frequently Asked Questions
            </h3>
            <Accordion type="single" collapsible className="w-full">
              {faqs.map((faq, index) => (
                <AccordionItem key={index} value={`item-${index}`}>
                  <AccordionTrigger>{faq.question}</AccordionTrigger>
                  <AccordionContent>{faq.answer}</AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          </div>
        </section>
      </div>

      {/* Companies Carousel */}
      <section className="py-20">
        <div className="container mx-auto">
          <h3 className="text-3xl font-bold mb-12 text-center">
            Companies adapted Agile
          </h3>
          <CompanyCarousel />
        </div>
      </section>
    </div>
  );
}
