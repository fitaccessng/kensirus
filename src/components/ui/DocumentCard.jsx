export default function DocumentCard({ title, category, description, date }) {
  return (
    <article className="info-card">
      <span className="pill">{category}</span>
      <h3>{title}</h3>
      <p>{description}</p>
      <small>{date}</small>
    </article>
  )
}
