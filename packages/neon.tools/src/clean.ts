import del from 'del'
import glob from 'glob'

const patterns = process.argv.slice(2)

for (const pattern of patterns) {
  glob(pattern, {}, async (err, files) => {
    if (err) {
      console.error(err)
    }

    await del(files)
  })
}
