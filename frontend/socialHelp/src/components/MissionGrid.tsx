import MissionCard from './MissionCard';

import Natureza from '../assets/natureza.png';
import Animais from '../assets/animais.png';
import Criancas from '../assets/criancas.png';
import Idosos from '../assets/idosos.png';
import Pcd from '../assets/pcd.png';
import Familias from '../assets/familias.png';
import Empresas from '../assets/empresas.png';
import Hospitais from '../assets/hospitais.png';
import Presidios from '../assets/presidios.png';

const missions = [
  {
    image: Natureza,
    icon: '🌱',
    title: 'Cuidando da Criação',
    description:
      'Preservar a natureza é reconhecer o valor da criação de Deus e cuidar do mundo que Ele confiou às nossas mãos.',
  },
  {
    image: Animais,
    icon: '🐾',
    title: 'Cuidando dos Animais',
    description:
      'Demonstrar compaixão por toda criatura também é uma forma de expressar amor e responsabilidade.',
  },
  {
    image: Criancas,
    icon: '👧',
    title: 'Investindo nas Crianças',
    description:
      'Uma palavra de incentivo, um abraço ou um momento de atenção podem transformar o futuro de uma criança.',
  },
  {
    image: Idosos,
    icon: '👴',
    title: 'Honrando os Idosos',
    description:
      'Valorizar quem veio antes de nós é reconhecer histórias de vida e compartilhar cuidado e companhia.',
  },
  {
    image: Pcd,
    icon: '♿',
    title: 'Promovendo Inclusão',
    description:
      'Servir é construir um ambiente onde cada pessoa seja acolhida, respeitada e valorizada.',
  },
  {
    image: Familias,
    icon: '❤️',
    title: 'Fortalecendo Famílias',
    description:
      'Famílias fortalecidas refletem esperança, união e cuidado para toda a comunidade.',
  },
  {
    image: Empresas,
    icon: '🏢',
    title: 'Servindo Também no Trabalho',
    description:
      'A solidariedade também pode transformar ambientes profissionais e inspirar novas atitudes.',
  },
  {
    image: Hospitais,
    icon: '🏥',
    title: 'Levando Esperança aos Hospitais',
    description:
      'Uma visita, uma oração ou uma palavra de carinho podem levar conforto a quem enfrenta dias difíceis.',
  },
  {
    image: Presidios,
    icon: '🔒',
    title: 'Levando Esperança aos Presídios',
    description:
      'O amor de Deus alcança todos os corações e oferece oportunidades para recomeçar.',
  },
];

const MissionGrid = () => {
  return (
    <section className="py-28 bg-gray-50">

      <div className="max-w-7xl mx-auto px-6">

        <div className="text-center">

          <span className="inline-flex items-center gap-2 bg-blue-100 text-blue-700 px-5 py-2 rounded-full font-semibold">

            ✨ Caminhos para Servir

          </span>

          <h2 className="mt-8 text-4xl md:text-5xl font-bold text-gray-900">

            Existem muitas formas de
            <span className="block text-yellow-500">

              transformar vidas.

            </span>

          </h2>

          <p className="mt-8 max-w-3xl mx-auto text-lg leading-9 text-gray-600">

            Deus concede dons diferentes a cada pessoa.
            Conheça algumas das missões em que você poderá colocar seus talentos
            a serviço do próximo e fazer a diferença na vida de alguém.

          </p>

        </div>

        <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-10 mt-20">

          {missions.map((mission) => (
            <MissionCard
              key={mission.title}
              {...mission}
            />
          ))}

        </div>

      </div>

    </section>
  );
};

export default MissionGrid;