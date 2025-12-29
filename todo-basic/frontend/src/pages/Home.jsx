import { useEffect, useState } from 'react'
import Footer from '../Components/Footer'
import Header from '../Components/Header'
import MainSection from '../Components/MainSection'
import axios from 'axios'
import toast from 'react-hot-toast'
import { useDispatch, useSelector } from 'react-redux'
import { addTodo, fetchTodos } from '../features/todoSlice'

export default function Home() {
    const [text, setText] = useState("");
    const { todos, loading } = useSelector((state) => state.todo)
    const dispatch = useDispatch();


    const handleAdd = () => {
        if (!text.trim()) return;

        dispatch(addTodo({ title: text }))
        setText("");
    }

    useEffect(() => {
        dispatch(fetchTodos())
    }, [dispatch]);

    return (
        <>
            <Header />
            <div className='flex justify-center m-6 gap-2'>
                <input type="text" placeholder='input title' className=' bg-gray-300 w-[400px] p-3'
                    value={text} onChange={(e) => setText(e.target.value)} />
                <button className='bg-green-600 p-3 text-white' onClick={handleAdd} disabled={loading}>Add</button>
            </div>
            <div className='h-[calc(100vh-200px)] overflow-y-auto '>
                <MainSection todo={todos} />
            </div>
            <Footer />
        </>
    )
}
