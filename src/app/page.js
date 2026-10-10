import FeaturedBooks from "@/components/FeaturedBooks";
import HeroSection from "@/components/HeroSection";
import TopLibrarians from "@/components/TopLibrarians";
import PropularCategories from "@/components/PopularCategories";


import Image from "next/image";

export default function Home() {
  return (
    <div className="flex flex-col flex-1 items-center justify-center bg-zinc-50 font-sans dark:bg-black">
      <HeroSection/>,
      <FeaturedBooks/>,
      <TopLibrarians/>,
      <PropularCategories/>,
      
    </div>
  );
}
