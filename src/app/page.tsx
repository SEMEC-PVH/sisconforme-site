import Footer from "@/components/Footer";
import Hero from "@/components/Hero";
import Nav from "@/components/Nav";
import SideNav from "@/components/SideNav";
import HistoriaDonaAna from "@/components/historia/HistoriaDonaAna";

export default function Home() {
  return (
    <>
      <Nav />
      <SideNav />
      <Hero />
      <HistoriaDonaAna />
      <article className="prose" />
      <Footer />
    </>
  );
}
