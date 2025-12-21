// node.js - полный код с интеграцией базы данных
document.addEventListener('DOMContentLoaded', () => {
    // ========== ГЛОБАЛЬНЫЕ ПЕРЕМЕННЫЕ ==========
    let adults = 2;
    let children = 0;
    let infants = 0;
    let checkinDate = null;
    let checkoutDate = null;
    let availableDates = [];
    let currentMonth = new Date();
    let selectedDate = null;
    let activeInput = null;

    // ========== ЭЛЕМЕНТЫ DOM ==========
    const guestsModal = document.getElementById('guestsModal');
    const calendarModal = document.getElementById('calendarModal');
    const guestsInput = document.getElementById('guests');
    const checkinInput = document.getElementById('checkin');
    const checkoutInput = document.getElementById('checkout');
    const guestPhoneInput = document.getElementById('phone');
    const bookingForm = document.querySelector('.booking-form');

    // ========== ИНИЦИАЛИЗАЦИЯ МОДАЛЬНЫХ ОКОН ==========
    if (guestsModal) guestsModal.style.display = 'none';
    if (calendarModal) calendarModal.style.display = 'none';

    // ========== СЛАЙДЕР ОТЗЫВОВ ==========
    const reviewsContainer = document.querySelector('.reviews-container');
    const prevButton = document.querySelector('.slider-arrow-prev');
    const nextButton = document.querySelector('.slider-arrow-next');
    
    if (reviewsContainer && prevButton && nextButton) {
        const reviewWidth = document.querySelector('.review').offsetWidth + 40;
        
        nextButton.addEventListener('click', function() {
            reviewsContainer.scrollBy({
                left: reviewWidth,
                behavior: 'smooth'
            });
        });
        
        prevButton.addEventListener('click', function() {
            reviewsContainer.scrollBy({
                left: -reviewWidth,
                behavior: 'smooth'
            });
        });
    }

    // ========== МОДАЛЬНОЕ ОКНО: ГОСТИ ==========
    const guestsTrigger = document.querySelector('.guests-input');
    if (guestsTrigger && guestsModal) {
        guestsTrigger.addEventListener('click', (e) => {
            e.stopPropagation();
            document.querySelector('.counter-value[data-type="adults"]').textContent = adults;
            document.querySelector('.counter-value[data-type="children"]').textContent = children;
            document.querySelector('.counter-value[data-type="infants"]').textContent = infants;
            updateGuestsTotal();
            guestsModal.style.display = 'flex';
        });

        const guestsCancel = guestsModal.querySelector('.guests-cancel');
        if (guestsCancel) {
            guestsCancel.addEventListener('click', () => {
                guestsModal.style.display = 'none';
            });
        }

        guestsModal.addEventListener('click', (e) => {
            if (e.target === guestsModal) {
                guestsModal.style.display = 'none';
            }
        });

        const guestsConfirm = guestsModal.querySelector('.guests-confirm');
        if (guestsConfirm) {
            guestsConfirm.addEventListener('click', () => {
                adults = parseInt(document.querySelector('.counter-value[data-type="adults"]').textContent) || 2;
                children = parseInt(document.querySelector('.counter-value[data-type="children"]').textContent) || 0;
                infants = parseInt(document.querySelector('.counter-value[data-type="infants"]').textContent) || 0;
                updateGuestsInput();
                guestsModal.style.display = 'none';
                updateCost();
            });
        }

        document.querySelectorAll('.counter-btn.minus').forEach(btn => {
            btn.addEventListener('click', () => {
                const type = btn.dataset.type;
                const valueEl = document.querySelector(`.counter-value[data-type="${type}"]`);
                let value = parseInt(valueEl.textContent);
                const min = type === 'adults' ? 1 : 0;
                if (value > min) {
                    valueEl.textContent = value - 1;
                    updateGuestsTotal();
                }
            });
        });

        document.querySelectorAll('.counter-btn.plus').forEach(btn => {
            btn.addEventListener('click', () => {
                const type = btn.dataset.type;
                const valueEl = document.querySelector(`.counter-value[data-type="${type}"]`);
                let value = parseInt(valueEl.textContent);
                const max = type === 'adults' ? 6 : type === 'children' ? 4 : 2;
                if (value < max) {
                    valueEl.textContent = value + 1;
                    updateGuestsTotal();
                }
            });
        });
    }

    // ========== КАЛЕНДАРЬ ==========
    const calendarDays = document.querySelector('.calendar-days');
    const calendarMonthYear = document.querySelector('.calendar-month-year');
    const calendarPrev = document.querySelector('.calendar-prev');
    const calendarNext = document.querySelector('.calendar-next');
    const calendarConfirm = document.querySelector('.calendar-confirm');
    const calendarCancel = document.querySelector('.calendar-cancel');
    const selectedDateText = document.getElementById('selectedDateText');

    const calendarTriggers = document.querySelectorAll('.date-input');
    if (calendarTriggers.length > 0 && calendarModal) {
        calendarTriggers.forEach(trigger => {
            trigger.addEventListener('click', (e) => {
                e.stopPropagation();
                const targetId = trigger.getAttribute('data-target');
                activeInput = document.getElementById(targetId);
                
                if (!activeInput) return;
                
                if (activeInput.value) {
                    try {
                        const parts = activeInput.value.split(' ');
                        if (parts.length >= 2) {
                            const day = parseInt(parts[0]);
                            const monthNames = {
                                'января': 0, 'февраля': 1, 'марта': 2, 'апреля': 3, 'мая': 4, 'июня': 5,
                                'июля': 6, 'августа': 7, 'сентября': 8, 'октября': 9, 'ноября': 10, 'декабря': 11
                            };
                            const monthName = parts[1].replace(',', '');
                            if (monthNames[monthName] !== undefined) {
                                const year = new Date().getFullYear();
                                selectedDate = new Date(year, monthNames[monthName], day);
                                currentMonth = new Date(selectedDate);
                            }
                        }
                    } catch (e) {
                        console.error('Error parsing date:', e);
                        selectedDate = null;
                        currentMonth = new Date();
                    }
                } else {
                    selectedDate = null;
                    currentMonth = new Date();
                }
                
                renderCalendar();
                calendarModal.style.display = 'flex';
            });
        });

        if (calendarCancel) {
            calendarCancel.addEventListener('click', () => {
                calendarModal.style.display = 'none';
            });
        }

        calendarModal.addEventListener('click', (e) => {
            if (e.target === calendarModal) {
                calendarModal.style.display = 'none';
            }
        });

        if (calendarPrev) {
            calendarPrev.addEventListener('click', () => {
                currentMonth.setMonth(currentMonth.getMonth() - 1);
                renderCalendar();
            });
        }

        if (calendarNext) {
            calendarNext.addEventListener('click', () => {
                currentMonth.setMonth(currentMonth.getMonth() + 1);
                renderCalendar();
            });
        }

        if (calendarConfirm) {
            calendarConfirm.addEventListener('click', () => {
                if (selectedDate && activeInput) {
                    const formatted = formatCalendarDate(selectedDate);
                    activeInput.value = formatted;
                    if (activeInput.id === 'checkin') {
                        checkinDate = new Date(selectedDate);
                    } else if (activeInput.id === 'checkout') {
                        checkoutDate = new Date(selectedDate);
                    }
                    updateCost();
                }
                calendarModal.style.display = 'none';
            });
        }
    }

    function renderCalendar() {
        if (!calendarDays || !calendarMonthYear) return;

        const year = currentMonth.getFullYear();
        const month = currentMonth.getMonth();
        
        const monthNames = [
            'Январь', 'Февраль', 'Март', 'Апрель', 'Май', 'Июнь',
            'Июль', 'Август', 'Сентябрь', 'Октябрь', 'Ноябрь', 'Декабрь'
        ];
        calendarMonthYear.textContent = `${monthNames[month]} ${year}`;
        
        calendarDays.innerHTML = '';

        const firstDay = new Date(year, month, 1);
        const lastDay = new Date(year, month + 1, 0);
        
        let firstDayIndex = firstDay.getDay();
        if (firstDayIndex === 0) firstDayIndex = 7;
        const startDay = firstDayIndex - 1;

        const prevMonthLastDay = new Date(year, month, 0).getDate();
        
        for (let i = startDay; i > 0; i--) {
            const dayEl = document.createElement('div');
            dayEl.className = 'disabled-day other-month';
            dayEl.textContent = prevMonthLastDay - i + 1;
            calendarDays.appendChild(dayEl);
        }

        const today = new Date();
        today.setHours(0, 0, 0, 0);
        
        for (let day = 1; day <= lastDay.getDate(); day++) {
            const date = new Date(year, month, day);
            date.setHours(0, 0, 0, 0);
            
            const dayEl = document.createElement('div');
            dayEl.textContent = day;

            if (date.getTime() === today.getTime()) {
                dayEl.classList.add('current-day');
            }

            if (selectedDate && date.getTime() === selectedDate.getTime()) {
                dayEl.classList.add('selected-day');
            }

            if (date < today) {
                dayEl.classList.add('disabled-day');
            } else {
                dayEl.addEventListener('click', () => {
                    selectedDate = new Date(date);
                    renderCalendar();
                    if (selectedDateText) {
                        selectedDateText.textContent = formatCalendarDate(selectedDate);
                    }
                    if (calendarConfirm) {
                        calendarConfirm.disabled = false;
                    }
                });
            }

            calendarDays.appendChild(dayEl);
        }

        if (selectedDateText) {
            selectedDateText.textContent = selectedDate ? formatCalendarDate(selectedDate) : '--';
        }
        if (calendarConfirm) {
            calendarConfirm.disabled = !selectedDate;
        }
    }

    function formatCalendarDate(date) {
        const days = ['вс', 'пн', 'вт', 'ср', 'чт', 'пт', 'сб'];
        const months = [
            'января', 'февраля', 'марта', 'апреля', 'мая', 'июня',
            'июля', 'августа', 'сентября', 'октября', 'ноября', 'декабря'
        ];
        
        const day = date.getDate();
        const month = months[date.getMonth()];
        const dayOfWeek = days[date.getDay()];
        
        return `${day} ${month}, ${dayOfWeek}`;
    }

    // ========== ВИДЕО ПЛЕЕР ==========
    document.querySelectorAll('.video-item').forEach((item, index) => {
        item.addEventListener('click', () => {
            const videoModal = document.createElement('div');
            videoModal.className = 'video-modal';
            videoModal.style.cssText = `
                position: fixed;
                top: 0;
                left: 0;
                width: 100%;
                height: 100%;
                background: rgba(0,0,0,0.95);
                display: flex;
                justify-content: center;
                align-items: center;
                z-index: 10000;
            `;

            const videoSrc = [
                'https://rutube.ru/video/7d11eb12ae1d2fcd5377c2d85d70df0e/?r=wd',
                'https://rutube.ru/video/7d11eb12ae1d2fcd5377c2d85d70df0e/?r=wd'
            ][index] || '';

            videoModal.innerHTML = `
                <div style="position:relative; width:90%; max-width:900px; aspect-ratio:16/9;">
                    <iframe width="100%" height="100%" src="${videoSrc}" frameborder="0" allow="autoplay; encrypted-media" allowfullscreen></iframe>
                    <button class="close-video" style="
                        position: absolute;
                        top: -50px;
                        right: 0;
                        background: white;
                        border: none;
                        width: 40px;
                        height: 40px;
                        border-radius: 50%;
                        font-size: 20px;
                        font-weight: bold;
                        cursor: pointer;
                        color: #333;
                        display: flex;
                        align-items: center;
                        justify-content: center;
                    ">×</button>
                </div>
            `;

            document.body.appendChild(videoModal);

            videoModal.querySelector('.close-video').addEventListener('click', () => {
                document.body.removeChild(videoModal);
            });

            videoModal.addEventListener('click', (e) => {
                if (e.target === videoModal) {
                    document.body.removeChild(videoModal);
                }
            });
        });
    });

    // ========== БАЗА ДАННЫХ: API ФУНКЦИИ ==========
    async function loadAvailableDates() {
        try {
            const response = await fetch('/api/availability');
            if (response.ok) {
                availableDates = await response.json();
                console.log('Доступные даты загружены:', availableDates);
            }
        } catch (error) {
            console.error('Ошибка загрузки доступных дат:', error);
        }
    }

    async function loadReviews() {
        try {
            const response = await fetch('/api/reviews');
            if (response.ok) {
                const reviews = await response.json();
                renderReviews(reviews);
            }
        } catch (error) {
            console.error('Ошибка загрузки отзывов:', error);
        }
    }

    function renderReviews(reviews) {
        const container = document.querySelector('.reviews-container');
        if (!container || !reviews.length) return;

        container.innerHTML = reviews.map(review => `
            <div class="review">
                <div class="review-header">
                    <img src="${review.avatar_url || 'photos/default-avatar.jpg'}" alt="${review.guest_name}" class="review-avatar">
                    <h3 class="review-name">${review.guest_name}</h3>
                </div>
                <p class="review-text">${review.review_text}</p>
                ${review.rating ? `<div class="review-rating">Рейтинг: ${'★'.repeat(review.rating)}${'☆'.repeat(5-review.rating)}</div>` : ''}
                ${review.review_images ? `
                    <div class="review-images">
                        ${review.review_images.split(',').map(img => `<img src="${img.trim()}" alt="Фото отзыва">`).join('')}
                    </div>
                ` : ''}
            </div>
        `).join('');
    }

    async function submitBooking(bookingData) {
        try {
            const response = await fetch('/api/bookings', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(bookingData)
            });

            const result = await response.json();
            
            if (response.ok) {
                showNotification('Бронирование успешно создано! Мы свяжемся с вами для подтверждения.', 'success');
                return true;
            } else {
                showNotification(result.error || 'Ошибка при бронировании', 'error');
                return false;
            }
        } catch (error) {
            console.error('Ошибка:', error);
            showNotification('Ошибка соединения с сервером', 'error');
            return false;
        }
    }

    async function submitApplication(formData) {
        try {
            const response = await fetch('/api/applications', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(formData)
            });

            const result = await response.json();
            
            if (response.ok) {
                showNotification('Заявка отправлена! Мы свяжемся с вами в ближайшее время.', 'success');
                return true;
            } else {
                showNotification(result.error || 'Ошибка при отправке заявки', 'error');
                return false;
            }
        } catch (error) {
            console.error('Ошибка:', error);
            showNotification('Ошибка соединения с сервером', 'error');
            return false;
        }
    }

    // ========== УВЕДОМЛЕНИЯ ==========
    function showNotification(message, type = 'info') {
        const notification = document.createElement('div');
        notification.className = `notification ${type}`;
        notification.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            padding: 15px 20px;
            background: ${type === 'success' ? '#4CAF50' : type === 'error' ? '#f44336' : '#2196F3'};
            color: white;
            border-radius: 5px;
            z-index: 10001;
            max-width: 300px;
            box-shadow: 0 4px 6px rgba(0,0,0,0.1);
        `;
        notification.textContent = message;
        
        document.body.appendChild(notification);
        
        setTimeout(() => {
            if (notification.parentNode) {
                document.body.removeChild(notification);
            }
        }, 5000);
    }

    // ========== ВСПОМОГАТЕЛЬНЫЕ ФУНКЦИИ ==========
    function updateGuestsTotal() {
        const totalGuestsEl = document.getElementById('totalGuests');
        if (totalGuestsEl) {
            const a = parseInt(document.querySelector('.counter-value[data-type="adults"]')?.textContent || '2');
            const c = parseInt(document.querySelector('.counter-value[data-type="children"]')?.textContent || '0');
            const i = parseInt(document.querySelector('.counter-value[data-type="infants"]')?.textContent || '0');
            totalGuestsEl.textContent = a + c;
        }
    }

    function updateGuestsInput() {
        if (!guestsInput) return;
        
        let parts = [];
        if (adults > 0) {
            parts.push(`${adults} взросл${getRussianEnding(adults, 'ый', 'ых', 'ых')}`);
        }
        if (children > 0) {
            parts.push(`${children} ${getRussianEnding(children, 'ребенок', 'ребенка', 'детей')}`);
        }
        if (infants > 0) {
            parts.push(`${infants} ${getRussianEnding(infants, 'младенец', 'младенца', 'младенцев')}`);
        }
        
        guestsInput.value = parts.length ? parts.join(', ') : 'Выберите гостей';
    }

    function getRussianEnding(number, one, two, five) {
        number = Math.abs(number);
        number %= 100;
        
        if (number >= 5 && number <= 20) {
            return five;
        }
        
        number %= 10;
        
        if (number === 1) {
            return one;
        }
        
        if (number >= 2 && number <= 4) {
            return two;
        }
        
        return five;
    }

    function updateCost() {
        const costDetail = document.querySelector('.cost-detail');
        const costTotal = document.querySelector('.cost-total');
        
        if (!costDetail || !costTotal) return;

        const basePrice = 6000;
        const nights = calculateNights();
        const extraGuests = Math.max(0, (adults + children) - 2);
        const extraPrice = extraGuests * 1000 * nights;
        const total = basePrice * nights + extraPrice;

        costDetail.textContent = `${basePrice} x ${nights} ночи${nights > 1 ? '' : 'ь'}${extraGuests > 0 ? ` + ${extraGuests} доп. гостей` : ''}`;
        costTotal.textContent = `${total}₽`;
    }

    function calculateNights() {
        if (!checkinDate || !checkoutDate) return 2;
        const diffTime = Math.abs(checkoutDate - checkinDate);
        return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    }

    function formatDateForDB(date) {
        return date.toISOString().split('T')[0];
    }

    // ========== ОБРАБОТКА ФОРМ ==========
    // Обработка формы бронирования
if (bookingForm) {
    bookingForm.addEventListener('submit', async function(e) {
        e.preventDefault();
        
        console.log('🔍 Начинаем обработку формы бронирования...');
        
        // Валидация дат
        if (!checkinDate || !checkoutDate) {
            showNotification('Пожалуйста, выберите даты заезда и выезда', 'error');
            console.log('❌ Ошибка: не выбраны даты');
            return;
        }

        // Получаем элементы формы
        const guestNameInput = document.getElementById('guestName');
        const guestEmailInput = document.getElementById('guestEmail');
        const guestPhoneInput = document.getElementById('phone');
        
        console.log('📋 Данные из формы:');
        console.log('- Имя:', guestNameInput?.value);
        console.log('- Email:', guestEmailInput?.value);
        console.log('- Телефон:', guestPhoneInput?.value);

        // Валидация полей
        if (!guestNameInput || !guestNameInput.value.trim()) {
            showNotification('Пожалуйста, введите ваше ФИО', 'error');
            guestNameInput?.focus();
            console.log('❌ Ошибка: не указано имя');
            return;
        }

        if (!guestEmailInput || !guestEmailInput.value.trim()) {
            showNotification('Пожалуйста, введите ваш email', 'error');
            guestEmailInput?.focus();
            console.log('❌ Ошибка: не указан email');
            return;
        }

        if (!guestPhoneInput || !guestPhoneInput.value.trim()) {
            showNotification('Пожалуйста, введите номер телефона', 'error');
            guestPhoneInput?.focus();
            console.log('❌ Ошибка: не указан телефон');
            return;
        }

        // Простая валидация email
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(guestEmailInput.value.trim())) {
            showNotification('Пожалуйста, введите корректный email', 'error');
            guestEmailInput.focus();
            console.log('❌ Ошибка: неверный формат email');
            return;
        }

        // Валидация телефона
        const phoneClean = guestPhoneInput.value.replace(/\D/g, '');
        if (phoneClean.length < 10) {
            showNotification('Пожалуйста, введите корректный номер телефона', 'error');
            guestPhoneInput.focus();
            console.log('❌ Ошибка: неверный формат телефона');
            return;
        }

        // Подготовка данных для отправки
        const bookingData = {
            checkin_date: formatDateForDB(checkinDate),
            checkout_date: formatDateForDB(checkoutDate),
            adults: adults,
            children: children,
            infants: infants,
            total_price: calculateTotalPrice(),
            guest_name: guestNameInput.value.trim(),
            guest_phone: guestPhoneInput.value.trim(),
            guest_email: guestEmailInput.value.trim(),
            created_at: new Date().toISOString()
        };

        console.log('🚀 Отправляемые данные на сервер:');
        console.log(JSON.stringify(bookingData, null, 2));

        // Показываем индикатор загрузки
        const submitButton = this.querySelector('.btn-book');
        const originalText = submitButton.textContent;
        submitButton.textContent = 'Отправка...';
        submitButton.disabled = true;

        try {
            const success = await submitBooking(bookingData);
            
            if (success) {
                // Сброс формы
                bookingForm.reset();
                adults = 2;
                children = 0;
                infants = 0;
                updateGuestsInput();
                updateCost();
                checkinDate = null;
                checkoutDate = null;
                checkinInput.value = '';
                checkoutInput.value = '';
                
                console.log('✅ Бронирование успешно отправлено');
            }
        } catch (error) {
            console.error('❌ Ошибка при отправке:', error);
        } finally {
            // Восстанавливаем кнопку
            submitButton.textContent = originalText;
            submitButton.disabled = false;
        }
    });
}

// Функция расчета стоимости
function calculateTotalPrice() {
    const basePrice = 6000;
    const nights = calculateNights();
    const extraGuests = Math.max(0, (adults + children) - 2);
    const extraPrice = extraGuests * 1000 * nights;
    const total = basePrice * nights + extraPrice;
    
    console.log('💰 Расчет стоимости:');
    console.log('- Базовая цена:', basePrice);
    console.log('- Ночей:', nights);
    console.log('- Доп. гости:', extraGuests);
    console.log('- Общая сумма:', total);
    
    return total;
}

// Функция отправки бронирования
async function submitBooking(bookingData) {
    try {
        console.log('📤 Отправка запроса на /api/bookings...');
        
        const response = await fetch('/api/bookings', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(bookingData)
        });

        console.log('📥 Получен ответ от сервера:', response.status);
        
        const result = await response.json();
        console.log('📄 Тело ответа:', result);

        if (response.ok) {
            showNotification('Бронирование успешно создано! Мы свяжемся с вами для подтверждения.', 'success');
            return true;
        } else {
            const errorMsg = result.error || result.message || 'Ошибка при бронировании';
            console.error('❌ Ошибка от сервера:', errorMsg);
            showNotification(errorMsg, 'error');
            return false;
        }
    } catch (error) {
        console.error('❌ Ошибка сети:', error);
        showNotification('Ошибка соединения с сервером. Пожалуйста, попробуйте позже.', 'error');
        return false;
    }
}

    // ========== ПЛАВНАЯ ПРОКРУТКА ДЛЯ НАВИГАЦИИ ==========
    document.querySelectorAll('a[href^="#"]').forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            const targetId = this.getAttribute('href');
            if (targetId === '#') return;
            
            const targetElement = document.querySelector(targetId);
            if (targetElement) {
                window.scrollTo({
                    top: targetElement.offsetTop - 100,
                    behavior: 'smooth'
                });
            }
        });
    });

    // ========== ИНИЦИАЛИЗАЦИЯ ==========
    function init() {
        updateGuestsInput();
        updateCost();
        renderCalendar();
        
        // Загрузка данных с сервера
        loadAvailableDates();
        loadReviews();
        
        console.log('Система бронирования глэмпинга инициализирована');
    }

    // Запуск инициализации
    init();
});