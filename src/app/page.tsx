import { FaChartPie } from "react-icons/fa";

export default function Home() {
  return (
    <div className="flex items-center gap-2">
      <FaChartPie className="text-emerald-500 text-3xl" />
      <h1 className="text-2xl font-bold tracking-tight text-emerald-600">
        Valorize
        <span className="text-emerald-500 font-extrabold">App</span>
      </h1>
    </div>
  );
}
