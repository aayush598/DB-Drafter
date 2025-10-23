"use client";

import { useState, useEffect, useRef } from "react";
import { motion, useScroll, useTransform, useInView } from "framer-motion";
import {
  Database,
  Zap,
  Shield,
  Code2,
  ArrowRight,
  Sparkles,
  GitBranch,
  FileCode,
  Layers,
  Terminal,
  Star,
  ChevronDown,
  Cpu,
  Boxes,
  Workflow,
  Binary,
  CircuitBoard,
  Braces,
  Moon,
  Sun,
} from "lucide-react";

export default function HomePage() {
  const [isDark, setIsDark] = useState(false);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const { scrollYProgress } = useScroll();
  const heroRef = useRef(null);
  const featuresRef = useRef(null);
  const isInView = useInView(featuresRef, { once: true, margin: "-100px" });

  useEffect(() => {
    const savedTheme = localStorage.getItem("theme");
    setIsDark(savedTheme === "dark");
  }, []);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      setMousePosition({ x: e.clientX, y: e.clientY });
    };
    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, []);

  const toggleTheme = () => {
    const newTheme = !isDark;
    setIsDark(newTheme);
    localStorage.setItem("theme", newTheme ? "dark" : "light");
  };

  const features = [
    {
      icon: Zap,
      title: "Lightning Fast Generation",
      description: "Generate complete database schemas in seconds with Google Gemini 2.0. From concept to code faster than ever.",
      color: "from-amber-400 via-orange-500 to-red-500",
      bgPattern: "radial-gradient(circle at 20% 50%, rgba(251, 191, 36, 0.15), transparent 50%)",
    },
    {
      icon: Database,
      title: "Intelligent Architecture",
      description: "AI-powered relationship mapping with automatic dependency resolution. Perfect foreign keys, every time.",
      color: "from-cyan-400 via-blue-500 to-indigo-600",
      bgPattern: "radial-gradient(circle at 80% 50%, rgba(59, 130, 246, 0.15), transparent 50%)",
    },
    {
      icon: Code2,
      title: "Universal Code Export",
      description: "8+ languages, 20+ frameworks. Generate production-ready models, migrations, and repositories instantly.",
      color: "from-purple-400 via-pink-500 to-rose-500",
      bgPattern: "radial-gradient(circle at 50% 80%, rgba(168, 85, 247, 0.15), transparent 50%)",
    },
    {
      icon: Shield,
      title: "Enterprise Grade Security",
      description: "Built-in best practices with automatic constraints, indexes, and validation. Production-ready from day one.",
      color: "from-emerald-400 via-green-500 to-teal-600",
      bgPattern: "radial-gradient(circle at 50% 20%, rgba(16, 185, 129, 0.15), transparent 50%)",
    },
  ];

  const technologies = [
    { icon: Cpu, name: "Python", color: "text-blue-400" },
    { icon: Braces, name: "TypeScript", color: "text-blue-500" },
    { icon: Binary, name: "Java", color: "text-orange-500" },
    { icon: CircuitBoard, name: "Go", color: "text-cyan-400" },
    { icon: Workflow, name: "C#", color: "text-purple-500" },
    { icon: Boxes, name: "Ruby", color: "text-red-500" },
  ];

  const navigateToDashboard = () => {
    window.location.href = "/dashboard";
  };

  return (
    <div
      className={`min-h-screen transition-colors duration-500 overflow-hidden ${
        isDark
          ? "bg-[#0a0a0f]"
          : "bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50"
      }`}
    >
      {/* Floating Theme Toggle */}
      <motion.button
        initial={{ opacity: 0, scale: 0 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 1 }}
        onClick={toggleTheme}
        className={`fixed top-6 right-6 z-50 p-4 rounded-2xl backdrop-blur-xl border shadow-2xl transition-all duration-300 ${
          isDark
            ? "bg-gray-800/50 border-gray-700 hover:bg-gray-700/50"
            : "bg-white/50 border-gray-200 hover:bg-white/80"
        }`}
      >
        {isDark ? (
          <Sun className="w-6 h-6 text-yellow-400" />
        ) : (
          <Moon className="w-6 h-6 text-indigo-600" />
        )}
      </motion.button>

      {/* Advanced Background Effects */}
      <div className="fixed inset-0 pointer-events-none">
        {/* Animated Gradient Orbs */}
        <motion.div
          animate={{
            x: mousePosition.x / 50,
            y: mousePosition.y / 50,
          }}
          transition={{ type: "spring", damping: 30 }}
          className="absolute top-0 left-0 w-[800px] h-[800px] rounded-full blur-3xl opacity-20"
          style={{
            background: isDark
              ? "radial-gradient(circle, rgba(59, 130, 246, 0.4), transparent 70%)"
              : "radial-gradient(circle, rgba(99, 102, 241, 0.3), transparent 70%)",
          }}
        />
        <motion.div
          animate={{
            x: -mousePosition.x / 60,
            y: -mousePosition.y / 60,
          }}
          transition={{ type: "spring", damping: 30 }}
          className="absolute bottom-0 right-0 w-[600px] h-[600px] rounded-full blur-3xl opacity-20"
          style={{
            background: isDark
              ? "radial-gradient(circle, rgba(168, 85, 247, 0.4), transparent 70%)"
              : "radial-gradient(circle, rgba(236, 72, 153, 0.3), transparent 70%)",
          }}
        />

        {/* Animated Grid */}
        <div
          className={`absolute inset-0 ${isDark ? "opacity-10" : "opacity-20"}`}
          style={{
            backgroundImage: `linear-gradient(${
              isDark ? "rgba(255,255,255,0.03)" : "rgba(0,0,0,0.03)"
            } 2px, transparent 2px), linear-gradient(90deg, ${
              isDark ? "rgba(255,255,255,0.03)" : "rgba(0,0,0,0.03)"
            } 2px, transparent 2px)`,
            backgroundSize: "60px 60px",
          }}
        />

        {/* Floating Particles */}
        {[...Array(20)].map((_, i) => (
          <motion.div
            key={i}
            className={`absolute w-2 h-2 rounded-full ${
              isDark ? "bg-blue-400/30" : "bg-indigo-400/30"
            }`}
            animate={{
              y: [0, -30, 0],
              x: [0, Math.random() * 20 - 10, 0],
              opacity: [0.3, 0.8, 0.3],
            }}
            transition={{
              duration: 3 + Math.random() * 2,
              repeat: Infinity,
              delay: Math.random() * 2,
            }}
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
            }}
          />
        ))}
      </div>

      {/* Hero Section */}
      <section ref={heroRef} className="relative min-h-screen flex items-center justify-center px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto w-full">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            {/* Left Content */}
            <div className="space-y-8">
              {/* Badge */}
              <motion.div
                initial={{ opacity: 0, x: -50 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.6 }}
                className="inline-flex"
              >
                <div className={`inline-flex items-center gap-3 px-5 py-3 rounded-2xl backdrop-blur-xl border shadow-xl ${
                  isDark
                    ? "bg-gradient-to-r from-blue-500/10 to-purple-500/10 border-blue-500/20"
                    : "bg-gradient-to-r from-blue-100 to-purple-100 border-blue-300"
                }`}>
                  <Sparkles className={`w-5 h-5 ${isDark ? "text-blue-400" : "text-blue-600"}`} />
                  <span className={`font-semibold ${isDark ? "text-blue-300" : "text-blue-700"}`}>
                    Powered by Gemini 2.0 Flash
                  </span>
                </div>
              </motion.div>

              {/* Heading */}
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.2 }}
                className="space-y-6"
              >
                <h1 className={`text-6xl lg:text-7xl xl:text-8xl font-black leading-tight ${
                  isDark ? "text-white" : "text-gray-900"
                }`}>
                  Build Better
                  <br />
                  <span className="relative inline-block">
                    <span className="bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 bg-clip-text text-transparent">
                      Databases
                    </span>
                    <motion.div
                      className="absolute -bottom-2 left-0 right-0 h-3 bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 opacity-30 blur-lg"
                      animate={{ opacity: [0.3, 0.6, 0.3] }}
                      transition={{ duration: 2, repeat: Infinity }}
                    />
                  </span>
                </h1>
                <p className={`text-2xl lg:text-3xl font-light ${
                  isDark ? "text-gray-300" : "text-gray-600"
                }`}>
                  AI-powered schema design that transforms ideas into production-ready code in minutes.
                </p>
              </motion.div>

              {/* CTA Buttons */}
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.4 }}
                className="flex flex-col sm:flex-row gap-4"
              >
                <button
                  onClick={navigateToDashboard}
                  className="group relative px-10 py-5 bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 text-white rounded-2xl font-bold text-xl shadow-2xl overflow-hidden transition-all duration-300 hover:shadow-purple-500/50 hover:scale-105"
                >
                  <span className="relative z-10 flex items-center justify-center gap-3">
                    Start Building Free
                    <ArrowRight className="w-6 h-6 group-hover:translate-x-2 transition-transform" />
                  </span>
                  <motion.div
                    className="absolute inset-0 bg-gradient-to-r from-blue-700 via-purple-700 to-pink-700"
                    initial={{ x: "100%" }}
                    whileHover={{ x: 0 }}
                    transition={{ duration: 0.3 }}
                  />
                </button>

                <button
                  onClick={() => document.getElementById("features")?.scrollIntoView({ behavior: "smooth" })}
                  className={`px-10 py-5 rounded-2xl font-bold text-xl border-2 backdrop-blur-xl transition-all duration-300 hover:scale-105 ${
                    isDark
                      ? "border-gray-700 text-white hover:bg-gray-800/50"
                      : "border-gray-300 text-gray-900 hover:bg-white/50"
                  }`}
                >
                  Explore Features
                </button>
              </motion.div>

              {/* Tech Icons */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.8 }}
                className="flex items-center gap-4 pt-8"
              >
                {technologies.map((tech, idx) => (
                  <motion.div
                    key={idx}
                    whileHover={{ scale: 1.2, rotate: 360 }}
                    transition={{ duration: 0.5 }}
                    className={`w-12 h-12 rounded-xl backdrop-blur-xl border flex items-center justify-center ${
                      isDark
                        ? "bg-gray-800/50 border-gray-700"
                        : "bg-white/50 border-gray-200"
                    }`}
                  >
                    <tech.icon className={`w-6 h-6 ${tech.color}`} />
                  </motion.div>
                ))}
              </motion.div>
            </div>

            {/* Right Visual */}
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 1, delay: 0.3 }}
              className="relative"
            >
              <div className="relative w-full aspect-square">
                {/* Rotating Rings */}
                {[...Array(3)].map((_, i) => (
                  <motion.div
                    key={i}
                    className={`absolute inset-0 rounded-full border-4 ${
                      isDark ? "border-blue-500/20" : "border-indigo-300/30"
                    }`}
                    style={{
                      margin: `${i * 60}px`,
                    }}
                    animate={{ rotate: 360 }}
                    transition={{
                      duration: 20 + i * 5,
                      repeat: Infinity,
                      ease: "linear",
                    }}
                  />
                ))}

                {/* Center Database Icon */}
                <motion.div
                  className="absolute inset-0 flex items-center justify-center"
                  animate={{ 
                    scale: [1, 1.1, 1],
                    rotate: [0, 5, -5, 0]
                  }}
                  transition={{ duration: 4, repeat: Infinity }}
                >
                  <div className={`p-12 rounded-3xl backdrop-blur-2xl border-4 shadow-2xl ${
                    isDark
                      ? "bg-gradient-to-br from-blue-900/50 to-purple-900/50 border-blue-500/30"
                      : "bg-gradient-to-br from-blue-100/80 to-purple-100/80 border-blue-300"
                  }`}>
                    <Database className={`w-32 h-32 ${isDark ? "text-blue-400" : "text-indigo-600"}`} />
                  </div>
                </motion.div>

                {/* Orbiting Icons */}
                {[FileCode, GitBranch, Layers, Terminal].map((Icon, idx) => (
                  <motion.div
                    key={idx}
                    className={`absolute w-16 h-16 rounded-2xl backdrop-blur-xl border-2 flex items-center justify-center shadow-xl ${
                      isDark
                        ? "bg-gray-800/80 border-gray-700"
                        : "bg-white/80 border-gray-200"
                    }`}
                    style={{
                      top: "50%",
                      left: "50%",
                      marginTop: "-32px",
                      marginLeft: "-32px",
                    }}
                    animate={{
                      x: [0, Math.cos(idx * Math.PI / 2) * 200, 0],
                      y: [0, Math.sin(idx * Math.PI / 2) * 200, 0],
                      rotate: [0, 360],
                    }}
                    transition={{
                      duration: 8,
                      repeat: Infinity,
                      delay: idx * 0.5,
                    }}
                  >
                    <Icon className={`w-8 h-8 ${isDark ? "text-blue-400" : "text-indigo-600"}`} />
                  </motion.div>
                ))}
              </div>
            </motion.div>
          </div>

          {/* Scroll Indicator */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1.5 }}
            className="absolute bottom-12 left-1/2 -translate-x-1/2"
          >
            <motion.div
              animate={{ y: [0, 15, 0] }}
              transition={{ duration: 2, repeat: Infinity }}
              className="flex flex-col items-center gap-2"
            >
              <span className={`text-sm font-medium ${isDark ? "text-gray-400" : "text-gray-600"}`}>
                Scroll to explore
              </span>
              <ChevronDown className={`w-6 h-6 ${isDark ? "text-blue-400" : "text-indigo-600"}`} />
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* Animated Stats Bar */}
      <motion.section
        initial={{ opacity: 0, y: 50 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        viewport={{ once: true }}
        className="relative py-20 px-4"
      >
        <div className="max-w-7xl mx-auto">
          <div className={`relative rounded-3xl p-12 backdrop-blur-2xl border overflow-hidden ${
            isDark
              ? "bg-gradient-to-r from-gray-800/50 via-gray-900/50 to-gray-800/50 border-gray-700"
              : "bg-gradient-to-r from-white/80 via-blue-50/80 to-white/80 border-gray-200"
          }`}>
            <motion.div
              className="absolute inset-0 bg-gradient-to-r from-blue-500/10 via-purple-500/10 to-pink-500/10"
              animate={{ x: ["0%", "100%", "0%"] }}
              transition={{ duration: 10, repeat: Infinity }}
            />
            <div className="relative grid grid-cols-2 md:grid-cols-4 gap-8">
              {[
                { value: "8+", label: "Languages" },
                { value: "20+", label: "Frameworks" },
                { value: "<30s", label: "Generation Time" },
                { value: "100%", label: "Open Source" },
              ].map((stat, idx) => (
                <motion.div
                  key={idx}
                  initial={{ scale: 0 }}
                  whileInView={{ scale: 1 }}
                  transition={{ delay: idx * 0.1, type: "spring" }}
                  viewport={{ once: true }}
                  className="text-center"
                >
                  <div className="text-5xl lg:text-6xl font-black bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 bg-clip-text text-transparent mb-2">
                    {stat.value}
                  </div>
                  <div className={`text-lg font-semibold ${isDark ? "text-gray-400" : "text-gray-600"}`}>
                    {stat.label}
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </motion.section>

      {/* Features Section */}
      <section id="features" ref={featuresRef} className="relative py-32 px-4">
        <div className="max-w-7xl mx-auto">
          {/* Section Header */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.8 }}
            className="text-center mb-20"
          >
            <h2 className={`text-5xl lg:text-6xl font-black mb-6 ${
              isDark ? "text-white" : "text-gray-900"
            }`}>
              Supercharged Features
            </h2>
            <p className={`text-2xl ${isDark ? "text-gray-400" : "text-gray-600"}`}>
              Everything you need to build world-class databases
            </p>
          </motion.div>

          {/* Features Grid */}
          <div className="grid md:grid-cols-2 gap-8">
            {features.map((feature, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, y: 50 }}
                animate={isInView ? { opacity: 1, y: 0 } : {}}
                transition={{ delay: idx * 0.2, duration: 0.8 }}
                whileHover={{ scale: 1.02, y: -5 }}
                className="group relative"
              >
                <div
                  className={`relative h-full p-10 rounded-3xl backdrop-blur-xl border-2 overflow-hidden transition-all duration-500 ${
                    isDark
                      ? "bg-gray-800/30 border-gray-700 hover:border-gray-600 hover:bg-gray-800/50"
                      : "bg-white/60 border-gray-200 hover:border-gray-300 hover:bg-white/80"
                  }`}
                  style={{ background: isDark ? feature.bgPattern : undefined }}
                >
                  {/* Animated Background Gradient */}
                  <motion.div
                    className={`absolute inset-0 bg-gradient-to-br ${feature.color} opacity-0 group-hover:opacity-10 transition-opacity duration-500`}
                    animate={{
                      backgroundPosition: ["0% 0%", "100% 100%"],
                    }}
                    transition={{ duration: 3, repeat: Infinity, repeatType: "reverse" }}
                  />

                  {/* Icon */}
                  <motion.div
                    whileHover={{ rotate: 360, scale: 1.1 }}
                    transition={{ duration: 0.6 }}
                    className={`relative w-20 h-20 rounded-2xl bg-gradient-to-br ${feature.color} flex items-center justify-center mb-8 shadow-2xl`}
                  >
                    <feature.icon className="w-10 h-10 text-white" />
                    <motion.div
                      className={`absolute inset-0 rounded-2xl bg-gradient-to-br ${feature.color} blur-xl opacity-50`}
                      animate={{ scale: [1, 1.2, 1] }}
                      transition={{ duration: 2, repeat: Infinity }}
                    />
                  </motion.div>

                  {/* Content */}
                  <h3 className={`text-3xl font-bold mb-4 ${
                    isDark ? "text-white" : "text-gray-900"
                  }`}>
                    {feature.title}
                  </h3>
                  <p className={`text-lg leading-relaxed ${
                    isDark ? "text-gray-300" : "text-gray-600"
                  }`}>
                    {feature.description}
                  </p>

                  {/* Hover Arrow */}
                  <motion.div
                    initial={{ x: -10, opacity: 0 }}
                    whileHover={{ x: 0, opacity: 1 }}
                    className="absolute bottom-8 right-8"
                  >
                    <ArrowRight className={`w-8 h-8 ${isDark ? "text-blue-400" : "text-indigo-600"}`} />
                  </motion.div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="relative py-32 px-4">
        <div className="max-w-5xl mx-auto">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="relative"
          >
            <div className={`relative rounded-[3rem] p-16 backdrop-blur-2xl border-2 overflow-hidden ${
              isDark
                ? "bg-gradient-to-br from-blue-900/30 via-purple-900/30 to-pink-900/30 border-blue-500/30"
                : "bg-gradient-to-br from-blue-100 via-purple-100 to-pink-100 border-blue-300"
            }`}>
              {/* Animated Background */}
              <motion.div
                className="absolute inset-0 opacity-30"
                animate={{
                  backgroundPosition: ["0% 0%", "100% 100%"],
                }}
                transition={{ duration: 10, repeat: Infinity, repeatType: "reverse" }}
                style={{
                  backgroundImage: `radial-gradient(circle at 50% 50%, rgba(59, 130, 246, 0.3), transparent 50%)`,
                  backgroundSize: "200% 200%",
                }}
              />

              <div className="relative text-center space-y-8">
                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
                >
                  <Star className="w-20 h-20 mx-auto text-yellow-500" />
                </motion.div>

                <h2 className={`text-5xl lg:text-6xl font-black ${
                  isDark ? "text-white" : "text-gray-900"
                }`}>
                  Ready to Transform Your
                  <br />
                  <span className="bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 bg-clip-text text-transparent">
                    Database Workflow?
                  </span>
                </h2>

                <p className={`text-2xl ${isDark ? "text-gray-300" : "text-gray-700"}`}>
                  Join developers building better databases with AI
                </p>

                <button
                  onClick={navigateToDashboard}
                  className="group relative px-12 py-6 bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 text-white rounded-2xl font-bold text-2xl shadow-2xl hover:shadow-purple-500/50 transition-all duration-300 hover:scale-105"
                >
                  <span className="relative z-10 flex items-center justify-center gap-3">
                    Start Building Now
                    <ArrowRight className="w-8 h-8 group-hover:translate-x-2 transition-transform" />
                  </span>
                </button>

                <p className={`text-sm ${isDark ? "text-gray-500" : "text-gray-600"}`}>
                  No credit card required • Free forever • Open source
                </p>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Footer */}
      <footer className={`border-t ${
        isDark ? "border-gray-800 bg-gray-900/50" : "border-gray-200 bg-white/50"
      }`}>
        <div className="max-w-7xl mx-auto px-4 py-12">
          <div className="flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="flex items-center gap-4">
              <div className="w-14 h-14 bg-gradient-to-br from-blue-500 via-purple-500 to-pink-500 rounded-2xl flex items-center justify-center shadow-xl">
                <Database className="w-8 h-8 text-white" />
              </div>
              <div>
                <div className={`font-black text-xl ${isDark ? "text-white" : "text-gray-900"}`}>
                  DB Drafter
                </div>
                <div className={`text-sm ${isDark ? "text-gray-500" : "text-gray-600"}`}>
                  Powered by Google Gemini 2.0 Flash
                </div>
              </div>
            </div>
            <div className={`text-sm ${isDark ? "text-gray-500" : "text-gray-600"}`}>
              Built with Next.js, TypeScript & Framer Motion
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}