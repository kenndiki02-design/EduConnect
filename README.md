# EduConnect Kenya

An AI-powered learning ecosystem connecting students, teachers, parents, schools, and communities across Kenya.

## Features

- 🤖 **AI Tutoring System** — Personalized academic support
- 📝 **Lesson Plan Generator** — Curriculum-aligned lesson planning
- 💚 **Wellness & Mental Health** — Crisis support and self-care tools
- 🚀 **Career Guidance** — Career paths and mentorship
- 💻 **Digital Literacy Training** — Essential tech skills
- 🤝 **Community Hub** — Forums, events, and resource sharing

## Tech Stack

- **Frontend**: HTML, CSS, JavaScript
- **Backend**: Node.js, Express
- **Database**: SQLite (with JSON fallback)
- **Authentication**: bcryptjs, express-session
- **Email**: Resend
- **Hosting**: Vercel (recommended)

## Setup & Installation

### Prerequisites

- Node.js 16+
- npm or yarn
- Resend API Key (optional, for email functionality)

### Local Development

1. **Clone the repository**
   ```bash
   git clone https://github.com/kenndiki02-design/EduConnect.git
   cd EduConnect
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Create `.env` file** (copy from `.env.example`)
   ```bash
   cp .env.example .env
   ```

4. **Get a Resend API Key** (for email verification)
   - Go to [resend.com](https://resend.com)
   - Sign up for free
   - Create an API Key
   - Add it to your `.env` file:
     ```
     RESEND_API_KEY=re_your_api_key_here
     ```

5. **Add a verified email sender** in Resend
   - Use `noreply@yourdomain.com` or Resend's test email
   - Update `SENDER_EMAIL` in `.env`

6. **Start the server**
   ```bash
   npm start
   ```

7. **Open in browser**
   ```
   http://localhost:3000
   ```

## Email Configuration

### Using Resend (Recommended)

1. **Get API Key**: [resend.com/api-keys](https://resend.com/api-keys)
2. **Configure `.env`**:
   ```
   RESEND_API_KEY=re_xxxxxxxxxxxxx
   SENDER_EMAIL=noreply@yourdomain.com
   APP_URL=http://localhost:3000
   ```

### Email Features

- ✉️ **Account Verification** — Sent on registration
- 🔑 **Password Reset** — Requested via forgot password
- 🔄 **Resend Verification** — Manual resend if needed

### Development Mode (No Resend)

If `RESEND_API_KEY` is not set, verification links are logged to console:
```
✉️ Email verification link for user@example.com: http://localhost:3000/verify-email.html?token=...
```

## User Roles

- **Student** — Learn with AI tutoring and resources
- **Teacher** — Create lesson plans and manage classes
- **Parent** — Monitor children and access family resources
- **School** — Manage institution and share resources
- **Community** — Organize events and share knowledge
- **Admin** — Manage users and platform content

## Authentication

### Default Admin Account
```
Email: admin@educonnect.or.ke
Password: Admin@123
```

### Password Reset Flow
1. Click "Forgot password?" on login
2. Enter email → Reset link sent
3. Click link → Set new password
4. Log in with new password

### Email Verification
1. Register new account
2. Verification email sent
3. Click link to verify
4. Account activated

## API Endpoints

### Authentication
- `POST /api/auth/register` — Create new account
- `POST /api/auth/login` — Log in
- `POST /api/auth/logout` — Log out
- `GET /api/auth/status` — Check session
- `POST /api/auth/forgot-password` — Request password reset
- `POST /api/auth/reset-password` — Reset password with token
- `POST /api/auth/verify-email` — Verify email with token
- `POST /api/auth/resend-verification` — Resend verification email

## Deployment

### Vercel

1. **Connect GitHub repository**
2. **Set environment variables** in Vercel dashboard:
   ```
   RESEND_API_KEY=re_xxxxxxxxxxxxx
   SENDER_EMAIL=noreply@yourdomain.com
   APP_URL=https://your-app.vercel.app
   NODE_ENV=production
   ```
3. **Deploy** — Vercel auto-deploys on push

### GitHub Pages (Frontend Only)

GitHub Pages only serves static files. For full functionality:
- Use Vercel for backend
- Configure frontend to call external API

## Database

### SQLite (Default)
- File: `educonnect.db`
- Automatic fallback if better-sqlite3 fails
- Perfect for local development and small deployments

### JSON Fallback
- File: `educonnect-store.json`
- Used if SQLite is unavailable
- Suitable for testing

## Project Structure

```
├── index.html                  # Landing page
├── login.html                  # Auth page
├── forgot-password.html        # Password recovery
├── reset-password.html         # Password reset form
├── verify-email.html           # Email verification
├── dashboard.html              # User dashboard
├── admin.html                  # Admin console
├── server.js                   # Express backend
├── package.json                # Dependencies
├── .env.example                # Environment template
├── .gitignore                  # Git ignore rules
├── styles/                     # CSS files
│   ├── main.css
│   ├── nav.css
│   ├── auth.css
│   └── *.css
├── js/                         # JavaScript modules
│   ├── utils.js
│   ├── auth.js
│   └── *.js
└── README.md                   # This file
```

## Development Notes

### Adding Email Templates
Update `server.js` email HTML to customize:
```javascript
await resend.emails.send({
  from: SENDER_EMAIL,
  to: email,
  subject: 'Your Subject',
  html: `<h1>Your HTML Email</h1>`
});
```

### Debugging
- Check console logs for email send status
- Verify `.env` has valid `RESEND_API_KEY`
- Test with Resend's test email first

### Security
- Passwords hashed with bcryptjs (10 rounds)
- Tokens expire after 1 hour (password) / 24 hours (email)
- Session-based authentication
- CORS enabled for local development

## Troubleshooting

### Emails not sending?
1. Check `.env` has `RESEND_API_KEY`
2. Verify `SENDER_EMAIL` is registered in Resend
3. Check server logs for Resend errors
4. Verify email recipient address is valid

### Port already in use?
```bash
# Windows
netstat -ano | findstr :3000
taskkill /PID <PID> /F

# macOS/Linux
lsof -i :3000
kill -9 <PID>
```

### Database locked?
Delete `educonnect.db` and restart — data will be recreated

## Contributing

Pull requests welcome! Please follow existing code style and test locally before pushing.

## License

ISC

## Support

For issues or questions, open a GitHub issue or contact the team.

---

**Made for Kenya 🇰🇪 · Powered by AI**

*Empowering Learners · Strengthening Communities · Building Kenya's Future*
