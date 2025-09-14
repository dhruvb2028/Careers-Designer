# Careers-Designer

A web application for career exploration and job search with AI-powered chatbot support.

## Setup

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd Careers-Designer
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Configure environment variables**
   ```bash
   cp .env.example .env
   ```
   Edit the `.env` file and add your Google Gemini API key:
   ```
   GEMINI_API_KEY=your_actual_api_key_here
   ```

4. **Build the configuration**
   ```bash
   npm run build
   ```
   This generates the `config.js` file from your environment variables.

5. **Start the application**
   ```bash
   npm start
   ```
   Or open `index.htm` in your browser.

## Environment Variables

- `GEMINI_API_KEY`: Your Google Gemini API key for the AI chatbot functionality
  - Get your API key from: https://makersuite.google.com/app/apikey

## Important Notes

- Never commit the `.env` file to version control
- Always run `npm run build` after updating environment variables
- The `config.js` file is auto-generated and should not be edited manually