import logo from './logo.svg';
import './App.css';
import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'
import { useEffect, useState } from 'react';

function App() {
  const [content, setContent] = useState('')

  const handleKeyUp = (event) => {
    console.log('handleKeyDown',  event.key);
    let charCode = event.keyCode;
    let keycode = event.key.charCodeAt(0)
    let newPosition = event.target.selectionStart;
    // If Backspace/Delete
    if (event.keyCode === 8) {
      // Prevent the default behavior of the backspace key
      event.preventDefault();

      console.log(`Deleted: Position ${newPosition}`);

      // Update the state with the new cursor position
      // setCursorPosition(newPosition);

      // Make your AJAX request here
      const body = {
        position: newPosition+1,
      };

      fetch('http://localhost:8080/woot/delete', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(body),
      }).then((data) => {
          // Handle the response if needed
          console.log('Success:', data.status);
        })
        .catch((error) => {
          console.error('Error:', error);
        });
    }else if ((charCode >= 65 && charCode <= 90) || (charCode >= 97 && charCode <= 122) || charCode === 32 || (charCode>=48 && charCode<=57)) {
      event.preventDefault();

      console.log(`Added: Position ${newPosition}`);

      // Update the state with the new cursor position
      // setCursorPosition(newPosition);

      // Make your AJAX request here
      const body = {
        position: newPosition,
        // value: String.fromCharCode(keycode),
        value: event.key,
      };

      fetch('http://localhost:8080/woot/add', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(body),
      }).then((data) => {
          // Handle the response if needed
          console.log('Success:', data.status);
          // setContent(data.body)
        })
        .catch((error) => {
          console.error('Error:', error);
        });
    }
  }

  useEffect(() => {
    fetch('http://localhost:8080/woot/list').then((response) => response.json()).then((data) => {
      setContent(data)
    })

    let interval = setInterval(async () => {
      const response = await fetch('http://localhost:8080/woot/list');
      const data = await response.json();
      console.log(data);
      setContent(data)
    }, 1000);

    return () => clearInterval(interval);
  },[])

  return (
    <div className="App">
      <textarea onChange={(e) => setContent(e.target.value)} onKeyUp={handleKeyUp} value={content}></textarea>
      <ReactMarkdown>{content}</ReactMarkdown>
    </div>
  );
}

export default App;
