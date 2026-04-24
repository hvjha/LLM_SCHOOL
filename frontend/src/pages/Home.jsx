import React, { useEffect, useState } from "react";
import api from "../api/api";
import AllCourseCard from "../cards/AllCourseCard";
import TrainerCard from "../cards/TrainerCard";
import HeroSection from "../components/HeroSection";
import { FaArrowRight, FaUsers, FaBookReader, FaStar, FaGraduationCap } from "react-icons/fa";

export default function Home() {
  const [courses, setCourses] = useState([]);
  const [trainers, setTrainers] = useState([]);

  useEffect(() => {
    (async () => {
      try {
        const res = await api.get("/api/course/courses");
        setCourses(res.data.courses || []);
      } catch (e) {
        console.error("Failed fetching courses:", e);
      }
    })();

    (async () => {
      try {
        const res = await api.get("/api/admin/users");
        const users = res.data.users || [];
        setTrainers(users.filter((u) => u.role === "trainer"));
      } catch (e) {
        console.error("Failed fetching trainers:", e);
      }
    })();
  }, []);

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <HeroSection />

      <main className="container mx-auto px-6 py-24 space-y-32">
        
        {/* Features Section */}
        <section className="grid grid-cols-1 md:grid-cols-3 gap-10">
          {[
            { icon: <FaGraduationCap />, title: "Quality Education", text: "Learn from industry-standard curriculum and expert mentors." },
            { icon: <FaUsers />, title: "Expert Trainers", text: "Our trainers bring years of real-world experience to your screen." },
            { icon: <FaBookReader />, title: "Advanced Library", text: "Reserve and access learning materials with our seamless system." }
          ].map((feature, i) => (
            <div key={i} className={`p-10 rounded-[2.5rem] glass-card hover-lift hover-red-glow transition-all group animate-fade-in-up delay-${(i+1)*100}`}>
              <div className="w-16 h-16 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center text-3xl mb-8 border border-blue-100 transition-all group-hover:scale-110 group-hover:bg-blue-600 group-hover:text-white group-hover:rotate-6">
                {feature.icon}
              </div>
              <h3 className="text-2xl font-black text-slate-900 mb-4 tracking-tight">
                {feature.title}
              </h3>
              <p className="text-slate-500 leading-relaxed font-medium text-[15px]">{feature.text}</p>
            </div>
          ))}
        </section>

        {/* Courses Section */}
        <section className="space-y-16 animate-fade-in-up">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-8">
            <div className="space-y-4">
              <h2 className="text-4xl lg:text-5xl font-black text-slate-900 tracking-tight">Explore Our <span className="text-blue-600">Courses</span></h2>
              <p className="text-slate-500 max-w-2xl text-lg font-medium">Unlock new opportunities with our professionally curated courses. From development to design, we have it all.</p>
            </div>
            <button className="flex items-center gap-3 text-blue-600 font-black uppercase tracking-widest text-xs hover:gap-5 transition-all group px-6 py-3 bg-blue-50 rounded-full border border-blue-100">
              View All Curriculums <FaArrowRight />
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-10">
            {courses.slice(0, 6).map((c, i) => (
              <div key={c._id} className={`animate-fade-in-up delay-${(i % 3 + 1) * 100}`}>
                <AllCourseCard course={c} />
              </div>
            ))}
          </div>
        </section>

        {/* Trainers Section */}
        <section className="space-y-16 bg-blue-50/50 border border-blue-100 -mx-6 px-6 py-24 rounded-[4rem] animate-fade-in-up">
          <div className="text-center space-y-4 max-w-3xl mx-auto">
            <h2 className="text-4xl lg:text-5xl font-black text-slate-900 tracking-tight">Our World-Class Trainers</h2>
            <p className="text-slate-500 text-lg font-medium">Learn directly from professionals working in top tech companies across the globe.</p>
          </div>

          <div className="flex overflow-x-auto no-scrollbar pb-8 gap-8 px-4 md:grid md:grid-cols-2 lg:grid-cols-4 md:px-0">
            {trainers.map((t, i) => (
              <div key={t._id} className={`animate-fade-in-up delay-${(i % 4 + 1) * 100} shrink-0`}>
                <TrainerCard trainer={t} />
              </div>
            ))}
          </div>
        </section>

        {/* CTA Section */}
        <section className="bg-slate-900 rounded-[3rem] p-12 md:p-20 text-center text-white space-y-10 relative overflow-hidden shadow-2xl shadow-slate-900/20 animate-scale-in">
          <div className="absolute top-0 right-0 w-96 h-96 bg-blue-600/10 rounded-full -mr-48 -mt-48 blur-3xl"></div>
          <div className="absolute bottom-0 left-0 w-96 h-96 bg-red-600/10 rounded-full -ml-48 -mb-48 blur-3xl"></div>
          <div className="space-y-10 relative z-10">
            <h2 className="text-4xl lg:text-6xl font-black text-white leading-tight tracking-tighter">Ready to Start Your <br /><span className="text-blue-500">Learning Adventure?</span></h2>
            <p className="text-slate-400 text-xl max-w-2xl mx-auto font-medium">Join 5000+ students already learning and growing with our elite community.</p>
            <div className="flex flex-col sm:flex-row justify-center gap-6">
              <button className="px-12 py-5 bg-blue-600 text-white rounded-[2rem] font-black hover:bg-blue-700 shadow-2xl shadow-blue-600/40 transition-all border border-blue-400/30 scale-100 hover:scale-105 active:scale-95">Get Started Now</button>
              <button className="px-12 py-5 bg-white/10 text-white border border-white/20 rounded-[2rem] font-black hover:bg-white/20 transition-all backdrop-blur-md">Learn More</button>
            </div>
          </div>
        </section>

      </main>
    </div>
  );
}

