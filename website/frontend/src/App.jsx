// import { useState } from 'react'
import './App.css'
import '@mantine/core/styles.css';
import { UserAuth } from './pages/Login.jsx'
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import DisabilityForm from './pages/DisabilityForm.jsx';
import ChapterGallery from './pages/ChapterGallery.jsx';
import MicInput from './pages/MicInput.jsx';
import Dashboard from './pages/Dashboard.jsx';
import SubmitArticle from './pages/SubmitArticle.jsx';

function App() {
  // const [count, setCount] = useState(0)

  return (
    <BrowserRouter>
      <Routes>
        <Route element={<UserAuth type="signin"/>} path='/auth/signin' />
        <Route element={<UserAuth type="signup"/>} path='/auth/signup' />
        <Route element={<DisabilityForm/>} path='/onboard' />
        <Route element={<ChapterGallery data={data} />} path='/chapter'/>
        <Route element={<MicInput />} path='/mic'/>
        <Route element={<Dashboard />} path='/dash'/>
        <Route element={<SubmitArticle />} path='/submitArticle'/>
      </Routes>
    </BrowserRouter>
  )
}

const data = {
  "title": "Understanding Artificial Intelligence",
  "hook": "Ever wished your computer could think like you?  Artificial Intelligence is making that a reality! \n",
  "content": "## What is **Artificial Intelligence** (AI)? \ud83e\udde0\n\n**Artificial Intelligence** (AI) is all about making computers **smarter**.  AI helps computers do things that usually require a human brain, like **learning**, **problem-solving**, and understanding our language.\n\n**Fun Fact:** \ud83e\udd2f  The term \"Artificial Intelligence\" was first coined in 1956 at a conference at Dartmouth College!\n\n## Types of AI \ud83e\udd16\n\nThere are two main types of AI:\n\n* **Narrow AI:** This AI is really good at one specific task. Think of it like a computer program designed to suggest movies you might enjoy or recognize your face in a photo.\n\n* **General AI:** This type of AI is more like a human brain. It can **learn** and do many different things.  We haven't quite reached this level of AI yet!\n\n**Quick Quiz:** \ud83e\udd14  What type of AI is used in a spam filter?\n   a) Narrow AI \n   b) General AI\n\n**Answer:** a) Narrow AI\n\n## How Do We Teach AI? \ud83d\udcda\n\nWe teach AI using a method called **machine learning**.  Here are three ways to do this:\n\n* **Supervised Learning:** Imagine showing a computer lots of pictures of cats and dogs and telling it which is which. That's **supervised learning**! The computer learns from **labeled examples**.\n\n* **Unsupervised Learning:**  Think of giving a computer a big box of toys and letting it figure out how they're grouped.  The computer finds **patterns** and **relationships** on its own.\n\n* **Reinforcement Learning:**  Picture a dog learning tricks. It gets a treat when it does something right. That's **reinforcement learning**! The computer learns by getting **rewards** for good actions.\n\n**Section Summary:**  Machine learning involves training AI algorithms using different techniques like supervised, unsupervised, and reinforcement learning.  \n\n## AI in Everyday Life \ud83d\udcbb\ud83d\udcf1\n\nYou probably encounter AI more often than you realize! Here are some examples:\n\n* **Virtual Assistants:** **Siri** and **Alexa** are examples of AI that can understand your voice and respond to your requests.\n\n* **Recommendations:** **Netflix** and **YouTube** use AI to suggest shows and videos you might like based on your viewing history.\n\n* **Self-Driving Cars:** These cars use AI to navigate roads and make driving **decisions**.\n\n* **Translation Services:** AI can help translate **languages** quickly and accurately.\n\n* **Fraud Detection:** AI can help banks and other organizations identify **suspicious activity** and prevent **fraud**.\n\n\n\n\n",
  "outro": "So, you've dipped your toes into the fascinating world of Artificial Intelligence! \n\nBut the journey has just begun.  What other incredible things can AI do? How will it shape our future?  \n\nDive deeper into the world of machine learning algorithms, explore the ethical considerations surrounding AI, or even imagine the possibilities of artificial general intelligence. The future of AI is being written right now, and you can be a part of it! \n\n\n\n"
}

export default App
