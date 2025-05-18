# Reversi/Othello with Obstacles

## Pursuit Holiday Hackathon

We created a web app game that functions the same as Reversi but with our own creative take on the original game. You are allowed to play the original game as well if you desire.

## Developer Setup

This project is built with Next.js, TypeScript, and Tailwind CSS.

### Prerequisites

- Node.js (Latest LTS version recommended)
- npm (comes with Node.js)
- Anthropic API key (for AI player functionality)

### Installation

1. Clone the repository:

```bash
git clone <repository-url>
cd othello
```

2. Install dependencies:

```bash
npm install
```

3. Set up environment variables:
   - Create a new file called `.env.local` in the root directory
   - Add your Anthropic API key:
   ```
   NEXT_PUBLIC_ANTHROPIC_API_KEY=your_api_key_here
   ```
   - You can get an API key by signing up at [Anthropic's website](https://www.anthropic.com/)
   - Never commit the `.env.local` file to version control

### Running the Development Server

To start the development server:

```bash
npm run dev
```

This will start the application on [http://localhost:3000](http://localhost:3000)

### Other Available Scripts

- `npm run build` - Build the application for production
- `npm run start` - Start the production server
- `npm run lint` - Run ESLint to check code quality

### Project Structure

The main application code is located in the `othello/othello` directory. The project uses:

- Next.js for the framework
- TypeScript for type safety
- Tailwind CSS for styling
- ESLint for code linting
- Anthropic Claude API for AI player moves

### AI Player Setup

The game includes an AI player powered by Anthropic's Claude API. To enable this feature:

1. Make sure you have set up your `.env.local` file with the API key as described above
2. The AI player will automatically be available in the game once the API key is properly configured
3. If you don't set up the API key, the AI player functionality will not work
