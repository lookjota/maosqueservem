import { ArrowRight } from 'lucide-react';

type MissionCardProps = {
  image: string;
  icon: React.ReactNode;
  title: string;
  description: string;
};

const MissionCard = ({
  image,
  icon,
  title,
  description,
}: MissionCardProps) => {
  return (
    <div className="group bg-white rounded-3xl overflow-hidden shadow-lg border border-gray-100 hover:shadow-2xl transition-all duration-500 hover:-translate-y-2">

      <div className="overflow-hidden">

        <img
          src={image}
          alt={title}
          className="w-full h-64 object-cover group-hover:scale-105 transition duration-700"
        />

      </div>

      <div className="p-8">

        <h3 className="text-2xl font-bold text-gray-900 flex items-center gap-3">

          <span className="text-3xl">
            {icon}
          </span>

          {title}

        </h3>

        <p className="mt-5 text-gray-600 leading-8">
          {description}
        </p>

        <button className="mt-8 flex items-center gap-2 text-blue-600 font-semibold hover:text-yellow-500 transition">

          Saiba mais

          <ArrowRight
            size={18}
          />

        </button>

      </div>

    </div>
  );
};

export default MissionCard;