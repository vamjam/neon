export default function Header() {
  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    console.log(e.target.value)
  }

  return (
    <header>
      <h1>neon</h1>
      <input type="search" onChange={handleSearch} />
    </header>
  )
}
