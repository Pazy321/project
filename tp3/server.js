const express = require('express');
const mysql = require('mysql2');
const cors = require('cors');
const bodyParser = require('body-parser');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'public')));

// Подключение к базе данных
const db = mysql.createConnection({
    host: 'localhost',
    user: 'your_username',
    password: 'your_password',
    database: 'glampling'
});

db.connect((err) => {
    if (err) {
        console.error('Ошибка подключения к базе данных:', err);
        return;
    }
    console.log('Подключение к базе данных установлено');
});

// API endpoints

// Получить все бронирования
app.get('/api/bookings', (req, res) => {
    const query = 'SELECT * FROM bookings ORDER BY created_at DESC';
    db.query(query, (err, results) => {
        if (err) {
            res.status(500).json({ error: err.message });
            return;
        }
        res.json(results);
    });
});

// Создать новое бронирование
app.post('/api/bookings', (req, res) => {
    const {
        checkin_date,
        checkout_date,
        adults,
        children,
        infants,
        total_price,
        guest_name,
        guest_phone,
        guest_email
    } = req.body;

    // Проверка доступности дат
    const checkAvailabilityQuery = `
        SELECT COUNT(*) as count FROM availability 
        WHERE date BETWEEN ? AND ? AND is_available = FALSE
    `;
    
    db.query(checkAvailabilityQuery, [checkin_date, checkout_date], (err, results) => {
        if (err) {
            res.status(500).json({ error: err.message });
            return;
        }

        if (results[0].count > 0) {
            res.status(400).json({ error: 'Выбранные даты уже заняты' });
            return;
        }

        // Создание бронирования
        const insertQuery = `
            INSERT INTO bookings 
            (checkin_date, checkout_date, adults, children, infants, total_price, guest_name, guest_phone, guest_email) 
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
        `;

        db.query(insertQuery, [
            checkin_date,
            checkout_date,
            adults,
            children,
            infants,
            total_price,
            guest_name,
            guest_phone,
            guest_email
        ], (err, results) => {
            if (err) {
                res.status(500).json({ error: err.message });
                return;
            }

            // Обновление доступности дат
            const updateAvailabilityQuery = `
                INSERT INTO availability (date, is_available) 
                VALUES ? 
                ON DUPLICATE KEY UPDATE is_available = FALSE
            `;
            
            const dates = [];
            const currentDate = new Date(checkin_date);
            const endDate = new Date(checkout_date);
            
            while (currentDate < endDate) {
                dates.push([currentDate.toISOString().split('T')[0]]);
                currentDate.setDate(currentDate.getDate() + 1);
            }

            if (dates.length > 0) {
                db.query(updateAvailabilityQuery, [dates], (err) => {
                    if (err) {
                        console.error('Ошибка обновления доступности:', err);
                    }
                });
            }

            res.json({ 
                success: true, 
                bookingId: results.insertId,
                message: 'Бронирование успешно создано' 
            });
        });
    });
});

// Получить отзывы
app.get('/api/reviews', (req, res) => {
    const query = 'SELECT * FROM reviews WHERE is_approved = TRUE ORDER BY created_at DESC';
    db.query(query, (err, results) => {
        if (err) {
            res.status(500).json({ error: err.message });
            return;
        }
        res.json(results);
    });
});

// Добавить отзыв
app.post('/api/reviews', (req, res) => {
    const { guest_name, avatar_url, review_text, rating } = req.body;
    
    const query = 'INSERT INTO reviews (guest_name, avatar_url, review_text, rating) VALUES (?, ?, ?, ?)';
    
    db.query(query, [guest_name, avatar_url, review_text, rating], (err, results) => {
        if (err) {
            res.status(500).json({ error: err.message });
            return;
        }
        res.json({ success: true, message: 'Отзыв отправлен на модерацию' });
    });
});

// Получить доступные даты
app.get('/api/availability', (req, res) => {
    const query = 'SELECT date FROM availability WHERE is_available = TRUE AND date >= CURDATE() ORDER BY date';
    db.query(query, (err, results) => {
        if (err) {
            res.status(500).json({ error: err.message });
            return;
        }
        const availableDates = results.map(row => row.date);
        res.json(availableDates);
    });
});

app.listen(PORT, () => {
    console.log(`Сервер запущен на порту ${PORT}`);
});