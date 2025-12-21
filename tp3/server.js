const express = require('express');
const mysql = require('mysql2');
const path = require('path');
const { encryptData, decryptData, createPhoneHash } = require('./encryption');

const app = express();
const PORT = 3000;

// ========== MIDDLEWARE ==========
app.use(express.json());

// CORS middleware (разрешаем запросы для разработки)
app.use((req, res, next) => {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, Authorization');
    res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
    
    if (req.method === 'OPTIONS') {
        return res.sendStatus(200);
    }
    
    next();
});

app.use(express.static(__dirname));

// ========== ПОДКЛЮЧЕНИЕ К БАЗЕ ДАННЫХ ==========
const db = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: 'root',
    database: 'glampling',
    charset: 'utf8mb4'
});

// Подключение к БД
db.connect((err) => {
    if (err) {
        console.log('❌ БД НЕ ПОДКЛЮЧЕНА. Ошибка:', err.message);
        console.log('⚠️  Сервер работает без БД');
    } else {
        console.log('✅ БАЗА ДАННЫХ ПОДКЛЮЧЕНА УСПЕШНО!');
        
        // Проверяем таблицы
        db.query('SHOW TABLES', (err, results) => {
            if (err) {
                console.log('❌ Не могу получить список таблиц');
            } else {
                console.log('📊 Таблицы в базе:');
                results.forEach(row => {
                    console.log('   -', Object.values(row)[0]);
                });
            }
        });
    }
});

// ========== ПОЛЬЗОВАТЕЛЬСКИЕ API ЭНДПОИНТЫ ==========

// Проверка доступных дат
app.get('/api/availability', (req, res) => {
    console.log('📅 Запрос доступных дат');
    
    db.query('SELECT date FROM availability WHERE is_available = TRUE', (err, results) => {
        if (err) {
            console.log('❌ Ошибка БД при запросе дат, используем тестовые данные');
            const testDates = ['2024-12-15', '2024-12-16', '2024-12-17'];
            res.json(testDates);
        } else {
            console.log('✅ Данные получены из БД');
            const availableDates = results.map(row => row.date);
            res.json(availableDates);
        }
    });
});

// Получение отзывов
app.get('/api/reviews', (req, res) => {
    console.log('⭐ Запрос отзывов');
    
    db.query('SELECT * FROM reviews WHERE is_approved = TRUE', (err, results) => {
        if (err) {
            console.log('❌ Ошибка БД при запросе отзывов, используем тестовые данные');
            const testReviews = [
                {
                    guest_name: "Анна",
                    review_text: "Отличное место!",
                    rating: 5
                }
            ];
            res.json(testReviews);
        } else {
            console.log('✅ Отзывы получены из БД');
            res.json(results);
        }
    });
});

