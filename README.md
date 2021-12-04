
# Online Node API

พัฒนา API ด้วย NodeJS Express MongoDB jsonwebtoken


## Quick Start

```bash
  npm install
```
Development:
```dev
  npm run dev
```

    
## Environment Variables

To run this project, you will need to add the following environment variables to your .env file

`PORT` Ex. PORT=3001

`NODE_ENV` Ex. NODE_ENV=development

`MONGODB_URI` Ex. MONGODB_URI=mongodb+srv:

`DOMAIN` Ex. DOMAIN=http://localhost:3001

`DOMAIN_GOOGLE_STORAGE` ex. DOMAIN_GOOGLE_STORAGE=https://storage.googleapis.com/

`JWT_SECRET`


To run this project, you will need to add the file google_key.json Download [[Here]](https://cloud.google.com/docs/authentication/getting-started)
## API Reference

#### Login

```http
  POST /user/login
```

| Parameter | Type     | Description                |
| :-------- | :------- | :------------------------- |
| `email`   | `string` | **Required**.|
| `password`   | `string` | **Required**.|

#### Register

```http
  POST /user/register
```

| Parameter | Type     | Description                |
| :-------- | :------- | :------------------------- |
| `name`   | `string` | **Required**.|
| `email`   | `string` | **Required**.|
| `password`   | `string` | **Required**.|


And Other API Follow In Floder **/routes/**
  