# Nirmaan AI Transcript Scorer

A serverless web application for analyzing speech transcripts using AI-powered NLP scoring across multiple criteria including content structure, speech rate, grammar, clarity, and engagement.

## Features

- **Comprehensive Scoring**: Evaluates transcripts across 5 key criteria with detailed breakdowns
- **NLP Analysis**: Uses natural language processing for grammar, sentiment, and vocabulary assessment
- **History Tracking**: Stores and displays past analyses with search and export capabilities
- **Interactive UI**: Modern, responsive interface with real-time scoring and detailed feedback
- **Export Functionality**: Download individual results or complete history as JSON

## Scoring Criteria

The system evaluates transcripts on a 100-point scale across:

1. **Content & Structure** (40 points)
   - Salutation quality
   - Keyword presence (mandatory and optional)
   - Flow and logical progression

2. **Speech Rate** (10 points)
   - Words per minute calculation
   - Optimal pacing detection

3. **Language & Grammar** (20 points)
   - Grammar error detection
   - Vocabulary richness (TTR - Type-Token Ratio)

4. **Clarity** (15 points)
   - Filler word detection and counting
   - Speech fluency assessment

5. **Engagement** (15 points)
   - Sentiment analysis
   - Positive language usage

## Getting Started

### Prerequisites

- Node.js 18+ 
- Next.js 16

### Installation

1. Clone the repository
\`\`\`bash
git clone <your-repo-url>
cd nirmaan-ai-transcript-scorer
\`\`\`

2. Install dependencies (handled automatically by v0/Next.js)

3. Run the development server
\`\`\`bash
npm run dev
\`\`\`

4. Open [http://localhost:3000](http://localhost:3000)

### Usage

1. **Score a Transcript**
   - Paste your transcript text or upload a .txt file
   - Configure scoring options (NLP analysis, duration)
   - Click "Score Transcript" to analyze
   - View detailed results with per-criterion breakdown

2. **View History**
   - Switch to the "History" tab
   - Click on any entry to view full details
   - Export individual results or complete history

3. **Sample Data**
   - Use the "Load Sample" button for demo transcript
   - Run the seed script to generate test data:
     \`\`\`bash
     python scripts/seed-sample-data.py
     \`\`\`

## Architecture

- **Frontend**: Next.js 16 with React Server Components
- **Backend**: Serverless API routes
- **Scoring Engine**: Rule-based NLP with sentiment analysis
- **Storage**: In-memory (can be extended to S3/Database)
- **Styling**: Tailwind CSS v4 with shadcn/ui components

## API Endpoints

### POST `/api/score`
Score a transcript
\`\`\`json
{
  "transcript_text": "string",
  "options": {
    "run_nlp": true,
    "transcript_duration_seconds": 30
  }
}
\`\`\`

### GET `/api/history`
Fetch scoring history
- Query params: `limit` (optional)

### GET `/api/history/download`
Download complete history as JSON

## Project Structure

\`\`\`
├── app/
│   ├── api/
│   │   ├── score/route.ts       # Scoring endpoint
│   │   └── history/
│   │       ├── route.ts          # History listing
│   │       └── download/route.ts # History export
│   ├── page.tsx                  # Main application page
│   ├── layout.tsx                # Root layout
│   └── globals.css               # Global styles
├── components/
│   ├── header.tsx                # Application header
│   ├── footer.tsx                # Application footer
│   ├── transcript-input-panel.tsx
│   ├── scoring-options-panel.tsx
│   ├── results-panel.tsx
│   ├── history-panel.tsx
│   └── ui/                       # shadcn/ui components
├── lib/
│   ├── types.ts                  # TypeScript types
│   ├── scoring-engine.ts         # Core scoring logic
│   └── storage.ts                # History storage
└── scripts/
    └── seed-sample-data.py       # Test data generator
\`\`\`

## Scoring Algorithm

### Content & Structure
- **Salutation**: Detects greeting quality (0-5 points)
- **Keywords**: Checks for mandatory (name, age, class, school) and optional (hobbies, family) elements
- **Flow**: Validates logical progression of information

### Speech Rate
- Calculates WPM from word count and duration
- Optimal range: 111-140 WPM
- Penalizes too fast (>160) or too slow (<80)

### Language & Grammar
- Estimates grammar errors per 100 words
- Calculates Type-Token Ratio for vocabulary richness
- Bands scoring based on quality thresholds

### Clarity
- Counts filler words (um, uh, like, you know, etc.)
- Calculates filler rate percentage
- Lower filler rate = higher score

### Engagement
- Simplified sentiment analysis
- Counts positive vs negative words
- Higher positivity = better engagement score

## Future Enhancements

- Integration with advanced NLP models (BERT, GPT)
- Real-time speech-to-text transcription
- Multi-language support
- User authentication and personalized history
- Database integration (PostgreSQL/MongoDB)
- Cloud storage (S3) for scalability
- Advanced analytics and insights dashboard
- Export to PDF reports

## Production Deployment

For production use, consider:

1. **Database Integration**: Replace in-memory storage with PostgreSQL, MongoDB, or Supabase
2. **Authentication**: Add user auth with NextAuth.js or Supabase Auth
3. **Rate Limiting**: Implement API rate limits to prevent abuse
4. **Caching**: Add Redis for performance optimization
5. **Monitoring**: Set up error tracking (Sentry) and analytics
6. **Advanced NLP**: Integrate sentence-transformers, language-tool-python, vaderSentiment

## License

MIT License - See LICENSE file for details

## Contact

For questions or support, please open an issue on GitHub.
# nirmaan
