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
import Trajetoria from "@/components/trajetoria/Trajetoria";

export default function Home() {
  return (
    <>
      <Nav />
      <SideNav />
      <Hero />
      <HistoriaDonaAna />
      <Trajetoria />
      <RevelarAoRolar>
        <Introducao />
        <Cruzamento />
        <GraficoAbas />
        <CarrosselPerfis />
        <Comunicacao />
        <SegurancaEDisponibilidade />
      </RevelarAoRolar>
      <Footer />
    </>
  );
}
