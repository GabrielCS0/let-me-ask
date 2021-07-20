import '../styles/auth.scss'
import illustrationImg from '../assets/illustration.svg'
import logoImg from '../assets/logo.svg'
import googleIconImg from '../assets/google-icon.svg'
import { useHistory } from 'react-router-dom'
import { useAuth } from '../hooks/useAuth'
import { FormEvent, useState } from 'react'
import { Button } from '../components/Button'
import { database } from '../services/firebase'

export function Home() {
  const [roomCode, setRoomCode] = useState('')

  const { user, signInWithGoogle } = useAuth()
  const history = useHistory()

  async function handleCreateRoom() {
    if (!user) await signInWithGoogle()
    history.push('/rooms/new')
  }

  async function handleJoinRoom(event: FormEvent) {
    event.preventDefault()

    if (roomCode.trim() === '') return

    const roomRef = await database.ref(`rooms/${roomCode}`).get()

    if (!roomRef.exists()) {
      alert('Room does not exists!')
      return
    }

    if (roomRef.val().closeAt) {
      alert('Room already closed!')
      return
    }

    history.push(`/rooms/${roomCode}`)
  }

  return (
    <div id='page-auth'>
      <aside>
        <img src={illustrationImg} alt="Illustration symbolizing questions and answers" />
        <strong>Create live Q&amp;A rooms</strong>
        <p>Answer your audience's questions in real time</p>
      </aside>
      <main>
        <div className='main-content'>
          <img src={logoImg} alt="Let me ask" />
          <button onClick={handleCreateRoom} className='create-room'>
            <img src={googleIconImg} alt="Google logo" />
            Create your room with google
          </button>
          <div className='separator'>Or enter a room</div>
          <form onSubmit={handleJoinRoom}>
            <input
              type="text"
              placeholder="Enter the room code"
              onChange={event => setRoomCode(event.target.value)}
              value={roomCode}
            />
            <Button type='submit'>
              Enter the room
            </Button>
          </form>
        </div>
      </main>
    </div>
  )
}