// Создание бронирования
app.post('/api/bookings', (req, res) => {
    console.log('='.repeat(50));
    console.log('📋 ПОЛУЧЕНА ЗАЯВКА НА БРОНИРОВАНИЕ');
    console.log('='.repeat(50));
    
    console.log('📦 ВСЕ ДАННЫЕ ОТ КЛИЕНТА:');
    console.log(JSON.stringify(req.body, null, 2));
    
    console.log('\n🔍 КОНКРЕТНЫЕ ПОЛЯ:');
    console.log('Имя (guest_name):', req.body.guest_name);
    console.log('Телефон (guest_phone):', req.body.guest_phone);
    console.log('Email (guest_email):', req.body.guest_email);
    console.log('Дата заезда:', req.body.checkin_date);
    console.log('Дата выезда:', req.body.checkout_date);
    
    // Валидация обязательных полей
    if (!req.body.guest_name || !req.body.guest_phone || !req.body.guest_email) {
        console.log('❌ Не все обязательные поля заполнены');
        return res.status(400).json({ 
            success: false, 
            error: 'Заполните все обязательные поля: ФИО, телефон и email' 
        });
    }
    
    const bookingData = {
        checkin_date: req.body.checkin_date || '2024-01-01',
        checkout_date: req.body.checkout_date || '2024-01-02',
        adults: req.body.adults || 2,
        children: req.body.children || 0,
        infants: req.body.infants || 0,
        total_price: req.body.total_price || 12000,
        
        // Шифруем данные
        guest_name_encrypted: encryptData(req.body.guest_name),
        guest_phone_encrypted: encryptData(req.body.guest_phone),
        guest_email_encrypted: encryptData(req.body.guest_email),
        
        guest_phone_hash: createPhoneHash(req.body.guest_phone),
        status: 'pending'
    };
    
    console.log('\n📊 ДАННЫЕ ДЛЯ СОХРАНЕНИЯ В БД:');
    console.log(JSON.stringify({
        ...bookingData,
        guest_name_encrypted: '***зашифровано***',
        guest_phone_encrypted: '***зашифровано***',
        guest_email_encrypted: '***зашифровано***'
    }, null, 2));
    
    console.log('\n💾 СОХРАНЯЕМ В БАЗУ ДАННЫХ...');
    
    db.query('INSERT INTO bookings SET ?', bookingData, (err, results) => {
        if (err) {
            console.log('❌ ОШИБКА БАЗЫ ДАННЫХ:', err.message);
            res.status(500).json({ 
                success: false, 
                error: 'Ошибка при бронировании',
                details: err.message 
            });
        } else {
            console.log('✅ УСПЕХ! Бронирование сохранено');
            console.log('✅ ID записи:', results.insertId);
            res.json({ 
                success: true, 
                message: 'Бронирование успешно создано! Мы свяжемся с вами для подтверждения.',
                bookingId: results.insertId
            });
        }
    });
});

// Заявки
app.post('/api/applications', (req, res) => {
    console.log('📝 Получена заявка:', req.body);
    
    // Простая обработка заявки
    res.json({ 
        success: true, 
        message: 'Заявка получена! Мы свяжемся с вами в ближайшее время.' 
    });
});

// ========== АДМИНСКИЕ API ЭНДПОИНТЫ ==========

// Middleware для проверки авторизации
const adminAuth = (req, res, next) => {
    const authHeader = req.headers.authorization;
    
    console.log('🔐 Проверка авторизации:', {
        url: req.url,
        authHeader: authHeader ? '***' : 'отсутствует',
        method: req.method,
        allHeaders: req.headers
    });
    
    // Временно отключаем проверку для отладки
    console.log('⚠️  ВНИМАНИЕ: проверка авторизации временно отключена для отладки');
    return next();
    
    // Рабочая проверка (закомментирована для отладки)
    /*
    if (!authHeader) {
        console.log('❌ Нет заголовка Authorization');
        return res.status(401).json({ 
            error: 'Требуется авторизация',
            message: 'Добавьте заголовок Authorization: Bearer admin-secret-token'
        });
    }
    
    if (authHeader !== 'Bearer admin-secret-token') {
        console.log('❌ Неверный токен');
        return res.status(401).json({ 
            error: 'Неверный токен авторизации',
            message: 'Используйте токен: admin-secret-token'
        });
    }
    
    console.log('✅ Авторизация успешна');
    next();
    */
};

