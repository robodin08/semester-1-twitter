# TwitterMini

Twitter-achtige applicatie met Node.js/Express backend en React Native/Expo frontend.

## Vereisten

- Node.js (versie 18+)
- Docker
- Git

## Installatie

### 1. Project clonen

```bash
git clone https://github.com/robodin08/semester-1-twitter.git
cd semester-1-twitter
```

### 2. Database starten

```bash
docker run --name twitter-mini-postgres -e POSTGRES_PASSWORD=mysecretpassword -p 5432:5432 -d postgres
```

### 3. Backend configureren

```bash
cd backend
npm install
```

Maak `.env` bestand:

```env
PORT=3000

DATABASE_HOST=localhost
DATABASE_PORT=5432
DATABASE_USER=postgres
DATABASE_PASSWORD=mysecretpassword
DATABASE_NAME=postgres

JWT_SECRET=super_secret_key
JWT_REFRESH_SECRET=super_long_and_super_secret_key
```

### 4. Frontend configureren

```bash
cd ../frontend
npx expo install
```

## Starten

### Backend

```bash
cd backend
npm run dev
```

### Frontend

```bash
cd frontend
npm start
```

Voor emulator: `npm run android` of `npm run ios`
Voor telefoon: scan QR-code met Expo Go app

## Troubleshooting

- Bij frontend problemen: `npm run update`
- Database herstart: `docker restart twitter-mini-postgres`
- Expo cache wissen: `npx expo start -c`