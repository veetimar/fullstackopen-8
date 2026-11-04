import { useState } from 'react'
import { useMutation } from '@apollo/client/react'
import { UPDATE_YEAR } from '../queries'

const BirthForm = ({ authors }) => {
  const [born, setBorn] = useState('')
  const [updateBirthYear] = useMutation(UPDATE_YEAR)

  const submit = (e) => {
    e.preventDefault()
    const name = e.target.selected.value

    updateBirthYear({ variables: { name: name, born: +born } })

    setBorn('')
  }

  return (
    <div>
      <h3>Set birthyear</h3>
      <form onSubmit={submit}>
        <div>
          name
          <select name="selected">
            {authors.map(a => <option key={a.id} value={a.name}>{a.name}</option>)}
          </select>
        </div>
        <div>
          born
          <input value={born} onChange={(e) => setBorn(e.target.value)}  />
        </div>
        <button>update author</button>
      </form>
    </div>
  )
}

export default BirthForm
