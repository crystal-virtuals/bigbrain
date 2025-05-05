import { Text, TextLink } from '@components/text'

export function Breadcrumbs({ crumbs }) {
  return (
    <div className="breadcrumbs text-sm">
      <ul>
        {crumbs.map((crumb, index) => (
          <li key={index} className="text-base/6 text-zinc-500 sm:text-sm/6 dark:text-zinc-400">
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
