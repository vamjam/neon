const test = ''

export default function externalize(deps: Record<string, string>) {
  const ext = Object.keys(deps)

  return [/^node:.*/, ...ext.map((dep) => new RegExp(`^${dep}.*`))]
}
