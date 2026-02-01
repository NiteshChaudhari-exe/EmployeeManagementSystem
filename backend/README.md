# Employee Management System - Backend

Express.js REST API for the Employee Management System.

## Getting Started

### Prerequisites
- Node.js 18+
- MongoDB or PostgreSQL
- npm

### Installation

```bash
cd backend
npm install
```

### Configuration

Copy `.env.example` to `.env` and update values:

```bash
cp .env.example .env
```

### Running

Development:
```bash
npm run dev
```

Production:
```bash
npm start
```

Server runs on `http://localhost:5000`

## API Endpoints

See [../API_DOCUMENTATION.md](../API_DOCUMENTATION.md) for full API specification.

## Project Structure

```
src/
├── config/       # Configuration files
├── controllers/  # Route handlers
├── middleware/   # Express middleware
├── models/       # Database schemas
├── routes/       # API routes
├── services/     # Business logic
└── utils/        # Utility functions
```

## Next Steps

1. Setup MongoDB/PostgreSQL connection
2. Implement database models
3. Implement controllers
4. Implement routes
5. Add validation middleware
6. Add authentication

See [../SENIOR_DEVELOPER_COMPREHENSIVE_AUDIT.md](../SENIOR_DEVELOPER_COMPREHENSIVE_AUDIT.md) for detailed roadmap.
