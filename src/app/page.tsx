import Footer from "@/components/Footer";
import Hero from "@/components/Hero";
import Nav from "@/components/Nav";
import SideNav from "@/components/SideNav";

export default function Home() {
  return (
    <>
      <Nav />
      <SideNav />
      <Hero />
      <article className="prose" />
      <Footer />
    </>
  );
}
