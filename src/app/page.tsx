import CarrosselPerfis from "@/components/CarrosselPerfis";
import Comunicacao from "@/components/Comunicacao";
import Cruzamento from "@/components/Cruzamento";
import Footer from "@/components/Footer";
import GraficoAbas from "@/components/GraficoAbas";
import Hero from "@/components/Hero";
import Introducao from "@/components/Introducao";
import Nav from "@/components/Nav";
import RevelarAoRolar from "@/components/RevelarAoRolar";
import SegurancaEDisponibilidade from "@/components/SegurancaEDisponibilidade";
import SideNav from "@/components/SideNav";
import HistoriaDonaAna from "@/components/historia/HistoriaDonaAna";
import SedeEm3D from "@/components/sede/SedeEm3D";

export default function Home() {
  return (
    <>
      <Nav />
      <SideNav />
      <Hero />
      <HistoriaDonaAna />
      <RevelarAoRolar>
        <Introducao />
        <Cruzamento />
        <GraficoAbas />
        <CarrosselPerfis />
        <Comunicacao />
        <SegurancaEDisponibilidade />
        <SedeEm3D />
      </RevelarAoRolar>
      <Footer />
    </>
  );
}
