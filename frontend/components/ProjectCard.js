import Image from 'next/image';
import Link from 'next/link';

export default function ProjectCard({ project }) {
  const assetBase = process.env.NEXT_PUBLIC_ASSET_URL || 'http://localhost:5000';

  return (
    <Link href={`/portfolio/${project.id}`} className="panel group block overflow-hidden">
      <div className="relative mb-4 h-44 w-full overflow-hidden rounded-xl bg-black/5 dark:bg-white/5">
        {project.image ? (
          <Image
            src={`${assetBase}${project.image}`}
            alt={project.title}
            fill
            className="object-cover transition duration-500 group-hover:scale-105"
          />
        ) : (
          <div className="grid h-full w-full place-items-center text-sm opacity-70">No image</div>
        )}
      </div>
      <h3 className="text-lg font-semibold">{project.title}</h3>
      <p className="mt-2 text-sm opacity-80">{project.description}</p>
      <p className="mt-3 text-xs uppercase tracking-widest opacity-70">{project.tech_stack}</p>
    </Link>
  );
}
