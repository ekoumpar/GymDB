# GymDB - Σύστημα Διαχείρισης Γυμναστηρίου

Ένα ολοκληρωμένο σύστημα διαχείρισης γυμναστηρίου που περιλαμβάνει τη σχεδίαση και δημιουργία της βάσης δεδομένων, το backend API, και μια σύγχρονη διεπαφή χρήστη (UI).

## Γρήγορη Εκκίνηση

### Προαπαιτούμενα
- **Node.js** (έκδοση 14 ή μεγαλύτερη)
- **MySQL Server** (έκδοση 8.0+)
- **npm** (συνήθως έρχεται με το Node.js)

### 1. Εγκατάσταση Βάσης Δεδομένων

#### Δημιουργία Βάσης
1. Ανοίξτε το MySQL client (MySQL Command Line Client ή MySQL Workbench)
2. Δημιουργήστε τη βάση δεδομένων:
```sql
CREATE DATABASE gymdb;
USE gymdb;
```

3. Εισάγετε τα δεδομένα αρχικοποίησης:
```bash
mysql -u root -p gymdb < database/gymDB_model.sql
mysql -u root -p gymdb < database/gymDB_users.sql
mysql -u root -p gymdb < database/gymDB_init_data.sql
```

#### Σύνδεση με τη Βάση Δεδομένων
Ενημερώστε τα διαπιστευτήρια σύνδεσης στο αρχείο κονφιγουράσης του backend (`web development/backend/src/config/database.js`):

```javascript
const connection = mysql.createPool({
  host: 'localhost',      // Διεύθυνση MySQL server
  user: 'root',           // Όνομα χρήστη MySQL
  password: 'your_password', // Κωδικός MySQL
  database: 'gymdb',      // Όνομα βάσης δεδομένων
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
});
```

### 2. Εγκατάσταση και Εκτέλεση Backend

```bash
# Μετακίνηση στον φάκελο backend
cd "web development/backend"

# Εγκατάσταση εξαρτήσεων
npm install

# Εκτέλεση server
npm start
# ή για development mode με hot-reload:
npm run dev
```

Ο server θα ακούει στη διεύθυνση: **http://localhost:4000**

**Σημείωση:** Εάν δεν μπορεί να συνδεθεί με τη MySQL βάση, θα ξεκινήσει σε MOCK mode με δεδομένα δοκιμής.

### 3. Εγκατάσταση και Εκτέλεση Frontend

```bash
# Μετακίνηση στον φάκελο frontend
cd "web development/frontend"

# Εγκατάσταση εξαρτήσεων
npm install

# Εκτέλεση εφαρμογής
npm start
```

Η εφαρμογή θα ανοίξει στο browser σας στη διεύθυνση: **http://localhost:3000**

## Δυνατότητες της Εφαρμογής

### Αυθεντικοποίηση & Χρήστες
-  **Εγγραφή** νέων χρηστών με πλήρη στοιχεία (όνομα, κωδικό, ημερομηνία γέννησης, αριθμός τηλεφώνου, ύψος, βάρος)
-  **Σύνδεση** με όνομα χρήστη και κωδικό
-  **Αποσύνδεση** και διαχείριση συνεδρίας
-  **Προφίλ χρήστη** με προβολή και ενημέρωση προσωπικών δεδομένων

### Δυνατότητες Μελών
-  Προβολή **λίστας μελών** (admin)
-  Προβολή **προσωπικού προφίλ** με λεπτομέρειες
-  Δυνατότητα **ακύρωσης κρατήσεων** από το προφίλ

### Συνδρομές & Πακέτα
-  Προβολή **διαθέσιμων τύπων συνδρομής** με τιμές και διάρκεια
-  Καταχώρηση συνδρομών χρηστών
-  Παρακολούθηση κατάστασης συνδρομής

### Μαθήματα & Χρονοδιάγραμμα
-  Προβολή **διαθέσιμων μαθημάτων**
-  Προβολή **εβδομαδιαίου χρονοδιαγράμματος** με ημέρες, ώρες και εκπαιδευτές
-  Τοποθέτηση μαθημάτων ανά **αίθουσα**
-  Πληροφορίες **εκπαιδευτή** για κάθε μάθημα

### Κρατήσεις Μαθημάτων
-  **Κράτηση σε μαθήματα** 
-  **Προβολή ιστορικού κρατήσεων** στο προφίλ
-  **Ακύρωση κρατήσεων** μαθημάτων
-  **Έλεγχος διπλής κράτησης στο ίδιο μάθημα** 

### Εκπαιδευτές
-  Προβολή **λίστας εκπαιδευτών** 
-  Δύνατες να **αναθέσουν μαθήματα**
-  Σύνδεση εκπαιδευτή με **χρονοδιάγραμμα μαθημάτων**

