import { RiDonutChartFill } from "react-icons/ri";

const Loading = () => {
  return (
    <div className="h-screen flex flex-col items-center justify-center">
      <RiDonutChartFill className="w-12 h-12 animate-spin text-emerald-500" />
      <p className="text-emerald-500">
        Carregando<span className="animate-spin">...</span>
      </p>
    </div>
  );
};

export default Loading;
