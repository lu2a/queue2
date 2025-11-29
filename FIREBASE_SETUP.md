# دليل إعداد Firebase - نظام إدارة الانتظار

## خطوات إعداد Firebase

### 1. إنشاء مشروع Firebase

1. انتقل إلى [Firebase Console](https://console.firebase.google.com/)
2. انقر على "إضافة مشروع" (Add project)
3. أدخل اسم المشروع (مثال: Medical Center Queue System)
4. اختر حساب Google Analytics (اختياري)
5. انقر على "إنشاء مشروع" (Create project)

### 2. إعداد تطبيق ويب

1. بعد إنشاء المشروع، انقر على "إضافة تطبيق" (Add app)
2. اختر أيقونة الويب (</>)
3. سجل التطبيق:
   - اسم التطبيق: Medical Center System
   - انقر على "تسجيل التطبيق"

4. ستحصل على إعدادات Firebase. انسخ هذه الإعدادات وضعها في ملف `firebase-config.js`

### 3. تفعيل الخدمات المطلوبة

#### Authentication
1. انتقل إلى "Authentication" من القائمة الجانبية
2. انقر على "Get started"
3. اختر "Email/Password" وفعّله
4. في "Users"، يمكنك إضافة مستخدمين يدويًا

#### Realtime Database
1. انتقل إلى "Realtime Database" من القائمة الجانبية
2. انقر على "Create Database"
3. اختر "Start in test mode" (سيتم تغييره لاحقًا)
4. اختر الموقع المناسب

#### Firestore Database
1. انتقل إلى "Firestore Database" من القائمة الجانبية
2. انقر على "Create database"
3. اختر "Start in production mode"
4. اختر الموقع المناسب

#### Storage
1. انتقل إلى "Storage" من القائمة الجانبية
2. انقر على "Get started"
3. اختر "Start in test mode" (سيتم تغييره لاحقًا)

### 4. إعداد قواعد الأمان

#### Realtime Database Rules
انتقل إلى "Realtime Database" > "Rules" واستبدل القواعد بالتالي:

```json
{
  "rules": {
    "screens": {
      ".read": true,
      ".write": "auth != null && auth.token.admin == true"
    },
    "clinics": {
      ".read": true,
      ".write": "auth != null && auth.token.admin == true"
    },
    "queues": {
      ".read": true,
      ".write": "auth != null"
    },
    "appointments": {
      ".read": "auth != null",
      ".write": "auth != null"
    },
    "consultations": {
      ".read": "auth != null",
      ".write": "auth != null"
    },
    "doctors": {
      ".read": "auth != null",
      ".write": "auth != null && auth.token.admin == true"
    },
    "settings": {
      ".read": true,
      ".write": "auth != null && auth.token.admin == true"
    },
    "notifications": {
      ".read": true,
      ".write": "auth != null"
    },
    "attendance": {
      ".read": "auth != null",
      ".write": "auth != null"
    },
    "complaints": {
      ".read": "auth != null && auth.token.admin == true",
      ".write": "auth != null"
    }
  }
}
```

#### Firestore Rules
انتقل إلى "Firestore Database" > "Rules" واستبدل القواعد بالتالي:

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    
    // Doctors collection
    match /doctors/{doctorId} {
      allow read: if request.auth != null;
      allow write: if request.auth != null && request.auth.token.admin == true;
    }
    
    // Patients collection
    match /patients/{patientId} {
      allow read, write: if request.auth != null;
    }
    
    // Appointments collection
    match /appointments/{appointmentId} {
      allow read, write: if request.auth != null;
    }
    
    // Consultations collection
    match /consultations/{consultationId} {
      allow read, write: if request.auth != null;
    }
    
    // Requests collection
    match /requests/{requestId} {
      allow read, write: if request.auth != null;
    }
    
    // Complaints collection
    match /complaints/{complaintId} {
      allow read: if request.auth != null && request.auth.token.admin == true;
      allow write: if request.auth != null;
    }
  }
}
```

#### Storage Rules
انتقل إلى "Storage" > "Rules" واستبدل القواعد بالتالي:

```javascript
rules_version = '2';
service firebase.storage {
  match /b/{bucket}/o {
    match /{allPaths=**} {
      allow read: if true;
      allow write: if request.auth != null && request.auth.token.admin == true;
    }
  }
}
```

### 5. إعداد المصادقة

#### تفعيل Email/Password
1. انتقل إلى "Authentication" > "Sign-in method"
2. فعّل "Email/Password"
3. في "Users"، أضف المستخدمين التاليين:

**حساب الإدارة:**
- البريد: admin@medical-center.com
- كلمة المرور: Admin@123456
- Role: admin

**حساب طبيب:**
- البريد: doctor@medical-center.com
- كلمة المرور: Doctor@123456
- Role: doctor

### 6. إضافة Custom Claims (للأدوار)

لإضافة أدوار للمستخدمين (admin, doctor)، استخدم Firebase Admin SDK أو Firebase Functions:

```javascript
// Firebase Function example
const functions = require('firebase-functions');
const admin = require('firebase-admin');

