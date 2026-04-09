const items: { plan: string; tradeoff: string }[] = [
  {
    plan: "Move from one-off custom forms to a shared, structured system",
    tradeoff:
      "Some organizations could no longer design forms exactly how they were used to, requiring change management and alignment.",
  },
  {
    plan: "Prioritize structured inputs over free-form responses",
    tradeoff:
      "Reduced nuance in some submissions, especially for open-ended observations and coaching notes.",
  },
  {
    plan: "Design forms to support reporting across the organization",
    tradeoff:
      "Required standard definitions, which limited how differently teams could interpret or use certain fields.",
  },
  {
    plan: "Auto-save form progress instead of relying on manual save",
    tradeoff:
      "Removed a sense of control for users, requiring clear feedback like “last saved” to build trust.",
  },
  {
    plan: "Build for both admins and coaches within the same system",
    tradeoff:
      "Increased complexity in the experience, requiring careful separation of workflows and permissions.",
  },
  {
    plan: "Add an event driven notification and escalation system that routes alerts based on form data, severity, and user roles",
    tradeoff:
      "Increases system complexity and requires clear configuration and governance to prevent over notification, misrouting, and alert fatigue.",
  },
];

export function PlanTradeoffsSection() {
  return (
    <div className="plan-tradeoffs">
      <div className="plan-tradeoffs-stack">
        {items.map((item) => (
          <article key={item.plan} className="plan-tradeoff-card">
            <div className="plan-tradeoff-card__grid">
              <div className="plan-tradeoff-col">
                <p className="plan-tradeoff-label">Plan</p>
                <h3 className="plan-tradeoff-plan">{item.plan}</h3>
              </div>
              <div className="plan-tradeoff-col">
                <p className="plan-tradeoff-label">Tradeoff</p>
                <p className="plan-tradeoff-text">{item.tradeoff}</p>
              </div>
            </div>
          </article>
        ))}
      </div>
    </div>
  );
}
