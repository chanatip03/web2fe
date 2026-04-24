"use client";

import { useState, useEffect } from "react";
import RocketLaunchIcon from "@mui/icons-material/RocketLaunch";
import SmartToyIcon from "@mui/icons-material/SmartToy";
import ShieldIcon from "@mui/icons-material/Shield";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import LockIcon from "@mui/icons-material/Lock";
import PlagiarismIcon from '@mui/icons-material/Plagiarism';
import Link from "next/link";


const features = [
  {
    id: "deploy",
    label: "Auto Deploy",
    icon: <RocketLaunchIcon fontSize="inherit" />,
    title: "Review Projects Instantly Without Setup",
    tagline: "Supports Frontend, Backend, and Fullstack",
    desc: "When students submit their work, WEB2 automatically handles the entire deployment process without any manual environment setup. Everything runs instantly in a consistent environment, eliminating the common issue of “it works on my machine but not on the instructor’s” problem. Instructors can open a live preview immediately and focus on grading real student work and giving feedback instead of fixing setup issues.",
  },
  {
    id: "ai",
    label: "AI Testcase",
    icon: <SmartToyIcon fontSize="inherit" />,
    title: "AI-Generated Test Cases",
    tagline: "Faster grading with less manual work",
    desc: "When creating frontend or backend assignments, instructors can define test cases that WEB2 uses to automatically evaluate the quality of every student submission, ensuring consistent and fair grading.",
  },
  {
    id: "cyber",
    label: "CyberSecurity",
    icon: <ShieldIcon fontSize="inherit" />,
    title: "Built-in Security Scanning",
    tagline: "Help students write secure code from the beginning.",
    desc: "Every submission is automatically scanned for common security vulnerabilities. Students receive instant feedback on potential risks, helping them build secure coding habits early in the learning process instead of discovering issues too late.",
  },
  {
    id: "plagiarism",
    label: "Plagiarism Check",
    icon: <PlagiarismIcon fontSize="inherit" />,
    title: "Real-Time Code Similarity Detection",
    tagline: "Ensure fairness in every class",
    desc: "WEB2 automatically compares all student submissions and detects code similarity across assignments. This helps instructors maintain academic integrity while focusing on evaluating understanding and problem-solving instead of duplicated work.",
  },
];

