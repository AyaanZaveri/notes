import React, { useState } from 'react'
import { CgMoreAlt } from 'react-icons/cg'
import { doc, deleteDoc, collection, query, where } from 'firebase/firestore'
import { auth, db } from '../../firebase'
import { useRouter } from 'next/router'
import 'emoji-mart/css/emoji-mart.css'
import { Picker } from 'emoji-mart'
import { useAuthState } from 'react-firebase-hooks/auth'
import { useCollection } from 'react-firebase-hooks/firestore'

interface Props {
  id: string
  data: any
  setNotebook: (object: any, id: string) => void
}

const Notebook = ({ id, data, setNotebook }: Props) => {
  const [user] = useAuthState(auth)

  const usersRef = collection(db, 'users')
  const userQuery = query(usersRef, where('uid', '==', user?.uid))
  const [userValue, userLoading, userError] = useCollection(userQuery, {
    snapshotListenOptions: { includeMetadataChanges: true },
  })

  const removeNotebook = () => {
    deleteDoc(doc(collection(db, `notebooks`), id))
  }

  const router = useRouter()

  const { id: queryID } = router.query

  const [showEmojiPicker, setShowEmojiPicker] = useState<boolean>(false)

  return (
    <div
      className={`relative inline-flex w-full bg-gray-50 active:bg-gray-200 items-center justify-between rounded-md p-1 pl-2 transition delay-200 ease-in-out hover:cursor-pointer ${
        id == queryID ? 'bg-gray-200' : 'hover:bg-gray-100'
      }`}
    >
      <div className="relative inline-flex items-center gap-2">
        <button
          onClick={() => setShowEmojiPicker(!showEmojiPicker)}
          className="flex h-5 w-5 items-center justify-center rounded bg-transparent text-gray-600 transition delay-200 ease-in-out hover:bg-gray-200"
        >
          <span>{data.emoji}</span>
        </button>
        <a key={id} href={`/notebook/${id}`}>
          <span className="text-gray-800">{data.title}</span>
        </a>
        <div className={`absolute top-0 z-30 mt-8`}>
          {showEmojiPicker ? (
            <Picker
              set="apple"
              onSelect={(emoji: any) => {
                setNotebook({ ...data, emoji: emoji?.native }, id)
              }}
            />
          ) : null}
        </div>
      </div>
      <div>
        <CgMoreAlt
          onClick={removeNotebook}
          className="mr-1 h-5 w-5 rounded text-gray-600 transition delay-200 ease-in-out hover:bg-gray-200"
        />
      </div>
    </div>
  )
}

export default Notebook
