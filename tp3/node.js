document.addEventListener('DOMContentLoaded', () => {
    // ========== ГЛОБАЛЬНЫЕ ПЕРЕМЕННЫЕ ==========
    let adults = 2;
    let children = 0;
    let infants = 0;
    let checkinDate = null;
    let checkoutDate = null;

    // ========== ЭЛЕМЕНТЫ DOM ==========
    const guestsModal = document.getElementById('guestsModal');
    const calendarModal = document.getElementById('calendarModal');
    const guestsInput = document.getElementById('guests');
    const checkinInput = document.getElementById('checkin');
    const checkoutInput = document.getElementById('checkout');

    // ========== ИНИЦИАЛИЗАЦИЯ МОДАЛЬНЫХ ОКОН ==========
    // Скрываем модальные окна при загрузке
    if (guestsModal) guestsModal.style.display = 'none';
    if (calendarModal) calendarModal.style.display = 'none';

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
    // Исправленный триггер для гостей
    const guestsTrigger = document.querySelector('.guests-input');
    if (guestsTrigger && guestsModal) {
        guestsTrigger.addEventListener('click', (e) => {
            e.stopPropagation();
            // Восстанавливаем текущие значения
            document.querySelector('.counter-value[data-type="adults"]').textContent = adults;
            document.querySelector('.counter-value[data-type="children"]').textContent = children;
            document.querySelector('.counter-value[data-type="infants"]').textContent = infants;
            updateGuestsTotal();
            guestsModal.style.display = 'flex';
        });

        // Закрытие по "Отмена"
        const guestsCancel = guestsModal.querySelector('.guests-cancel');
        if (guestsCancel) {
            guestsCancel.addEventListener('click', () => {
                guestsModal.style.display = 'none';
            });
        }

        // Закрытие по клику вне контента
        guestsModal.addEventListener('click', (e) => {
            if (e.target === guestsModal) {
                guestsModal.style.display = 'none';
            }
        });

        // Подтверждение выбора
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

        // Кнопки +/- для гостей
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
    let currentMonth = new Date();
    let selectedDate = null;
    let activeInput = null;

    const calendarDays = document.querySelector('.calendar-days');
    const calendarMonthYear = document.querySelector('.calendar-month-year');
    const calendarPrev = document.querySelector('.calendar-prev');
    const calendarNext = document.querySelector('.calendar-next');
    const calendarConfirm = document.querySelector('.calendar-confirm');
    const calendarCancel = document.querySelector('.calendar-cancel');
    const selectedDateText = document.getElementById('selectedDateText');

    // Исправленные триггеры для календаря
    const calendarTriggers = document.querySelectorAll('.date-input');
    if (calendarTriggers.length > 0 && calendarModal) {
        calendarTriggers.forEach(trigger => {
            trigger.addEventListener('click', (e) => {
                e.stopPropagation();
                const targetId = trigger.getAttribute('data-target');
                activeInput = document.getElementById(targetId);
                
                if (!activeInput) return;
                
                // Пытаемся распарсить существующую дату
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
        
        // Обновляем заголовок
        const monthNames = [
            'Январь', 'Февраль', 'Март', 'Апрель', 'Май', 'Июнь',
            'Июль', 'Август', 'Сентябрь', 'Октябрь', 'Ноябрь', 'Декабрь'
        ];
        calendarMonthYear.textContent = `${monthNames[month]} ${year}`;
        
        // Очищаем дни
        calendarDays.innerHTML = '';

        const firstDay = new Date(year, month, 1);
        const lastDay = new Date(year, month + 1, 0);
        
        // День недели первого дня (0 - воскресенье)
        let firstDayIndex = firstDay.getDay();
        // Корректируем для отображения с понедельника
        if (firstDayIndex === 0) firstDayIndex = 7;
        const startDay = firstDayIndex - 1;

        // Предыдущий месяц
        const prevMonthLastDay = new Date(year, month, 0).getDate();
        
        // Добавляем дни предыдущего месяца
        for (let i = startDay; i > 0; i--) {
            const dayEl = document.createElement('div');
            dayEl.className = 'disabled-day other-month';
            dayEl.textContent = prevMonthLastDay - i + 1;
            calendarDays.appendChild(dayEl);
        }

        const today = new Date();
        today.setHours(0, 0, 0, 0); // Сбрасываем время для сравнения
        
        // Добавляем дни текущего месяца
        for (let day = 1; day <= lastDay.getDate(); day++) {
            const date = new Date(year, month, day);
            date.setHours(0, 0, 0, 0);
            
            const dayEl = document.createElement('div');
            dayEl.textContent = day;

            // Проверяем, является ли день сегодняшним
            if (date.getTime() === today.getTime()) {
                dayEl.classList.add('current-day');
            }

            // Проверяем, выбран ли день
            if (selectedDate && date.getTime() === selectedDate.getTime()) {
                dayEl.classList.add('selected-day');
            }

            // Проверяем, прошедшая ли дата
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

        // Обновляем отображение выбранной даты и состояние кнопки
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

    // ========== ВИДЕО ==========
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

            // Замените на реальные ссылки на видео
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

        // Базовая цена за 2 ночи
        const basePrice = 6000;
        const nights = 2;
        
        // Доплата за дополнительных гостей
        const extraGuests = Math.max(0, (adults + children) - 2);
        const extraPrice = extraGuests * 1000 * nights;
        const total = basePrice * nights + extraPrice;

        costDetail.textContent = `${basePrice} x ${nights} ночи${extraGuests > 0 ? ` + ${extraGuests} доп. гостей` : ''}`;
        costTotal.textContent = `${total}₽`;
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

    // ========== ОБРАБОТКА ФОРМЫ БРОНИРОВАНИЯ ==========
    const bookingForm = document.querySelector('.booking-form');
    if (bookingForm) {
        bookingForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            // Простая валидация телефона
            const phoneInput = document.getElementById('phone');
            if (phoneInput && phoneInput.value.length < 10) {
                alert('Пожалуйста, введите корректный номер телефона');
                return;
            }
            
            alert('Заявка отправлена! Мы свяжемся с вами в ближайшее время.');
            bookingForm.reset();
            
            // Сброс данных
            adults = 2;
            children = 0;
            infants = 0;
            updateGuestsInput();
            updateCost();
        });
    }

    // ========== ИНИЦИАЛИЗАЦИЯ ==========
    updateGuestsInput();
    updateCost();
    renderCalendar(); // Инициализируем календарь при загрузке
});