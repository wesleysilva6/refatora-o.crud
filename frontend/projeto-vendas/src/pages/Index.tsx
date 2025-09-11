import { Link } from "react-router-dom";
import Footer from "../components/footer/Footer"

import logoHeader from "../assets/img/logo_stexto.png";
import titleHeader from "../assets/img/fundop2.png";
import logoCaixa from "../assets/img/caixa_fundop.png";
import logoEstoque from "../assets/img/fundop.png";

import "../css/style.css";

export default function Home() {
  return (
    <div className="min-vh-100 d-flex flex-column">
      {/* NAVBAR */}
      <nav className="navbar">
        <div className="container-fluid">
          <Link to="/" className="navbar-brand d-flex align-items-center gap-2">
            <img src={logoHeader} width={65} alt="Estoque Aqui" />
            <img src={titleHeader} width={85} height={65} alt="Estoque Aqui" />
          </Link>
        </div>
      </nav>

      {/* INÍCIO */}
    <section id="inicio" className="">
        <div className="container">
            <div className="row align-items-center justify-content-between">
                <div className="col-md-8">
                <h3>Seja Bem-Vindo a ESTOQUE AQUI !</h3>
                <p> Seja bem-vindo ao nosso Sistema de Controle de Estoque, uma plataforma completa, segura e
                    eficiente, desenvolvida para facilitar a gestão de produtos e materiais da sua empresa.
                    Com este sistema, você pode cadastrar, atualizar, excluir e acompanhar em tempo real todas as
                    movimentações do seu estoque, garantindo organização, agilidade e total controle sobre suas
                    operações. Ideal para empresas que buscam precisão e praticidade, nossa ferramenta oferece uma interface
                    simples e fácil de usar, ajudando você a evitar perdas, controlar quantidades e manter seu
                    estoque sempre atualizado com rapidez e segurança.
                    Agora, além de todas essas funcionalidades, o sistema conta também com a opção de exportar os
                    dados do estoque para planilhas Excel, seja de um tópico específico ou de toda a base de dados,
                    facilitando ainda mais a análise, controle e geração de relatórios personalizados.
                </p>
                    <div className="d-flex gap-2">
                        <Link to="/login" className="btn">Login</Link>
                        <Link to="/cadastrar" className="btn">Cadastre-se</Link>
                    </div>
                </div>

                <div className="logo col-md-4 d-flex justify-content-end" id="logo">
                    <img src={logoCaixa} alt="Caixa" className="position-absolute d-none d-md-block" width="250" style={{ marginRight: "-10rem" }} />
                </div>
            </div>
        </div>
        </section>

      {/* SOBRE */}
    <section id="sobre" className="">
        <div className="container2 container">
            <div className="row align-items-center">
                <div className="text-center mt-5">
                    <h3 className="text-center mt-5">SOBRE</h3>
                    <img src={logoEstoque} alt="Logo" width="350" className="img-sobre"/>
                    <p className="mt-3"> <strong>O ESTOQUE AQUI</strong> é um sistema completo de controle de estoque desenvolvido para
                        oferecer praticidade, organização e eficiência na gestão de produtos. A plataforma permite que
                        você adicione novos itens ao seu estoque com facilidade, preenchendo informações essenciais como
                        nome do produto, quantidade disponível, descrição detalhada e o horário exato da última atualização.
                        Além disso, é possível atualizar rapidamente a quantidade de qualquer produto existente, refletindo
                        em tempo real as movimentações do seu estoque. Caso algum item precise ser removido, o sistema também
                        disponibiliza a função de exclusão com segurança, mantendo o histórico organizado e livre de informações
                        desnecessárias. Você pode exportar os dados de um tópico específico ou de todo o estoque, facilitando
                        análises, auditorias e acompanhamento das informações fora do sistema. <strong>O ESTOQUE AQUI</strong> é
                        a ferramenta ideal para empresas que buscam controle preciso, agilidade nas operações e um ambiente
                        profissional para monitoramento contínuo dos seus produtos.
                    </p>
                </div>
            </div>
        </div>
    </section>

      {/* FOOTER simples (você pode trocar por um componente próprio) */}
      <>
        <Footer/>
      </>
    </div>
  );
}