import SectionTitle from '../../components/SectionTitle';
import SkillBar from '../../components/SkillBar';
import { fetchPortfolio } from '../../lib/api';

export default async function AboutPage() {
  const { about, skills } = await fetchPortfolio();

  return (
    <div className="space-y-8">
      <section>
        <SectionTitle eyebrow="About" title="Wang Lin" subtitle={about?.title} />
        <div className="panel">
          <p className="leading-relaxed opacity-90">{about?.full_bio}</p>
        </div>
      </section>

      <section>
        <SectionTitle eyebrow="Power Scale" title="Skills" />
        <div className="panel space-y-4">
          {(skills || []).map((skill) => (
            <SkillBar key={skill.id} name={skill.name} level={skill.level} />
          ))}
        </div>
      </section>
    </div>
  );
}
