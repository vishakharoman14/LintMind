# LintMind

LintMind is a dark-themed code review web app built with React, Vite, Tailwind-style styling, Monaco Editor, and Gemini API integration.

## Features

- In-browser code editor powered by Monaco
- JavaScript / TypeScript / React JSX review options
- Review type selection: syntax, best practices, security, or all checks
- Gemini API integration for AI-powered code review results
- Loading state and error handling for API calls

## Setup

1. Clone the repository

```bash
git clone <your-repo-url> LintMind
cd LintMind
```

2. Install dependencies

```bash
npm install
```

3. Create environment variables

Create a `.env` file in the project root (`v:\Code\LintMind\.env`) with:

```env
VITE_GEMINI_API_KEY=your_api_key_here
```

Optionally, set a model name if your key supports a different model:

```env
VITE_GEMINI_MODEL=gemini-flash-latest
```

4. Start the dev server

```bash
npm run dev
```

5. Open the app

Visit `http://localhost:5173` in your browser.

## Gemini API integration

LintMind calls the Google Generative Language API using the browser `fetch` request with the configured key.

- The app expects `VITE_GEMINI_API_KEY` from `.env`
- The request is sent to the `generateContent` endpoint
- If the configured model is unavailable, the app can fall back to a supported model

### Example `.env`

```env
VITE_GEMINI_API_KEY=AIzaSy...your_key_here
VITE_GEMINI_MODEL=gemini-flash-latest
```

### API request format

The app sends the request payload as:

```json
{
  "contents": [
    {
      "parts": [
        {
          "text": "..."
        }
      ]
    }
  ]
}
```

The response is parsed for a JSON-only issues array, so Gemini should return data in the expected format.

## Usage

1. Choose a language from the left dropdown
2. Choose a review type from the right dropdown
3. Paste or type code into the editor
4. Click `Run Review`

If the Gemini API key is configured and valid, the app will produce AI review results in the right panel. If not, it falls back to the built-in review logic.

## Troubleshooting

- If `Run Review` returns `Failed to connect to Gemini API`, verify that your `.env` is in the project root and that the dev server has been restarted.
- If the key is not loaded, restart Vite after changing `.env`.
- Confirm the correct model name is set in `VITE_GEMINI_MODEL` if your API key supports only specific Gemini models.
- Check browser console for request errors and response details.

## Scripts

- `npm run dev` — start development server
- `npm run build` — build production files
- `npm run preview` — preview production build locally

## Notes

- Do not commit `.env` to version control.
- Keep the API key secret and use a restricted key if possible.