exports.setAdminRole = functions.https.onCall(async (data, context) => {
  // Check if requester is admin
  if (!context.auth.token.admin) {
    return { error: 'Only admins can set roles' };
  }
  
  // Set custom user claims
  await admin.auth().setCustomUserClaims(data.uid, {
    admin: data.role === 'admin',
    doctor: data.role === 'doctor'
  });
  
  return { success: true };
});
```

### 7. إضافة البيانات الأولية

#### إضافة إعدادات النظام
```javascript
// في Realtime Database
{
  "settings": {
    "centerName": "المركز الطبي المتكامل",
    "newsTicker": "أهلاً وسهلاً بكم في المركز الطبي - نسعى لتقديم أفضل خدمة طبية لكم",
    "tickerSpeed": "normal",
    "alertDuration": 5,
    "speechSpeed": "normal",
    "audioPath": "./audio/",
    "mediaPath": "./media/"
  }
}
```

#### إضافة شاشات
```javascript
// في Realtime Database
{
  "screens": {
    "1": {
      "name": "الشاشة الرئيسية",
      "password": "1234",
      "active": true,
      "clinics": ["1", "2", "3", "4"]
    },
    "2": {
      "name": "شاشة الطوارئ",
      "password": "5678",
      "active": true,
      "clinics": ["5", "6", "7", "8"]
    }
  }
}
```

#### إضافة عيادات
```javascript
// في Realtime Database
{
  "clinics": {
    "1": {
      "name": "عيادة طب الأسرة",
      "currentNumber": 0,
      "active": true,
      "screenId": "1",
      "password": "clinic123",
      "specialty": "طب الأسرة"
    },
    "2": {
      "name": "عيادة الباطنة",
      "currentNumber": 0,
      "active": true,
      "screenId": "1",
      "password": "clinic456",
      "specialty": "الباطنة"
    }
  }
}
```

### 8. تفعيل Google Analytics (اختياري)

1. انتقل إلى "Google Analytics" من القائمة الجانبية
2. اتبع التعليمات لربط Firebase بـ Google Analytics
3. هذا سيساعد في تتبع استخدام النظام

### 9. إعداد GitHub Pages

1. أنشئ مستودع جديد على GitHub
2. ارفع جميع ملفات المشروع
3. انتقل إلى "Settings" > "Pages"
4. اختر "Deploy from a branch"
5. اختر "main" branch و"/ (root)"
6. سيتم نشر الموقع على: `https://yourusername.github.io/repository-name/`

### 10. اختبار النظام

#### اختبار المصادقة
1. جرب تسجيل الدخول بحساب الإدارة
2. جرب تسجيل الدخول بحساب الطبيب
3. تأكد من ظهور الصلاحيات الصحيحة

#### اختبار قواعد البيانات
1. أضف عيادة جديدة من لوحة الإدارة
2. تأكد من ظهورها في شاشة العرض
3. جرب تغيير رقم العيادة من لوحة التحكم

#### اختبار النداء
1. جرب الضغط على "العميل التالي"
2. تأكد من تشغيل الصوت الصحيح
3. تأكد من ظهور الإشعار في شاشة العرض

## حل المشكلات الشائعة

### 1. خطأ في الاتصال بقاعدة البيانات
```
- تأكد من إعدادات Firebase في firebase-config.js
- تأكد من تفعيل Realtime Database
- تحقق من قواعد الأمان
```

### 2. لا يعمل تسجيل الدخول
```
- تأكد من تفعيل Email/Password Authentication
- تحقق من بيانات المستخدم في Firebase Auth
- تأكد من إضافة Custom Claims للأدوار
```

### 3. لا يظهر شيء في شاشة العرض
```
- تأكد من اختيار الشاشة الصحيحة
- تحقق من كلمة مرور الشاشة
- تأكد من ربط العيادات بالشاشة
```

### 4. لا يعمل الصوت
```
- تأكد من وجود ملفات الصوت في المسار الصحيح
- تحقق من إعدادات المتصفح للصوت
- جرب تشغيل الصوت يدوياً
```

## نصائح مهمة

### الأمان
1. لا تشارك مفاتيح Firebase مع أي شخص
2. استخدم كلمات مرور قوية
3. عدل قواعد الأمان حسب الحاجة
4. راقب سجلات الاستخدام

### الأداء
1. استخدم CDN للمكتبات الخارجية
2. ضغط الصور والفيديوهات
3. استخدم التخزين المحلي للبيانات الثابتة
4. راقب استخدام الباندويث

### الصيانة
1. أنشئ نسخ احتياطية بانتظام
2. حدث المكتبات بانتظام
3. راقب سجلات الخطأ
4. اختبر النظام بشكل دوري

## الدعم الفني

إذا واجهت مشكلات في الإعداد:

1. تحقق من [Firebase Documentation](https://firebase.google.com/docs)
2. راجع قسم حل المشكلات في README.md
3. تواصل مع فريق الدعم الفني

---

**ملاحظة**: هذا الدليل يوفر خطوات مفصلة لإعداد Firebase. تأكد من اتباع كل خطوة بعناية للحصول على أفضل أداء.