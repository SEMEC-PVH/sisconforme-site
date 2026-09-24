import CarrosselPerfis from "@/components/CarrosselPerfis";
import Comunicacao from "@/components/Comunicacao";
import Cruzamento from "@/components/Cruzamento";
import Footer from "@/components/Footer";
import GraficoAbas from "@/components/GraficoAbas";
import Hero from "@/components/Hero";
import Introducao from "@/components/Introducao";
import Nav from "@/components/Nav";
import SegurancaEDisponibilidade from "@/components/SegurancaEDisponibilidade";
import SideNav from "@/components/SideNav";
import HistoriaDonaAna from "@/components/historia/HistoriaDonaAna";

export default function Home() {
  return (
    <>
      <Nav />
      <SideNav />
      <Hero />
      <HistoriaDonaAna />
      <article className="prose">
        <Introducao />
        <Cruzamento />
        <GraficoAbas />
        <CarrosselPerfis />
        <Comunicacao />
        <SegurancaEDisponibilidade />
      </article>
      <Footer />
    </>
  );
}
