# College Election System

A secure and efficient web-based election platform designed specifically for college student representative elections.

## Features

### Authentication & Security
- Multi-level authentication system (Faculty Super Admin, Student Admin, Voters)
- Secure passkey-based voting system
- OTP verification for voting access
- Anonymous vote storage
- Encrypted data transmission

### Admin Features
#### Faculty Super Admin
- Manage Student Admin roles
- Override controls for emergency situations
- Access to complete system audit logs

#### Student Admin
- Candidate management
- Voter data administration (CSV upload/manual entry)
- Automated email distribution system
- Real-time election monitoring

### Election Structure Support
- First Year Elections (Stream-based CRs)
- Second Year Elections (Department/Stream CRs)
- Third to Fifth Year Elections (DRs)
- Additional Representative Elections (Mess, Hostel)

## Technical Stack
- Frontend: NextJS 13.4+
- Backend: Express.js
- Database: Firebase
- Authentication: firebase auth
- UI Components: Tailwind CSS
- State Management: React Context API
- Form Handling: react-hook-form
- API Client: Axios

## Installation
1. Clone the repository:
```bash
git clone https://github.com/aryansharma220/iiser_b_hack
```

2. Install dependencies:
```bash
cd arma_code_college_elect
npm install
```

3. Configure environment variables:
```bash
cp .env.example .env
```

4. Run the development server:
```bash
npm run dev
```

5. Build for production:
```bash
npm run build
npm start
```

## Project Structure
```
├── app/           # Next.js 13 app directory with pages and routing
├── components/    # Reusable UI components
├── context/      # React Context providers and state management
├── lib/          # Utility functions and configurations
├── public/       # Static assets like images, fonts, etc.
```

## Development Guidelines
- Use TypeScript for type safety
- Follow ESLint and Prettier configurations
- Implement toast notifications for user feedback
- Write unit tests for critical functions
- Follow Git commit conventions

### Code Style
- Use JavaScript for all new code
- Follow the existing project structure
- Add appropriate comments and documentation
- Include unit tests for new features

## Security Measures
- Unique, non-reusable passkeys
- Data encryption at rest and in transit
- Prevention of duplicate voting
- Comprehensive audit logging
- Role-based access control

## License
This project is licensed under the MIT License.

## Support
For support and queries:
- Create an issue in the repository
- Contact system administrators

## Acknowledgments
- College Administration
- Student Development Team
- Contributing Developers