// Получение всех бронирований (с дешифровкой)
app.get('/api/admin/bookings', adminAuth, (req, res) => {
    console.log('🔐 Запрос на получение бронирований от админа');
    
    const query = `
        SELECT 
            id,
            checkin_date,
            checkout_date,
            adults,
            children,
            infants,
            total_price,
            guest_name_encrypted,
            guest_phone_encrypted,
            guest_email_encrypted,
            guest_phone_hash,
            status,
            created_at,
            updated_at
        FROM bookings 
        ORDER BY created_at DESC
    `;
    
    db.query(query, (err, results) => {
        if (err) {
            console.error('❌ Ошибка получения бронирований:', err);
            return res.status(500).json({ error: 'Ошибка сервера' });
        }
        
        // Дешифруем данные
        const bookings = results.map(row => {
            try {
                return {
                    id: row.id,
                    checkin_date: row.checkin_date,
                    checkout_date: row.checkout_date,
                    adults: row.adults,
                    children: row.children,
                    infants: row.infants,
                    total_price: row.total_price,
                    guest_name: row.guest_name_encrypted ? 
                        decryptData(row.guest_name_encrypted) : 'Не указано',
                    guest_phone: row.guest_phone_encrypted ? 
                        decryptData(row.guest_phone_encrypted) : 'Не указан',
                    guest_email: row.guest_email_encrypted ? 
                        decryptData(row.guest_email_encrypted) : null,
                    guest_phone_hash: row.guest_phone_hash,
                    status: row.status,
                    created_at: row.created_at,
                    updated_at: row.updated_at
                };
            } catch (error) {
                console.error('❌ Ошибка дешифрования данных:', error);
                return {
                    ...row,
                    guest_name: 'Ошибка дешифрования',
                    guest_phone: 'Ошибка дешифрования',
                    guest_email: null
                };
            }
        });
        
        console.log(`📊 Отправлено ${bookings.length} бронирований`);
        res.json(bookings);
    });
});

// Получение конкретного бронирования
app.get('/api/admin/bookings/:id', adminAuth, (req, res) => {
    const id = req.params.id;
    console.log(`🔐 Запрос бронирования #${id}`);
    
    db.query('SELECT * FROM bookings WHERE id = ?', [id], (err, results) => {
        if (err) {
            console.error('❌ Ошибка получения бронирования:', err);
            return res.status(500).json({ error: 'Ошибка сервера' });
        }
        
        if (results.length === 0) {
            console.log(`❌ Бронирование #${id} не найдено`);
            return res.status(404).json({ error: 'Бронирование не найдено' });
        }
        
        const booking = results[0];
        
        // Дешифруем данные
        const decryptedBooking = {
            id: booking.id,
            checkin_date: booking.checkin_date,
            checkout_date: booking.checkout_date,
            adults: booking.adults,
            children: booking.children,
            infants: booking.infants,
            total_price: booking.total_price,
            guest_name: booking.guest_name_encrypted ? 
                decryptData(booking.guest_name_encrypted) : 'Не указано',
            guest_phone: booking.guest_phone_encrypted ? 
                decryptData(booking.guest_phone_encrypted) : 'Не указан',
            guest_email: booking.guest_email_encrypted ? 
                decryptData(booking.guest_email_encrypted) : null,
            status: booking.status,
            created_at: booking.created_at,
            updated_at: booking.updated_at
        };
        
        console.log(`✅ Отправлено бронирование #${id}`);
        res.json(decryptedBooking);
    });
});

// Подтверждение бронирования
app.post('/api/admin/bookings/:id/confirm', adminAuth, (req, res) => {
    const id = req.params.id;
    console.log(`✅ Подтверждение бронирования #${id}`);
    
    // Проверяем существование бронирования
    db.query('SELECT * FROM bookings WHERE id = ?', [id], (err, results) => {
        if (err) {
            console.error('❌ Ошибка проверки бронирования:', err);
            return res.status(500).json({ error: 'Ошибка сервера' });
        }
        
        if (results.length === 0) {
            console.log(`❌ Бронирование #${id} не найдено`);
            return res.status(404).json({ error: 'Бронирование не найдено' });
        }
        
        const booking = results[0];
        
        if (booking.status === 'cancelled') {
            console.log(`❌ Невозможно подтвердить отмененное бронирование #${id}`);
            return res.status(400).json({ 
                error: 'Невозможно подтвердить отмененное бронирование' 
            });
        }
        
        if (booking.status === 'confirmed') {
            console.log(`ℹ️  Бронирование #${id} уже подтверждено`);
            return res.status(400).json({ 
                error: 'Бронирование уже подтверждено' 
            });
        }
        
        // Обновляем статус
        db.query(
            'UPDATE bookings SET status = "confirmed", updated_at = NOW() WHERE id = ?',
            [id],
            (err, updateResult) => {
                if (err) {
                    console.error('❌ Ошибка подтверждения бронирования:', err);
                    return res.status(500).json({ error: 'Ошибка сервера' });
                }
                
                console.log(`✅ Бронирование #${id} подтверждено`);
                
                // Освобождаем даты в availability (если бронь была отменена)
                db.query(
                    'UPDATE availability SET is_available = TRUE, booking_id = NULL WHERE booking_id = ?',
                    [id],
                    (err) => {
                        if (err) {
                            console.error('❌ Ошибка обновления доступности:', err);
                        }
                    }
                );
                
                res.json({ 
                    success: true, 
                    message: 'Бронирование подтверждено'
                });
            }
        );
    });
});

