import { useEffect } from 'react'

function ProjectModal({ project, onClose }) {
  useEffect(() => {
    const handleEscape = (event) => {
      if (event.key === 'Escape') {
        onClose()
      }
    }

    window.addEventListener('keydown', handleEscape)

    return () => {
      window.removeEventListener('keydown', handleEscape)
    }
  }, [onClose])

  return (
    <aside
      className="project-modal"
      role="dialog"
      aria-modal="true"
      aria-labelledby="project-modal-title"
      onClick={(event) => {
        if (event.target === event.currentTarget) {
          onClose()
        }
      }}
    >
      <div className="project-modal__backdrop" />

      <div className="project-modal__panel">
        <button className="project-modal__close" type="button" onClick={onClose}>
          Close
        </button>

        <div className="project-modal__top">
          <p className="section-heading__eyebrow">{project.category}</p>
          <div className="project-modal__meta">
            <span>{project.client}</span>
            <span>{project.year}</span>
            <span>{project.status}</span>
          </div>
        </div>

        <h2 id="project-modal-title">{project.title}</h2>
        <p className="project-modal__lede">{project.summary}</p>

        <div className="project-modal__media">
          <img src={project.image} alt={`${project.title} showcase`} />
        </div>

        <div className="project-modal__highlight">
          <span>Signature outcome</span>
          <strong>{project.highlight}</strong>
        </div>

        <div className="project-modal__columns">
          <article className="project-modal__card">
            <span>Challenge</span>
            <p>{project.challenge}</p>
          </article>

          <article className="project-modal__card">
            <span>Solution</span>
            <p>{project.solution}</p>
          </article>
        </div>

        <div className="project-modal__results">
          <span>Results</span>
          <ul>
            {project.results.map((result) => (
              <li key={result}>{result}</li>
            ))}
          </ul>
        </div>

        <div className="project-modal__stack">
          {project.stack.map((item) => (
            <span key={item}>{item}</span>
          ))}
        </div>
      </div>
    </aside>
  )
}

export default ProjectModal
