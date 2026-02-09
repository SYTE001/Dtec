import SectionTitle from '../../components/SectionTitle';
import ProjectCard from '../../components/ProjectCard';
import { fetchPortfolio } from '../../lib/api';

export default async function PortfolioPage() {
  const { projects } = await fetchPortfolio();

  return (
    <section>
      <SectionTitle eyebrow="Portfolio" title="All Projects" subtitle="A curated set of creations, experiments, and production builds." />
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {(projects || []).length ? projects.map((project) => <ProjectCard key={project.id} project={project} />) : <p className="opacity-70">No projects available.</p>}
      </div>
    </section>
  );
}