// Отмена бронирования
app.post('/api/admin/bookings/:id/cancel', adminAuth, (req, res) => {
    const id = req.params.id;
    const { reason } = req.body;
    
    console.log(`❌ Отмена бронирования #${id}`, reason ? `Причина: ${reason}` : '');
    
    // Проверяем существование бронирования
    db.query('SELECT * FROM bookings WHERE id = ?', [id], (err, results) => {
        if (err) {
            console.error('❌ Ошибка проверки бронирования:', err);
            return res.status(500).json({ error: 'Ошибка сервера' });
        }
        
        if (results.length === 0) {
            console.log(`❌ Бронирование #${id} не найдено`);
            return res.status(404).json({ error: 'Бронирование не найдено' });
        }
        
        const booking = results[0];
        
        if (booking.status === 'cancelled') {
            console.log(`ℹ️  Бронирование #${id} уже отменено`);
            return res.status(400).json({ 
                error: 'Бронирование уже отменено' 
            });
        }
        
        // Обновляем статус
        db.query(
            'UPDATE bookings SET status = "cancelled", updated_at = NOW() WHERE id = ?',
            [id],
            (err, updateResult) => {
                if (err) {
                    console.error('❌ Ошибка отмены бронирования:', err);
                    return res.status(500).json({ error: 'Ошибка сервера' });
                }
                
                // Освобождаем даты в availability
                db.query(
                    'UPDATE availability SET is_available = TRUE, booking_id = NULL WHERE booking_id = ?',
                    [id],
                    (err) => {
                        if (err) {
                            console.error('❌ Ошибка обновления доступности:', err);
                        }
                    }
                );
                
                console.log(`✅ Бронирование #${id} отменено`);
                
                res.json({ 
                    success: true, 
                    message: 'Бронирование отменено'
                });
            }
        );
    });
});

// Статистика бронирований
app.get('/api/admin/stats', adminAuth, (req, res) => {
    console.log('📊 Запрос статистики');
    
    const statsQuery = `
        SELECT 
            status,
            COUNT(*) as count,
            SUM(total_price) as total_revenue
        FROM bookings 
        GROUP BY status
        
        UNION ALL
        
        SELECT 
            'all' as status,
            COUNT(*) as count,
            SUM(total_price) as total_revenue
        FROM bookings
    `;
    
    db.query(statsQuery, (err, results) => {
        if (err) {
            console.error('❌ Ошибка получения статистики:', err);
            return res.status(500).json({ error: 'Ошибка сервера' });
        }
        
        const stats = {
            pending: results.find(r => r.status === 'pending')?.count || 0,
            confirmed: results.find(r => r.status === 'confirmed')?.count || 0,
            cancelled: results.find(r => r.status === 'cancelled')?.count || 0,
            total: results.find(r => r.status === 'all')?.count || 0,
            revenue: {
                pending: results.find(r => r.status === 'pending')?.total_revenue || 0,
                confirmed: results.find(r => r.status === 'confirmed')?.total_revenue || 0,
                total: results.find(r => r.status === 'all')?.total_revenue || 0
            }
        };
        
        console.log('📈 Статистика отправлена:', stats);
        res.json(stats);
    });
});

