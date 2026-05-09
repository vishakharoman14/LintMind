import React from 'react'
import '../src/App.css'
import Navbar from './components/Navbar'
import Editor from '@monaco-editor/react';
import Select from 'react-select';


const App = () => {
  const options = [
  { value: 'chocolate', label: 'Chocolate' },
  { value: 'strawberry', label: 'Strawberry' },
  { value: 'vanilla', label: 'Vanilla' },
];

const changeHandler = (selectedOption) => {
  console.log('Option selected:', selectedOption);
  
}
const [selectedOption, setSelectedOption] = React.useState(options[0]);
  return (
    <>
    <Navbar></Navbar>
    <div className=' main flex items-center justify-between ' style={{ height: 'calc(100vh - 90px)' }}>
      <div className='left h-[80%] w-[50%] bg-zinc-800'>
        <Select
        value={selectedOption}
        options={options}
        onChange={e=>setSelectedOption(e)}
       className='bg-zing-900'
      /> 
           <Editor height="100%" theme='vs-dark' Language="javascript" Value="// some comment" />
      </div>
    </div>
    </>
  )
}

export default App