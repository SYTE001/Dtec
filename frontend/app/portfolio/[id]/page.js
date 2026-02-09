import Link from 'next/link';
import Image from 'next/image';
import { fetchPortfolio } from '../../../lib/api';

export default async function ProjectDetail({ params }) {
  const { projects } = await fetchPortfolio();
  const project = (projects || []).find((p) => String(p.id) === String(params.id));
  const assetBase = process.env.NEXT_PUBLIC_ASSET_URL || 'http://localhost:5000';

  if (!project) return <div className="panel">Project not found.</div>;

  return (
    <article className="space-y-6">
      <div className="panel">
        <h1 className="font-bebas text-5xl leading-none">{project.title}</h1>
        <p className="mt-4 opacity-90">{project.description}</p>
        <p className="mt-4 text-sm"><strong>Tech stack:</strong> {project.tech_stack}</p>
        <div className="mt-5 flex gap-4 text-sm">
          {project.github_link && <Link className="btn-ghost" href={project.github_link}>GitHub</Link>}
          {project.demo_link && <Link className="btn-solid" href={project.demo_link}>Live Demo</Link>}
        </div>
      </div>

      {project.image && (
        <div className="panel p-0 overflow-hidden relative h-[260px] sm:h-[420px]">
          <Image src={`${assetBase}${project.image}`} alt={project.title} fill className="object-cover" />
        </div>
      )}
    </article>
  );
}
