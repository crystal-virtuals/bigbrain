import { TextLink } from '@components/text'

export function Breadcrumbs({ crumbs }) {
  return (
    <div className="breadcrumbs text-sm">
      <ul>
        {crumbs.map((crumb, index) => (
          <li key={index}>
            {crumb.link ? (
              <TextLink to={crumb.link}>
                {crumb.label}
              </TextLink>
            ) : (
              <>{crumb.label}</>
            )}
          </li>
        ))}
      </ul>
    </div>
  )
}
