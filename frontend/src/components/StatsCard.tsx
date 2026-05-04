interface Props {
  title: string;
  value: number;
  icon: React.ReactNode;
  color: string;
  bgColor: string;
  subtitle?: string;
}

export default function StatsCard({ title, value, icon, color, bgColor, subtitle }: Props) {
  return (
    <div className="card p-5 hover:shadow-md transition-all duration-200 hover:-translate-y-0.5 animate-slide-up">
      <div className="flex items-center justify-between mb-3">
        <div className={`w-10 h-10 rounded-xl ${bgColor} flex items-center justify-center shadow-sm`}>
          <div className={color}>{icon}</div>
        </div>
        <span className={`text-3xl font-bold ${color}`}>{value}</span>
      </div>
      <p className="text-sm font-semibold text-gray-700 dark:text-gray-300">{title}</p>
      {subtitle && <p className="text-xs text-gray-400 dark:text-gray-500 mt-0.5">{subtitle}</p>}
    </div>
  );
}