export default function Web2LandingPage() {
  const [active, setActive] = useState(0);
  const [fading, setFading] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const scrollToSection = (id: string) => {
    const element = document.getElementById(id);
    if (!element) return;

    const offset = 80;
    const bodyRect = document.body.getBoundingClientRect().top;
    const elementRect = element.getBoundingClientRect().top;
    const position = elementRect - bodyRect - offset;

    window.scrollTo({ top: position, behavior: "smooth" });
  };

  const changeFeature = (i: number) => {
    if (i === active) return;
    setFading(true);
    setTimeout(() => {
      setActive(i);
      setFading(false);
    }, 200);
  };

  const f = features[active];

  return (
    <div className="min-h-screen bg-background text-foreground overflow-x-hidden">

      <nav
        className={`fixed top-0 inset-x-0 z-50 h-[72px] transition-all duration-300
  ${scrolled
            ? "bg-primary03 backdrop-blur-md shadow-lg border-b border-white/10"
            : "bg-transparent"
          }`}
      >
        <div className="max-w-6xl mx-auto h-full flex justify-between items-center">

          {/* LOGO */}
          <div
            className="flex items-center gap-2 cursor-pointer group text-neutral01"
            onClick={() => scrollToSection("home")}
          >
            <img
              src="/WLogo.png"
              alt="WEB2 Logo"
              width={54}
              height={54}
              className="object-contain"
            />

            <div className="leading-tight">
              <h3 className="mt-1 ">EB2</h3>
              <div className="-mt-1 p2">eb learning Environment</div>
            </div>
          </div>

          {/* RIGHT SIDE (เหมือนเดิมทุกอย่าง) */}
          <div className="flex items-center gap-8">
            <div className="hidden md:flex gap-8 font-medium">
              {["home", "about", "features"].map((id) => (
                <button
                  key={id}
                  onClick={() => scrollToSection(id)}
                  className={`text-sm tracking-wide transition-all text-neutral03 hover:text-white hover:font-semibold`}
                >
                  {id.toUpperCase()}
                </button>
              ))}
            </div>
            <Link href="/auth">
              <button className="bg-white text-primary03 px-4 py-1.5 rounded-md font-bold shadow-md shadow-black/5 hover:bg-neutral01 hover:text-primary04 transition-all active:scale-95 border border-neutral02">
                Login
              </button>
            </Link>
          </div>

        </div>
      </nav>

      {/* HERO */}
      <section
        id="home"
        className="relative bg-gradient-to-br from-primary03 to-primary04 py-52 px-6 overflow-hidden  flex items-center"
      >
        <div className="max-w-6xl mx-auto grid lg:grid-cols-2 gap-16 items-center relative z-10 w-full">

          {/* Left: Text Content */}
          <div className="space-y-8 text-center lg:text-left">
            <h1 className="text-white leading-tight text-6xl font-extrabold">
              WEB2 <br />
              <span className="text-secondary03">LEARNING ENV</span>
            </h1>

            <p className="p1 text-secondary01/90 max-w-lg mx-auto lg:mx-0 leading-relaxed">
              WEB2 turns student submissions into ready-to-review projects instantly, allowing instructors to focus on teaching and grading instead of spending time fixing environments, running tests, and handling setup issues.
            </p>

            <div className="flex flex-wrap justify-center lg:justify-start gap-4">
              <Link href="/auth">
                <button className="bg-white text-primary03 px-8 py-4 rounded-xl font-bold shadow-xl shadow-black/10 hover:bg-neutral01 hover:-translate-y-1 transition-all active:scale-95">
                  Get Started
                </button>
              </Link>
              <button
                onClick={() => scrollToSection("features")}
                className="bg-primary04/50 backdrop-blur-md text-white border border-secondary02/30 px-8 py-4 rounded-xl font-bold hover:bg-primary04 transition-all active:scale-95"
              >
                Explore Features
              </button>
            </div>
          </div>

          {/* รูปด้านขวาใน hero card */}
          <div className="relative hidden lg:block perspective-1000 pl-4">
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-3/4 h-3/4 bg-secondary03/40 rounded-full blur-[80px]"></div>
            <div className="relative transform rotate-y-[-5deg] rotate-x-[3deg] hover:rotate-y-0 hover:rotate-x-0 transition-transform duration-700 ease-out">
              <div className="relative z-10 bg-[#FAFAFA] rounded-xl border border-neutral05/30 shadow-2xl overflow-hidden min-w-[480px] animate-[float_6s_ease-in-out_infinite]">
                <div className="flex items-center px-4 py-3 bg-[#EBEBEB] border-b border-neutral03/40">
                  <div className="flex gap-2">
                    <div className="w-3 h-3 rounded-full bg-[#FF5F56] shadow-sm"></div>
                    <div className="w-3 h-3 rounded-full bg-[#FFBD2E] shadow-sm"></div>
                    <div className="w-3 h-3 rounded-full bg-[#27C93F] shadow-sm"></div>
                  </div>
                  <div className="mx-auto bg-white px-6 py-1.5 rounded-md text-[11px] text-neutral05 font-mono flex items-center gap-2 shadow-sm border border-neutral03/20">
                    <LockIcon fontSize="inherit" className="text-[#23A455]" />
                    <span>app.WEB2.LEARNING</span>
                  </div>
                  <div className="w-12"></div>
                </div>

                <div className="p-6 h-[260px] flex flex-col gap-5 bg-white">
                  <div className="flex justify-between items-center pb-4 border-b border-neutral02">
                    <div className="w-32 h-6 bg-neutral02 rounded-md"></div>
                    <div className="flex gap-3">
                      <div className="w-16 h-6 bg-neutral02 rounded-md"></div>
                      <div className="w-8 h-8 rounded-full bg-primary02/80"></div>
                    </div>
                  </div>

                  <div className="flex gap-4">

                    <div className="w-1/3 h-32 bg-primary01/30 rounded-xl border border-primary01 flex flex-col gap-3 p-4">
                      <div className="w-full h-3 bg-secondary02/40 rounded"></div>
                      <div className="w-4/5 h-3 bg-secondary02/40 rounded"></div>
                      <div className="w-full h-3 bg-secondary02/40 rounded"></div>
                    </div>

                    <div className="w-2/3 h-32 bg-white rounded-xl shadow-[0_4px_20px_rgba(0,0,0,0.05)] border border-neutral02 p-4 flex flex-col justify-end gap-2 relative overflow-hidden">
                      <div className="absolute top-4 left-4 w-1/2 h-4 bg-neutral02 rounded"></div>
                      <div className="flex items-end gap-2 h-16 mt-auto">
                        <div className="w-1/5 h-[40%] bg-secondary04 rounded-t-sm"></div>
                        <div className="w-1/5 h-[70%] bg-primary03 rounded-t-sm"></div>
                        <div className="w-1/5 h-[50%] bg-secondary04 rounded-t-sm"></div>
                        <div className="w-1/5 h-[90%] bg-primary03 rounded-t-sm"></div>
                        <div className="w-1/5 h-[60%] bg-secondary04 rounded-t-sm"></div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>


              <div className="absolute -right-10 -bottom-10 z-20 bg-[#1E1E1E] rounded-xl border border-neutral05/40 shadow-[0_20px_50px_rgba(0,0,0,0.4)] overflow-hidden w-[320px] animate-[float_5s_ease-in-out_infinite_0.5s]">
                <div className="flex items-center justify-between px-4 py-2.5 bg-[#2D2D2D] border-b border-black/50">
                  <div className="flex items-center gap-2">
                    <span className="text-[11px] font-bold text-[#4FC1FF]">GET</span>
                    <span className="text-[11px] text-neutral03 font-mono">/api/users</span>
                  </div>
                  <span className="text-[10px] font-bold text-[#23A455] bg-[#23A455]/20 px-2 py-0.5 rounded border border-[#23A455]/30">200 OK</span>
                </div>
                <div className="p-5 font-mono text-[13px] text-[#D4D4D4] leading-loose">
                  <p>{'{'}</p>
                  <p className="pl-4"><span className="text-[#9CDCFE]">"status"</span>: <span className="text-[#CE9178]">"success"</span>,</p>
                  <p className="pl-4"><span className="text-[#9CDCFE]">"data"</span>: {'['}</p>
                  <p className="pl-8">{'{'} <span className="text-[#9CDCFE]">"id"</span>: <span className="text-[#B5CEA8]">1</span>, <span className="text-[#9CDCFE]">"name"</span>: <span className="text-[#CE9178]">"John"</span> {'}'},</p>
                  <p className="pl-8"><span className="text-[#6A9955] italic">... 99 more items</span></p>
                  <p className="pl-4">{']'}</p>
                  <p>{'}'}</p>
                </div>
              </div>

              <div className="absolute -bottom-4 -left-12 z-30 bg-[#F4F4F5] rounded-2xl p-4 shadow-[0_20px_50px_rgba(0,0,0,0.3)] flex items-center gap-4 border border-neutral03/20 animate-[float_5.5s_ease-in-out_infinite_1s]">
                <div className="w-12 h-12 rounded-full bg-[#E5F7ED] flex items-center justify-center text-[#23A455] relative shrink-0">
                  <CheckCircleIcon fontSize="medium" />
                  <span className="absolute top-0 right-0 w-3 h-3 bg-[#23A455] rounded-full border-2 border-[#F4F4F5] animate-ping"></span>
                </div>
                <div>
                  <p className="text-[15px] font-bold text-[#18181B] m-0 tracking-tight">Deployed successfully</p>
                  <div className="flex items-center gap-2 mt-1">
                    <span className="text-[12px] text-[#0284C7] font-mono bg-[#E0F2FE] px-2.5 py-0.5 rounded border border-[#0284C7]/20 font-semibold">Web + API Online</span>
                  </div>
                </div>
              </div>

            </div>
          </div>
        </div>

        {/* Animation สำหรับรูปด้านขวาใน hero card */}
        <style dangerouslySetInnerHTML={{
          __html: `
            @keyframes float {
              0%, 100% { transform: translateY(0); }
              50% { transform: translateY(-15px); }
            }
          `
        }} />
      </section>

      <section id="about" className="py-32 px-6 bg-neutral01 text-center relative">
        <h6 className="text-secondary03 font-bold tracking-[0.2em] uppercase mb-4">
          What is WEB2?
        </h6>

        <h1 className="text-5xl font-extrabold leading-tight">
          Stop fixing dependencies.
          <br className="mb-2" />
          Start grading what matters.
        </h1>

        <div className="mt-8 max-w-3xl mx-auto space-y-5">
          <p className="p1 text-neutral05 leading-relaxed">
            Every semester, web programming instructors spend hours setting up student projects, installing dependencies, and fixing broken environments so the projects can run properly and be ready for grading.
          </p>

          <p className="p1 text-neutral05 leading-relaxed">
            Meanwhile, students are left waiting without feedback and are unsure what went wrong or how to improve.
          </p>

          <p className="p1 text-neutral05 leading-relaxed font-medium text-black">
            WEB2 is built to solve this problem. Students simply submit their projects, and WEB2 handles everything else, from environment setup and security checks to plagiarism detection. Instructors can also create test cases for both frontend and backend assignments.
          </p>
        </div>
      </section>

      {/* FEATURES */}
      <section id="features" className="bg-secondary01 py-20 px-6">
        <div className="max-w-5xl mx-auto">

          <div className="text-center mb-12">
            <h2 className="text-primary03 text-3xl">Core Features</h2>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-8 w-full max-w-4xl mx-auto mb-16">
            {features.map((ft, i) => (
              <button
                key={ft.id}
                onClick={() => changeFeature(i)}
                className={`group relative flex flex-col items-center justify-center gap-4 py-6 px-4 rounded-2xl transition-all duration-300 border
     ${active === i
                    ? "bg-primary03 text-white shadow-md border-primary03 -translate-y-1"
                    : "bg-[#F8F9FA] text-neutral05 shadow-md border-neutral02/80 hover:bg-white"
                  }`}
              >
                {/* ICON */}
                <span
                  className={`text-5xl flex items-center drop-shadow-sm transition-colors duration-300
${active === i ? "text-white" : "text-neutral04 group-hover:text-primary03"}`}
                >
                  {ft.icon}
                </span>

                {/* LABEL */}
                <span className={`text-[14px] md:text-[15px] font-bold text-center leading-snug transition-colors
${active === i ? "text-white" : "text-neutral05 group-hover:text-primary03"}`}>
                  {ft.label}
                </span>
              </button>
            ))}
          </div>

          {/* PANEL */}
          <div
            className={`bg-white rounded-[2rem] p-8 md:p-12 shadow-xl shadow-neutral03/20 border border-neutral02 transition-all duration-300 transform ${fading ? "opacity-0 translate-y-4 scale-[0.98]" : "opacity-100 translate-y-0 scale-100"
              }`}
          >
            <div className="flex flex-col md:flex-row gap-12">

              <div className="flex-1 space-y-4">

                <h3 className="text-black leading-tight">{f.title}</h3>
                <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary01">
                  <p className="text-p2 font-bold text-primary03">{f.tagline}</p>
                </div>
                <p className="p2 text-neutral05 leading-relaxed">{f.desc}</p>
              </div>

              <div className="w-64 h-64 shrink-0 bg-primary01 rounded-[2rem] flex items-center justify-center text-8xl text-primary03 shadow-inner border border-current/5 transition-colors duration-500">
                {f.icon}
              </div>

            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="bg-gradient-to-r from-primary03 to-primary02 py-28 px-6 text-center">
        <h2 className="text-white text-4xl font-extrabold">Ready to upgrade your classroom?</h2>

        <p className="text-secondary02 mt-4 p1 max-w-lg mx-auto">
          Empower students to learn by doing, while giving professors more time to focus on meaningful mentorship.
        </p>
        <Link href="/auth">
          <button className="mt-10 bg-white text-primary03 px-12 py-4 rounded-xl font-bold shadow-xl shadow-black/10 hover:bg-neutral01 hover:-translate-y-1 transition-all active:scale-95 text-lg">
            Get started with WEB2
          </button></Link>
      </section>

    </div>
  );
}

