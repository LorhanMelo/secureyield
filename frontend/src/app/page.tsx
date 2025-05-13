  import { Button } from '@/components/ui/button';
  import Link from 'next/link';
  import './globals.css';
  import Logo from './media/sec_yield_logo.png'
  import {TypingEffect} from "./components/TypingEffect";


  export default function HomePage() {
    return (
        <>
          <section className="bg-[#CE53E0] w-full pb-6">
            <div className="justify-center flex flex-col items-center w-full">
              <div className="flex flex-col justify-between bg-white rounded-b-[80px] w-[95%] overflow-hidden h-[600px]">
                <div className="flex flex-col gap-8 items-left mt-14 px-8 xl:px-60">
                  <div className="flex justify-between w-full items-center border border-black rounded-full px-8">
                    <a href={"/"}>
                      <img src={Logo.src} width={100} height={65} alt="logo" />
                    </a>
                    <nav className="h-16 flex rounded-[16px] gap-8 justify-center items-center text-black">
                      <a href={"/login"}>
                        <p className="font-inter font-regular">Já tenho acesso</p>
                      </a>
                      <p className="italic hidden md:flex">ou</p>
                      <a href={"/register"}>
                        <button className="gap-2 items-center rounded-lg justify-center transition-all duration-300 disabled:opacity-70 disabled:pointer-events-none [&_svg]:flex-shrink-0 [&_svg]:size-5 bg-[#ff99ff] border-[1px] shadow-[0_2px_0_0_#2B505B] border-solid border-[#2B505B] text-black hover:shadow-[0_1px_0_0_#2B505B] px-4 hidden md:flex">
                          <span className="font-inter font-regular">Criar conta agora!</span>
                        </button>
                      </a>
                    </nav>
                  </div>
                  <h1 className="xl:text-5xl sm:text-6xl text-3xl md:text-left font-inter text-black z-10">A forma mais
                  <em className="font-light"> fácil</em>
                    <br></br>
                    de comprar renda fixa.
                  </h1>
                  <div>
                    <p className="font-inter text-black text-left">No mercado secundário, você encontra as melhores taxas, com retornos maiores que a renda variável!</p>
                    <p className="font-inter text-black text-left mt-4 h-20">
                      <span>
                        <TypingEffect></TypingEffect>
                      </span>
                    </p>
                  </div>

                  <div className="flex flex-wrap gap-2">
                    <a href={"/vasco"}>
                      <button
                          className="whitespace-nowrap h-[36px] bg-[#ffffff] tab border-[1px] border-b-[3px] border-solid border-[#000000] text-black rounded-lg px-4 hover:border-b-[1px] transition-all duration-75">
                        <span className="font-inter font-light">Como usar</span>
                      </button>
                    </a>
                    <a href={"/vasco2"}>
                      <button
                          className="whitespace-nowrap h-[36px] bg-[#ffffff] tab border-[1px] border-b-[3px] border-solid border-[#000000] text-black rounded-lg px-4 hover:border-b-[1px] transition-all duration-75">
                        <span className="font-inter font-light">Conhecer Taxas</span>
                      </button>
                    </a>
                  </div>


                </div>
              </div>
            </div>
          </section>


          <div
              className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-b from-slate-900 to-slate-800 text-white">
            <div className="container px-4 py-16 mx-auto text-center">
              <h1 className="mb-6 text-5xl font-extrabold tracking-tight sm:text-6xl">
                SecureYield
              </h1>
                    <p className="max-w-2xl mx-auto mb-8 text-xl">
                        Automatize suas operações financeiras no mercado de renda fixa secundária com segurança e eficiência.
              </p>
              <div className="flex flex-col items-center justify-center gap-4 sm:flex-row">
                <Button asChild size="lg" className="px-8 py-6 text-lg">
                  <Link href="/login">
                    Acessar Plataforma
                  </Link>
                </Button>
                <Button asChild variant="outline" size="lg" className="px-8 py-6 text-lg">
                  <Link href="/register">
                    Criar Conta
                  </Link>
                </Button>
              </div>

              <div className="grid grid-cols-1 gap-8 mt-16 md:grid-cols-3">
                <div className="p-6 bg-slate-800 rounded-lg shadow-md">
                  <h2 className="mb-4 text-xl font-semibold">Automatização Inteligente</h2>
                  <p className="text-slate-300">
                    Nossa plataforma automatiza todo o processo de investimento em renda fixa secundária,
                    eliminando erros humanos e maximizando seus retornos.
                  </p>
                </div>
                <div className="p-6 bg-slate-800 rounded-lg shadow-md">
                  <h2 className="mb-4 text-xl font-semibold">Segurança Garantida</h2>
                  <p className="text-slate-300">
                    Todas as operações são realizadas com os mais altos padrões de segurança,
                    protegendo seus dados e investimentos.
                  </p>
                </div>
                <div className="p-6 bg-slate-800 rounded-lg shadow-md">
                  <h2 className="mb-4 text-xl font-semibold">Facilidade de Uso</h2>
                  <p className="text-slate-300">
                    Interface intuitiva que permite iniciar suas operações com apenas um clique
                    no botão &quot;Invista Já&quot;.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </>
    );
  }
