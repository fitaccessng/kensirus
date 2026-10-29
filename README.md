# Ken Sirius Nigeria Limited Website

This workspace contains a two-part implementation for the Ken Sirius corporate website:

- frontend/: React + Vite + Tailwind public website with independent corporate pages, product details, quote requests, and a contact enquiry form.
- backend/: FastAPI API with persisted quote and contact enquiries, health checks, and protected admin enquiry access.

## Quick start

### Frontend

```bash
cd frontend
npm install
npm run dev
```
Local development admin credentials (development only):

- Email: admin@ken-sirius.com
- Password: admin123

For production, set `APP_ENV=production`, `DATABASE_URL` to a managed PostgreSQL URL,
`ADMIN_EMAIL`, `ADMIN_PASSWORD`, and `CORS_ALLOWED_ORIGINS` in the hosting provider's
environment settings. Production startup rejects SQLite and a missing admin password.
Do not commit production credentials.
### Backend

```bash
cd backend
python3 -m venv .venv
. .venv/bin/activate
python -m pip install -r requirements.txt
uvicorn app.main:app --reload
```

The frontend uses `http://localhost:8000` as its default API URL. Set `VITE_API_URL` when the API runs elsewhere. Set `CORS_ALLOWED_ORIGINS` in the backend environment to a comma-separated list of deployed frontend origins; local Vite origins are allowed by default.

## Testing

```bash
cd frontend
npm test -- --run

cd backend
. .venv/bin/activate
pytest -q
```

## Notes

- Quote requests are stored through `POST /api/quotes`; general contact enquiries are stored through `POST /api/contact-enquiries`.
- Successful form confirmation is shown only after the API returns a persisted enquiry reference. The application does not send email notifications.
- Product and document availability must be confirmed for each enquiry; the site does not provide fabricated downloads or status claims.
