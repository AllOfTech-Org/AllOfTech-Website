import ExpandableProfileCard from "@/components/ui/expandable-profile-card";
import TeamGrid, { IconMap, type TeamMember } from "@/components/ui/team-grid";
import { TEAM_GROUP_SHOTS, TEAM_LEADERSHIP } from "@/lib/team";

function LeadershipProfileContent({ member }: { member: TeamMember }) {
  const linkedin = member.socials?.find((social) => social.icon === "linkedin");
  const LinkedInIcon = IconMap.linkedin;
  const MailIcon = IconMap.email;

  return (
    <div className="aot-epc-profile">
      {member.skill ? <p className="aot-epc-skill">{member.skill}</p> : null}
      {member.vision ? <p className="aot-epc-vision">{member.vision}</p> : null}

      <div className="aot-epc-connect">
        {linkedin ? (
          <a
            href={linkedin.url}
            className="aot-team-grid__social flex h-8 w-8 items-center justify-center rounded-full text-white backdrop-blur-sm transition-all focus:outline-none focus:ring-2 focus:ring-offset-2"
            aria-label={`${member.name} on LinkedIn`}
            target="_blank"
            rel="noopener noreferrer"
          >
            <LinkedInIcon className="h-3.5 w-3.5" />
          </a>
        ) : null}
        {member.email ? (
          <a href={`mailto:${member.email}`} className="aot-epc-email">
            <MailIcon className="h-3.5 w-3.5" aria-hidden="true" />
            {member.email}
          </a>
        ) : null}
      </div>

      <div className="aot-epc-field" aria-hidden="true">
        <div className="aot-epc-field__grid" />
        <div className="aot-epc-field__orb aot-epc-field__orb--cyan" />
        <div className="aot-epc-field__orb aot-epc-field__orb--violet" />
        <div className="aot-epc-orbit">
          <span className="aot-epc-orbit__ring aot-epc-orbit__ring--a" />
          <span className="aot-epc-orbit__ring aot-epc-orbit__ring--b" />
          <span className="aot-epc-orbit__ring aot-epc-orbit__ring--c" />
          <span className="aot-epc-orbit__core" />
        </div>
        {member.signals && member.signals.length > 0 ? (
          <ul className="aot-epc-signals">
            {member.signals.map((signal) => (
              <li key={signal}>{signal}</li>
            ))}
          </ul>
        ) : null}
      </div>
    </div>
  );
}

function LeadershipTile({
  member,
  tileClassName,
}: {
  member: TeamMember;
  tileClassName: string;
}) {
  return (
    <div className={tileClassName}>
      <ExpandableProfileCard
        id={member.id}
        imageSrc={member.image}
        title={member.name}
        subtitle={member.role}
        imageClassName={member.imageClassName}
        imageWidth={member.imageWidth}
        imageHeight={member.imageHeight}
        content={<LeadershipProfileContent member={member} />}
      />
    </div>
  );
}

export default function TeamSection() {
  const ceo = TEAM_LEADERSHIP[0];
  const coo = TEAM_LEADERSHIP[1];

  return (
    <section
      className="aot-team section-major"
      id="team"
      aria-labelledby="team-heading"
    >
      <div className="aot-team__container">
        <TeamGrid
          badge="The studio"
          heading="Our Team"
          headingId="team-heading"
          description="Leadership at the edges, the studio in between — one team, one frame."
        />

        <div className="aot-team__stage" aria-label="AllOfTech team">
          <LeadershipTile
            member={ceo}
            tileClassName="aot-team__tile aot-team__tile--ceo"
          />

          {TEAM_GROUP_SHOTS.map((shot) => (
            <figure
              key={shot.id}
              className={`aot-team__tile aot-team__shot aot-team__tile--${shot.tile}`}
              tabIndex={0}
            >
              <img
                src={shot.src}
                alt={shot.alt}
                width={shot.width}
                height={shot.height}
                loading="lazy"
                decoding="async"
              />
              <figcaption className="aot-team__shot-caption">{shot.caption}</figcaption>
            </figure>
          ))}

          <LeadershipTile
            member={coo}
            tileClassName="aot-team__tile aot-team__tile--coo"
          />
        </div>
      </div>
    </section>
  );
}
