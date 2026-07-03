type Volunteer = {
  id: number;
  name: string;
  whatsapp: string;
  natureza: number;
  animais: number;
  criancas: number;
  idosos: number;
  pcd: number;
  familias: number;
  empresas: number;
  hospitais: number;
  presidios: number;
  created_at: string;
};

type Props = {
  volunteer: Volunteer;
};

const getBadgeColor = (value: number) => {
  if (value >= 8)
    return "bg-green-100 text-green-700 border-green-300";

  if (value >= 5)
    return "bg-yellow-100 text-yellow-700 border-yellow-300";

  return "bg-gray-100 text-gray-600 border-gray-300";
};

const VolunteerCard = ({ volunteer }: Props) => {
  return (
    <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6 hover:shadow-xl transition">

      <div className="flex items-center justify-between">

        <div>
          <h2 className="text-2xl font-bold text-gray-900">
            {volunteer.name}
          </h2>

          <p className="text-gray-500">
            {volunteer.whatsapp}
          </p>
        </div>

        <span className="text-xs text-gray-400">
          {new Date(volunteer.created_at).toLocaleDateString("pt-BR")}
        </span>

      </div>

      <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mt-8">

        <Item nome="🌳 Natureza" valor={volunteer.natureza} />
        <Item nome="🐶 Animais" valor={volunteer.animais} />
        <Item nome="🧒 Crianças" valor={volunteer.criancas} />
        <Item nome="👴 Idosos" valor={volunteer.idosos} />
        <Item nome="♿ PCD" valor={volunteer.pcd} />
        <Item nome="👨‍👩‍👧 Famílias" valor={volunteer.familias} />
        <Item nome="🏢 Empresas" valor={volunteer.empresas} />
        <Item nome="🏥 Hospitais" valor={volunteer.hospitais} />
        <Item nome="🔒 Presídios" valor={volunteer.presidios} />

      </div>

    </div>
  );
};

type ItemProps = {
  nome: string;
  valor: number;
};

const Item = ({ nome, valor }: ItemProps) => (
  <div
    className={`
      rounded-xl
      border
      p-3
      transition
      ${getBadgeColor(valor)}
    `}
  >
    <p className="text-sm">
      {nome}
    </p>

    <p className="text-2xl font-bold">
      {valor}
    </p>
  </div>
);

export default VolunteerCard;