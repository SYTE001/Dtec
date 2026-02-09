export default function SkillBar({ name, level }) {
  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between text-sm">
        <span>{name}</span>
        <span className="font-semibold">{level}%</span>
      </div>
      <div className="h-2 w-full rounded-full bg-secondary/15 dark:bg-primary/20">
        <div className="h-2 rounded-full bg-secondary dark:bg-primary transition-all" style={{ width: `${level}%` }} />
      </div>
    </div>
  );
}
