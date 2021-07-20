import '../styles/room.scss'
import logoImg from '../assets/logo.svg'
import deleteImg from '../assets/delete.svg'
import checkImg from '../assets/check.svg'
import answerImg from '../assets/answer.svg'
import { useParams, useHistory } from 'react-router-dom'
import { useRoom } from '../hooks/useRoom'
import { database } from '../services/firebase'
import { Button } from '../components/Button'
import { RoomCode } from '../components/RoomCode'
import { Question } from '../components/Question'

type RoomParams = {
  id: string
}

export function AdminRoom() {
  const params = useParams<RoomParams>()
  const roomId = params.id

  const { title, questions } = useRoom(roomId)

  const history = useHistory()

  async function handleCloseRoom() {
    await database.ref(`rooms/${roomId}`).update({
      closeAt: new Date()
    })

    history.push('/')
  }

  async function handleCheckQuestionAsAnswered(questionId: string) {
    await database.ref(`rooms/${roomId}/questions/${questionId}`).update({
      isAnswered: true
    })
  }

  async function handleHighlightQuestion(questionId: string) {
    await database.ref(`rooms/${roomId}/questions/${questionId}`).update({
      isHighlighted: true
    })
  }

  async function handleDeleteQuestion(questionId: string) {
    if (window.confirm('Are you sure you want to delete this question?')) {
      await database.ref(`rooms/${roomId}/questions/${questionId}`).remove()
    }
  }

  return (
    <div id='page-room'>
      <header>
        <div className="content">
          <img src={logoImg} alt="Let me ask" />
          <div>
            <RoomCode code={roomId} />
            <Button isOutlined onClick={handleCloseRoom}>Close Room</Button>
          </div>
        </div>
      </header>

      <main>
        <div className='room-title'>
          <h1>Room {title}</h1>
          { questions.length > 0 && 
            <span>{questions.length} Question{ questions.length > 1 ? 's' : ''}</span>
          }
        </div>
        
        <div className="question-list">
          { questions.map(question => {
            return (
              <Question
                key={question.id}
                content={question.content}
                author={question.author}
                isAnswered={question.isAnswered}
                isHighlighted={question.isHighlighted}
              >
                
                { !question.isAnswered && (

                  <>
                    <button
                      type='button'
                      onClick={() => handleCheckQuestionAsAnswered(question.id)}
                    >
                      <img src={checkImg} alt="Mark question as answered" />
                    </button>

                    <button
                      type='button'
                      onClick={() => handleHighlightQuestion(question.id)}
                    >
                      <img src={answerImg} alt="Highlight question" />
                    </button>
                  </>

                ) }

                <button
                  type='button'
                  onClick={() => handleDeleteQuestion(question.id)}
                >
                  <img src={deleteImg} alt="Remove question" />
                </button>
              </Question>
            )
          }) }
        </div>

      </main>
    </div>
  )
}
