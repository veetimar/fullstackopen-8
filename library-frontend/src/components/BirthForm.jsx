import { useState } from 'react'
import { useMutation } from '@apollo/client/react'
import { UPDATE_YEAR } from '../queries'

const BirthForm = () => {
  const [name, setName] = useState('')
  const [born, setBorn] = useState('')
  const [updateBirthYear] = useMutation(UPDATE_YEAR)

  const submit = (e) => {
    e.preventDefault()

    updateBirthYear({ variables: { name, born: +born } })

    setName('')
    setBorn('')
  }

  return (
    <div>
      <h3>Set birthyear</h3>
      <form onSubmit={submit}>
        <div>
          name
          <input value={name} onChange={(e) => setName(e.target.value)} />
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
