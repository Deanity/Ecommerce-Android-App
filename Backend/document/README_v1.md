# User Authentication API
## POST /api/v1/users/register
### Request Body
```json
{
  "nama": "Dezaa",
  "email": "dezaa@example.com",
  "password": "password123",
  "no_hp": "08123456789",
  "alamat": "Jl. Sudirman No. 12"
}
```
### Response (201)
```json
{
  "success": true,
  "message": "Registrasi berhasil",
  "user": {
    "id": "679019cccd2ab8e4d9af11bd",
    "nama": "Dezaa",
    "email": "dezaa@example.com",
    "role": "user"
  },
  "token": "jwt_token_disini"
}
```
### Error Responses
```Email sudah terdaftar:```
```json
{
  "success": false,
  "message": "Email sudah terdaftar"
}
```
```Server error:```
```json
{
  "success": false,
  "message": "Terjadi kesalahan server"
}
```
## POST /api/v1/users/login
### Request Body
```json
{
  "email": "dezaa@example.com",
  "password": "password123"
}
```
### Response (200)
```json
{
  "success": true,
  "message": "Login berhasil",
  "user": {
    "id": "679019cccd2ab8e4d9af11bd",
    "nama": "Dezaa",
    "email": "dezaa@example.com",
    "role": "user"
  },
  "token": "jwt_token_disini"
}
```
### Error Responses
```User tidak ditemukan:```
```json
{
  "success": false,
  "message": "User tidak ditemukan"
}
```
```Password salah:```
```json
{
  "success": false,
  "message": "Password salah"
}
```
## GET /api/v1/users/profile
- Header : ```Authorization: Bearer <token>```
### Response (200)
```json
{
  "success": true,
  "user": {
    "id": "679019cccd2ab8e4d9af11bd",
    "nama": "Dezaa",
    "email": "dezaa@example.com",
    "no_hp": "08123456789",
    "alamat": "Jl. Sudirman No. 12",
    "role": "user"
  }
}
```
### Unauthorized (Token invalid)
```json
{
  "success": false,
  "message": "Tidak ada token, akses ditolak"
}
```
## PUT /api/v1/users/profile
- Header : ```Authorization: Bearer <token>```
### Request Body
```json
{
  "nama": "Dezaa Update",
  "email": "newmail@example.com",
  "no_hp": "081299887766",
  "alamat": "Jl. Baru No. 21",
  "password": "passwordBaru123"
}
```
### Response (200)
```json
{
  "success": true,
  "message": "Profil berhasil diperbarui",
  "user": {
    "id": "679019cccd2ab8e4d9af11bd",
    "nama": "Dezaa Update",
    "email": "newmail@example.com",
    "role": "user"
  }
}
```
### Error Responses
```User tidak ditemukan: ```
```json
{
  "success": false,
  "message": "User tidak ditemukan"
}
```