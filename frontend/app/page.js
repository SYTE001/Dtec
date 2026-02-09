import Hero from '../components/Hero';
import SectionTitle from '../components/SectionTitle';
import ProjectCard from '../components/ProjectCard';
import SkillBar from '../components/SkillBar';
import { fetchPortfolio } from '../lib/api';

export default async function HomePage() {
  const data = await fetchPortfolio();
  const featuredProjects = (data?.projects || []).slice(0, 3);
  const topSkills = (data?.skills || []).slice(0, 4);

  return (
    <div className="space-y-16">
      <Hero about={data?.about} />

      <section>
        <SectionTitle eyebrow="Capabilities" title="Core Skills" subtitle="Battle-tested mastery forged through hardship and discipline." />
        <div className="panel space-y-4">
          {topSkills.length ? topSkills.map((s) => <SkillBar key={s.id} name={s.name} level={s.level} />) : <p className="opacity-70">No skills added yet.</p>}
        </div>
      </section>

      <section>
        <SectionTitle eyebrow="Selected Work" title="Featured Projects" />
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {featuredProjects.length ? featuredProjects.map((project) => <ProjectCard key={project.id} project={project} />) : <p className="opacity-70">No projects added yet.</p>}
        </div>
      </section>
    </div>
  );
}