### Πληροφορίες & Επικοινωνία
-  **Σελίδα Contact** με στοιχεία επικοινωνίας, ώρες λειτουργίας και χάρτη τοποθεσίας
-  Πληροφορίες **τηλεφώνου και email**
-  Ενσωματωμένος **Google Maps** για την τοποθεσία

### Αναφορές & Ερωτήματα Δεδομένων
-  **Ημέρα με περισσότερες κρατήσεις**
-  **Απόντα μέλη** (κρατήσανε αλλά δεν παρουσιάθηκαν)
-  **Σύνολο μελών** ανά κατηγορία
-  **Λεπτομέρειες εκπαιδευτή** (μαθήματα και δρομολόγιο)
-  **Τύποι συνδρομών** και πληροφορίες
-  **Μέση διάρκεια μαθημάτων**
-  **Αριθμός εξοπλισμού** ανά αίθουσα


## Δομή Έργου

```
GymDB/
├── database/                    # Αρχεία βάσης δεδομένων
│   ├── gymDB_model.sql         # Σχήμα βάσης
│   ├── gymDB_users.sql         # Δεδομένα χρηστών
│   ├── gymDB_init_data.sql     # Αρχικά δεδομένα
│   └── queries/                # Πολύπλοκα SQL ερωτήματα
│
├── web development/
│   ├── backend/                # Express.js API server
│   │   ├── src/
│   │   │   ├── controllers/    # Λογική ελέγχου
│   │   │   ├── services/       # Επιχειρησιακή λογική
│   │   │   ├── routes/         # API δρομολόγηση
│   │   │   ├── middleware/     # Middleware συναρτήσεις
│   │   │   └── config/         # Ρυθμίσεις σύνδεσης
│   │   └── server.js           # Κύριο αρχείο server
│   │
│   └── frontend/               # React εφαρμογή
│       ├── src/
│       │   ├── components/     # React components
│       │   ├── pages/          # Σελίδες εφαρμογής
│       │   ├── api/            # API κλήσεις
│       │   └── styles/         # CSS ύφη
│       └── public/             # Δημόσιες πηγές
```

---

## Ανάπτυξη

### Εγκατάσταση εξαρτήσεων
```bash
# Backend
cd "web development/backend"
npm install

# Frontend
cd "web development/frontend"
npm install
```

### Εκτέλεση σε Development Mode
```bash
# Backend με hot-reload (nodemon)
npm run dev

# Frontend με hot-reload (react-scripts)
npm start
```

## Πληροφορίες Ασφαλείας & Λεπτομέρειες Υλοποίησης

### Αυθεντικοποίηση & Αποθήκευση Token
- **JWT (JSON Web Tokens)** για ασφαλή διαχείριση συνεδρίας
- **bcryptjs** για κωδικοποίηση κωδικών πρόσβασης
- Tokens αποθηκεύονται στο **localStorage** του browser
- Automatic token refresh κατά τη σύνδεση

### Επικύρωση & Προστασία
- **Express-validator** για επικύρωση δεδομένων στο backend
- **Middleware αυθεντικοποίησης** για προστασία protected routes
- **CORS** ενεργοποιημένο για ασφαλή cross-origin requests
- **Προστασία έναντι SQL injection** με parameterized queries

### Διαχείριση Σφαλμάτων
- Error messages για τον χρήστη


## Τεχνολογίες & Stack

### Backend
- **Node.js** με **Express.js**
- **MySQL 8.0** ως βάση δεδομένων
- **JWT** για αυθεντικοποίηση
- **bcryptjs** για ασφάλεια κωδικών
- **CORS** για cross-origin requests

### Frontend  
- **React 18** με Hooks
- **React Router v6** για δρομολόγηση
- **Axios** για HTTP requests
- **CSS3** με responsive design


## Σημαντικές Σημειώσεις

1. **Σύνδεση MySQL**: Βεβαιωθείτε ότι το MySQL server τρέχει πριν ξεκινήσετε το backend
2. **Ports**: Το backend χρησιμοποιεί τη θύρα **4000**, το frontend τη θύρα **3000**
3. **Environment Variables**: Δημιουργήστε αρχείο `.env` στο backend folder με τα διαπιστευτήρια της βάσης
4. **MOCK Mode**: Αν δεν έχετε MySQL, ο server θα εκτελεστεί με δεδομένα δοκιμής

## Υποστήριξη & Περισσότερες Πληροφορίες

Για περισσότερες λεπτομέρειες, δείτε τα αρχεία README σε:
- [Backend README](web%20development/backend/README.md)
- [Frontend README](web%20development/frontend/README.md) 
