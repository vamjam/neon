import getPort from 'get-port'
import fs from 'node:fs/promises'

export default async function writeConfig(configPath: string) {
  const sp = await getPort()
  const ap = await getPort()

  const config = {
    'service.port': sp.toString(),
    'admin.port': ap.toString(),
    'tmdb.api_key': '1fdca2858814eddba1e93c0d809522b9',
    'tmdb.access_token':
      'eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiIxZmRjYTI4NTg4MTRlZGRiYTFlOTNjMGQ4MDk1MjJiOSIsInN1YiI6IjYxZjc3MWY0ZTlkYTY5MDBmNDM5ZDk1MSIsInNjb3BlcyI6WyJhcGlfcmVhZCJdLCJ2ZXJzaW9uIjoxfQ.YLupR1CG45cOj8kbm4QuF8FVtJst0NR6F_2GERd0h8g',
  }

  await fs.writeFile(configPath, JSON.stringify(config, null, 2))
}
