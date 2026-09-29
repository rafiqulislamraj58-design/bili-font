"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { Button } from "@heroui/react";
import { BookOpen, ChevronLeft, ChevronRight } from "lucide-react";
import gsap from "gsap";

const slides = [
  {
    image:
      "https://images.unsplash.com/photo-1507842217343-583bb7270b66?auto=format&fit=crop&w=2000&q=85",
    title: "Your Local Library, Delivered",
    description:
      "Discover thousands of books, explore new stories, and bring your next great read home.",
  },
  {
    image:
      "https://images.unsplash.com/photo-1521587760476-6c12a4b040da?auto=format&fit=crop&w=2000&q=85",
    title: "Find Your Next Favorite Book",
    description:
      "Browse our collection and discover books for every mood, interest, and imagination.",
  },
  {
    image:
      "https://images.unsplash.com/photo-1495446815901-a7297e633e8d?auto=format&fit=crop&w=2000&q=85",
    title: "A World of Stories Awaits",
    description:
      "From timeless classics to modern favorites, your next adventure starts here.",
  },
];

export default function HeroSection() {
  const [current, setCurrent] = useState(0);

  const heroRef = useRef(null);
  const imageRef = useRef(null);
  const badgeRef = useRef(null);
  const titleRef = useRef(null);
  const descriptionRef = useRef(null);
  const buttonsRef = useRef(null);
  const controlsRef = useRef(null);

  // Initial animation
  useEffect(() => {
    const ctx = gsap.context(() => {
      const tl = gsap.timeline({
        defaults: {
          ease: "power3.out",
        },
      });

      tl.from(imageRef.current, {
        scale: 1.15,
        duration: 1.5,
      })
        .from(
          badgeRef.current,
          {
            y: 30,
            opacity: 0,
            duration: 0.7,
          },
          "-=1"
        )
        .from(
          titleRef.current,
          {
            y: 70,
            opacity: 0,
            duration: 1,
          },
          "-=0.4"
        )
        .from(
          descriptionRef.current,
          {
            y: 30,
            opacity: 0,
            duration: 0.7,
          },
          "-=0.5"
        )
        .from(
          buttonsRef.current,
          {
            y: 30,
            opacity: 0,
            duration: 0.7,
          },
          "-=0.4"
        )
        .from(
          controlsRef.current,
          {
            opacity: 0,
            duration: 0.5,
          },
          "-=0.3"
        );
    }, heroRef);

    return () => ctx.revert();
  }, []);

  // Slide animation
  useEffect(() => {
    if (!heroRef.current) return;

    const ctx = gsap.context(() => {
      const tl = gsap.timeline();

      tl.to(
        imageRef.current,
        {
          scale: 1.08,
          opacity: 0,
          duration: 0.45,
          ease: "power2.in",
        }
      )
        .set(imageRef.current, {
          scale: 1.15,
        })
        .to(imageRef.current, {
          opacity: 1,
          scale: 1,
          duration: 0.8,
          ease: "power3.out",
        });

      gsap.fromTo(
        [badgeRef.current, titleRef.current, descriptionRef.current, buttonsRef.current],
        {
          y: 40,
          opacity: 0,
        },
        {
          y: 0,
          opacity: 1,
          duration: 0.7,
          stagger: 0.1,
          ease: "power3.out",
        }
      );
    }, heroRef);

    return () => ctx.revert();
  }, [current]);

  const nextSlide = () => {
    setCurrent((prev) => (prev + 1) % slides.length);
  };

  const prevSlide = () => {
    setCurrent((prev) => (prev - 1 + slides.length) % slides.length);
  };

  // Auto slider
  useEffect(() => {
    const interval = setInterval(() => {
      nextSlide();
    }, 6000);

    return () => clearInterval(interval);
  }, []);

  return (
    <section
      ref={heroRef}
      className="relative h-[600px] w-full overflow-hidden"
    >
      {/* Background */}
      <div className="absolute inset-0">
        <img
          ref={imageRef}
          src={slides[current].image}
          alt={slides[current].title}
          className="h-full w-full object-cover"
        />

        {/* Dark overlay */}
        <div className="absolute inset-0 bg-black/60" />

        {/* Gradient */}
        <div className="absolute inset-0 bg-gradient-to-r from-black/90 via-black/60 to-black/20" />
      </div>

      {/* Content */}
      <div className="relative z-10 flex h-full items-center">
        <div className="mx-auto w-full max-w-7xl px-6 lg:px-8">
          <div className="max-w-3xl text-white">

            {/* Badge */}
            <div
              ref={badgeRef}
              className="mb-5 inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-4 py-2 text-sm backdrop-blur-md"
            >
              <BookOpen size={17} />

              <span>Your Community Library</span>
            </div>

            {/* Heading */}
            <h1
              ref={titleRef}
              className="text-5xl font-bold leading-tight tracking-tight sm:text-6xl lg:text-7xl"
            >
              {slides[current].title}
            </h1>

            {/* Description */}
            <p
              ref={descriptionRef}
              className="mt-6 max-w-2xl text-lg leading-8 text-gray-200 sm:text-xl"
            >
              {slides[current].description}
            </p>

            {/* Buttons */}
            <div
              ref={buttonsRef}
              className="mt-8 flex flex-wrap gap-4"
            >
              <Button
                as={Link}
                href="/books"
                color="primary"
                size="lg"
                radius="full"
                className="px-8 font-semibold"
              >
                Browse Books
              </Button>

              <Button
                as={Link}
                href="/about"
                variant="bordered"
                size="lg"
                radius="full"
                className="border-white/40 px-8 text-white"
              >
                Learn More
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Previous */}
      <button
        onClick={prevSlide}
        className="absolute left-5 top-1/2 z-20 flex h-12 w-12 -translate-y-1/2 items-center justify-center rounded-full border border-white/20 bg-black/30 text-white backdrop-blur-md transition hover:bg-black/60"
      >
        <ChevronLeft size={24} />
      </button>

      {/* Next */}
      <button
        onClick={nextSlide}
        className="absolute right-5 top-1/2 z-20 flex h-12 w-12 -translate-y-1/2 items-center justify-center rounded-full border border-white/20 bg-black/30 text-white backdrop-blur-md transition hover:bg-black/60"
      >
        <ChevronRight size={24} />
      </button>

      {/* Dots */}
      <div
        ref={controlsRef}
        className="absolute bottom-8 left-1/2 z-20 flex -translate-x-1/2 gap-2"
      >
        {slides.map((_, index) => (
          <button
            key={index}
            onClick={() => setCurrent(index)}
            className={`h-2 rounded-full transition-all duration-300 ${
              index === current
                ? "w-8 bg-white"
                : "w-2 bg-white/50"
            }`}
          />
        ))}
      </div>
    </section>
  );
}