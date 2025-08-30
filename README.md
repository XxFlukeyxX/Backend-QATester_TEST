# Telemedicine API

**API** สำหรับระบบ **Telemedicine** ที่รองรับการลงทะเบียนผู้ใช้ (ทั้งผู้ป่วยและแพทย์)

และการเข้าสู่ระบบ, การจัดการการนัดหมาย, และการดูข้อมูลโปรไฟล์

---

## ฟีเจอร์ API หลัก

### 🔑 **Authentication**
- สมัครสมาชิก (Patient/Doctor)
- เข้าสู่ระบบ (Login)

### 🧑‍⚕️ **Patient**
- ค้นหาหมอที่มีสาขา
- จองนัด, เลื่อนนัด, ยกเลิกนัด
- ดูรายการนัดหมายของตนเอง

### 👨‍⚕️ **Doctor**
- จัดการเวลาว่างของตัวเอง
- ดูนัดหมายของผู้ป่วยที่จองกับตัวเอง

### 👤 **Profile**
- ดู/แก้ไขข้อมูลโปรไฟล์ (patient & doctor)

---

## การติดตั้ง (Installation)

### 1. Clone โปรเจกต์
```bash

2. ติดตั้ง Dependencies
npm install

3. ตั้งค่า Environment
นำ .env ที่ส่งทาง Msteam ไปใส่

รันเซิร์ฟเวอร์ด้วยคำสั่ง

node server.js

4. Database Schema
ตารางหลักใน MySQL:

users - เก็บข้อมูลผู้ใช้ (patient, doctor)

patient_profiles - เก็บข้อมูลเพิ่มเติมของผู้ป่วย

doctors - เก็บข้อมูลหมอ + specialty

specialties - เก็บประเภทการรักษาของหมอ

appointments - เก็บข้อมูลการนัดหมาย

doctor_availability - ตารางเวลาว่างของหมอ
