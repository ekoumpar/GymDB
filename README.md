# GymDB - Σύστημα Διαχείρισης Γυμναστηρίου

Ένα ολοκληρωμένο σύστημα διαχείρισης γυμναστηρίου με βάση δεδομένων, backend API και σύγχρονο frontend UI.

---

## Online Πρόσβαση
Η εφαρμογή είναι ανεβασμένη στο Render:  
https://gymdb-frontend.onrender.com/  
> Περιλαμβάνει δεδομένα δοκιμής.

---

## Εκκίνηση τοπικά

### Προαπαιτούμενα
- Node.js (v14+)
- MySQL Server (v8+)
- npm (έρχεται με το Node.js)

### 1. Κατέβασμα Project
```
git clone https://github.com/ekoumpar/GymDB.git
```

### 2. Δημιουργία Βάσης Δεδομένων
1. Ανοίξτε Command Prompt (cmd).
2. **Επιλογή Α - Χρήση Dump:**
```
mysql -u root -p < "C:\Users\...\GymDB\web development\backend\gymDB_dump.sql"
```

**Επιλογή Β - Χρήση αρχείων από database folder:**

Πρώτα δημιουργήστε τη βάση:
```
mysql -u root -p -e "CREATE DATABASE gymdb;"
```

Στη συνέχεια φορτώστε τα αρχεία:
```
mysql -u root -p < "C:\Users\...\GymDB\database\gymDB_model.sql"
mysql -u root -p < "C:\Users\...\GymDB\database\gymDB_users.sql"
mysql -u root -p < "C:\Users\...\GymDB\database\gymDB_init_data.sql"
```

> **Σημείωση:** Τα αρχεία `gymDB_users.sql` περιέχουν κωδικούς χρηστών της βάσης δεδομένων που θα δημιουργηθούν αυτόματα.

4. Πληκτρολογήστε τον κωδικό root της MySQL.

> ⚠️ Αν το path έχει κενά, διατήρηστε τα εισαγωγικά " ".

### 3. Εκκίνηση Backend
1. Μετακίνηση στον φάκελο backend:
```
cd "web development/backend"
```
2. Αντιγραφή .env.example σε .env:
   - DB_PASSWORD → κωδικός MySQL
   - Προαιρετικά `USE_MOCK='1'` για δοκιμαστικά δεδομένα
3. Εγκατάσταση εξαρτήσεων:
```
npm install
```
4. Εκτέλεση server:
```
npm start
```

Ο server τρέχει στο http://localhost:4000

### 4. Εκκίνηση Frontend
1. Μετακίνηση στον φάκελο frontend:
```
cd "web development/frontend"
```
2. Εγκατάσταση εξαρτήσεων:
```
npm install
```
4. Εκτέλεση εφαρμογής:
```
npm start
```

Το frontend ανοίγει στο http://localhost:3000

---

## Δυνατότητες

- **Χρήστες & Αυθεντικοποίηση:** Εγγραφή, σύνδεση, προφίλ, ιστορικό κρατήσεων, κράτηση μαθημάτων
- **Συνδρομές & Πακέτα:** Προβολή τύπων και τιμών συνδρομών
- **Μαθήματα & Χρονοδιάγραμμα:** Λίστα μαθημάτων, εβδομαδιαίο πρόγραμμα
- **Εκπαιδευτές:** Προβολή στοιχείων εκπαιδευτών
- **Πληροφορίες & Επικοινωνία:** Contact page, Google Maps, ώρες λειτουργίας, τηλέφωνο & email

---
## Σημαντικές Σημειώσεις 
1. **Σύνδεση MySQL**: Βεβαιωθείτε ότι το MySQL server τρέχει πριν ξεκινήσετε το backend
2. **Ports**: Το backend χρησιμοποιεί τη θύρα **4000**, το frontend τη θύρα **3000**
3. **Environment Variables**: Δημιουργήστε αρχείο .env στο backend folder με τα στοιχεία σύνδεσης της βάσης
4. **MOCK Mode**: Αν δεν έχετε συνδέσει την βάση, ο server θα εκτελεστεί με δεδομένα δοκιμής 

## Υποστήριξη & Περισσότερες Πληροφορίες 
Για περισσότερες λεπτομέρειες, δείτε τα αρχεία README σε: 
- [Backend README](web%20development/backend/README.md)
- [Frontend README](web%20development/frontend/README.md) 

## Δομή Έργου

```
GymDB/
├── database/
│   ├── *.sql & *.mwb     # Βοηθητικά αρχεία (δημιουργημένα με τη βάση)
│   └── queries/          # Πολύπλοκα SQL ερωτήματα       
│
├── web development/
│   ├── backend/
│   │   ├── src/
│   │   │   ├── api.js
│   │   │   ├── app.js
│   │   │   ├── auth.js
│   │   │   ├── db.js
│   │   │   ├── index.js
│   │   │   ├── controllers/
│   │   │   ├── services/
│   │   │   ├── routes/
│   │   │   ├── middleware/
│   │   │   ├── config/
│   │   │   └── utils/
│   │   ├── server.js
│   │   ├── package.json
│   │   ├── gymDB_dump.sql
│   │   ├── .env.example
│   │   └── README.md
│   │
│   └── frontend/
│       ├── src/
│       │   ├── App.jsx
│       │   ├── index.js
│       │   ├── index.css
│       │   ├── api/
│       │   ├── components/
│       │   ├── pages/
│       │   ├── styles/
│       │   └── utils/
│       ├── public/
│       ├── package.json
│       ├── .gitignore
│       └── README.md
```

---