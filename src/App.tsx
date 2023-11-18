import { useRef, useState } from 'react';
import './App.css';
import { API_URL } from './consts/consts';

const App = () => {
  const [summarize, setSummarize] = useState('');
  const [loadingResponse, setLoadingResponse] = useState(false);
  const [error, setError] = useState(false);

  const form: any = useRef<HTMLFormElement>(null);

  const summarizeArticle = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setLoadingResponse(true);
    setSummarize('');
    setError(false);

    const data = new FormData(form.current);

    const articleUrl = data.get('article_url');

    try {
      const req = await fetch(`${API_URL}/summarize`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ url: articleUrl }),
      });

      if (!req.ok) {
        setError(true);
        throw new Error(`Request Error: ${req.statusText}`);
      }

      const res = await req.json();
      const resUnified = res.join('');
      setLoadingResponse(false);
      setSummarize(resUnified);
    } catch (error: any) {
      setLoadingResponse(false);
      setError(true);
      throw new Error(`Request Error: ${error.message}`);
    }
  };

  return (
    <main>
      <header>
        <h1>Summarize AI</h1>
        <p>Summarize Articles in just one click!</p>
      </header>

      <form ref={form} onSubmit={summarizeArticle}>
        <div id='input__form__container'>
          <p>Enter here your article URL:</p>
          <div id='input__form'>
            <input
              type='text'
              name='article_url'
              placeholder='https://example.com/article'
              autoComplete='off'
              autoFocus
              required
            />

            <input type='submit' value='Summarize' />
          </div>
        </div>
      </form>
      {loadingResponse && (
        <div id='loader__container'>
          <span id='loader'></span>
          <p>Summarizing...</p>
        </div>
      )}

      {error && (
        <div id='error__container'>
          <p>Something went wrong, please try again</p>
        </div>
      )}

      {summarize !== '' && (
        <div id='answer'>
          <h2>Answer</h2>
          <p>{summarize}</p>
        </div>
      )}
    </main>
  );
};

export default App;