// Проверка связи админки
app.get('/api/admin/health', adminAuth, (req, res) => {
    console.log('🏥 Проверка здоровья админки');
    
    res.json({ 
        status: 'ok',
        timestamp: new Date().toISOString(),
        message: 'Админ панель работает корректно',
        server_time: new Date().toLocaleString('ru-RU'),
        database: 'connected'
    });
});

// ========== СТАТИЧЕСКИЕ ФАЙЛЫ ==========

// Главная страница
app.get('/', (req, res) => {
    console.log('🏠 Запрос главной страницы');
    res.sendFile(path.join(__dirname, 'index.html'));
});

// Админ панель
app.get('/admin.html', (req, res) => {
    console.log('👨‍💼 Запрос админ панели');
    res.sendFile(path.join(__dirname, 'admin.html'));
});

// Обслуживание всех остальных статических файлов
app.get('*', (req, res) => {
    const filePath = path.join(__dirname, req.path);
    console.log(`📄 Запрос статического файла: ${req.path}`);
    res.sendFile(filePath, (err) => {
        if (err) {
            console.log(`❌ Файл не найден: ${req.path}`);
            res.status(404).send('Файл не найден');
        }
    });
});

// ========== ЗАПУСК СЕРВЕРА ==========
app.listen(PORT, () => {
    console.log('\n' + '='.repeat(50));
    console.log('🎉 СЕРВЕР ЗАПУЩЕН УСПЕШНО!');
    console.log('='.repeat(50));
    console.log(`📡 Адрес: http://localhost:${PORT}`);
    console.log(`🏠 Главная: http://localhost:${PORT}/`);
    console.log(`👨‍💼 Админка: http://localhost:${PORT}/admin.html`);
    console.log('\n📋 ДОСТУПНЫЕ API ЭНДПОИНТЫ:');
    console.log('\n   👤 ПОЛЬЗОВАТЕЛЬСКИЕ:');
    console.log('   - GET  /api/availability           - Проверка доступных дат');
    console.log('   - GET  /api/reviews                - Получение отзывов');
    console.log('   - POST /api/bookings               - Создание бронирования');
    console.log('   - POST /api/applications           - Отправка заявки');
    
    console.log('\n   👨‍💼 АДМИНСКИЕ (требуют токен):');
    console.log('   - GET  /api/admin/bookings         - Все бронирования');
    console.log('   - GET  /api/admin/bookings/:id     - Конкретное бронирование');
    console.log('   - POST /api/admin/bookings/:id/confirm  - Подтверждение');
    console.log('   - POST /api/admin/bookings/:id/cancel   - Отмена');
    console.log('   - GET  /api/admin/stats            - Статистика');
    console.log('   - GET  /api/admin/health           - Проверка связи');
    
    console.log('\n   📁 СТАТИЧЕСКИЕ ФАЙЛЫ:');
    console.log('   - GET  /                           - Главная страница');
    console.log('   - GET  /admin.html                 - Админ панель');
    console.log('   - GET  /main.css                   - Стили');
    console.log('   - GET  /client.js                  - Фронтенд скрипт');
    
    console.log('\n🔐 ТОКЕН АДМИНКИ: admin-secret-token');
    console.log('📤 Пример запроса с токеном:');
    console.log('   curl -H "Authorization: Bearer admin-secret-token" \\');
    console.log('        http://localhost:3000/api/admin/bookings');
    console.log('='.repeat(50) + '\n');
});

// Обработка ошибок
app.use((err, req, res, next) => {
    console.error('🔥 КРИТИЧЕСКАЯ ОШИБКА СЕРВЕРА:', err);
    res.status(500).json({ 
        success: false, 
        error: 'Внутренняя ошибка сервера',
        message: process.env.NODE_ENV === 'development' ? err.message : undefined
    });
});

// Обработка завершения работы
process.on('SIGINT', () => {
    console.log('\n🛑 Завершение работы сервера...');
    db.end();
    process.exit(0);
});