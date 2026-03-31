// Initialize Telegram Web App
const tg = window.Telegram.WebApp;

// Configure Telegram Web App
tg.ready();
tg.expand();

// DOM elements
const mainContent = document.getElementById('main-content');
const welcomeScreen = document.getElementById('welcome-screen');
const phoneScreen = document.getElementById('phone-screen');
const templateScreen = document.getElementById('template-screen');
const phoneForm = document.getElementById('phone-form');
const phoneInput = document.getElementById('phone-input');
const backToWelcomeBtn = document.getElementById('back-to-welcome');
const backToCategoriesBtn = document.getElementById('back-to-categories');
const templateTitle = document.getElementById('template-title');
const templateDescription = document.getElementById('template-description');
const templateContainer = document.getElementById('template-container');

// State
let selectedCategory = null;
let userPhone = null;

// Business categories configuration
const categories = {
    restaurant: {
        name: 'Ресторанный бизнес',
        description: 'Шаблон для ресторанов, кафе и доставки еды',
        icon: '🍽️'
    },
    retail: {
        name: 'Розничная торговля',
        description: 'Шаблон для магазинов и онлайн-продаж',
        icon: '🛍️'
    },
    services: {
        name: 'Услуги',
        description: 'Шаблон для сервисных компаний и бронирования',
        icon: '🔧'
    },
    education: {
        name: 'Образование',
        description: 'Шаблон для образовательных платформ и курсов',
        icon: '🎓'
    },
    healthcare: {
        name: 'Медицина',
        description: 'Шаблон для клиник и медицинских услуг',
        icon: '🏥'
    },
    finance: {
        name: 'Финансы',
        description: 'Шаблон для финансовых сервисов и банков',
        icon: '💰'
    }
};

// Event Listeners
document.addEventListener('DOMContentLoaded', function() {
    // Category selection
    document.querySelectorAll('.category-btn').forEach(btn => {
        btn.addEventListener('click', (e) => {
            selectedCategory = e.target.dataset.category;
            showPhoneScreen();
        });
    });

    // Phone form submission
    phoneForm.addEventListener('submit', handlePhoneSubmit);

    // Navigation buttons
    backToWelcomeBtn.addEventListener('click', showWelcomeScreen);
    backToCategoriesBtn.addEventListener('click', showWelcomeScreen);

    // Initialize from URL parameters (if template was opened directly)
    const urlParams = new URLSearchParams(window.location.search);
    const categoryFromUrl = urlParams.get('category');
    if (categoryFromUrl && categories[categoryFromUrl]) {
        selectedCategory = categoryFromUrl;
        showTemplateScreen();
    }
});

// Screen management functions
function showWelcomeScreen() {
    hideAllScreens();
    welcomeScreen.classList.add('active');
    selectedCategory = null;
    userPhone = null;
}

function showPhoneScreen() {
    hideAllScreens();
    phoneScreen.classList.add('active');
}

function showTemplateScreen() {
    hideAllScreens();
    templateScreen.classList.add('active');
    
    if (selectedCategory && categories[selectedCategory]) {
        const category = categories[selectedCategory];
        templateTitle.textContent = `${category.icon} ${category.name}`;
        templateDescription.textContent = category.description;
        
        loadTemplateContent(selectedCategory);
    }
}

function hideAllScreens() {
    document.querySelectorAll('.screen').forEach(screen => {
        screen.classList.remove('active');
    });
}

// Phone handling
function handlePhoneSubmit(e) {
    e.preventDefault();
    
    const phone = phoneInput.value.trim();
    if (!phone) {
        alert('Пожалуйста, введите номер телефона');
        return;
    }

    userPhone = phone;
    
    // Save contact information (in a real app, send to server)
    saveContactInfo(selectedCategory, phone);
    
    // Show success message
    const successMsg = document.createElement('div');
    successMsg.className = 'success-message';
    successMsg.innerHTML = `
        <strong>Спасибо!</strong><br>
        Мы получили ваш номер: <strong>${phone}</strong><br>
        Наши специалисты свяжутся с вами в ближайшее время.
    `;
    
    phoneForm.parentNode.insertBefore(successMsg, phoneForm.nextSibling);
    phoneForm.style.display = 'none';
    
    // Auto-show template after 2 seconds
    setTimeout(() => {
        showTemplateScreen();
    }, 2000);
}

// Contact saving (mock implementation)
function saveContactInfo(category, phone) {
    // In a real implementation, this would send data to your server
    console.log('Contact saved:', {
        category: category,
        phone: phone,
        timestamp: new Date().toISOString(),
        userAgent: navigator.userAgent
    });
    
    // Mock API call
    fetch('/api/contacts', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            category: category,
            phone: phone,
            timestamp: new Date().toISOString()
        })
    }).catch(err => {
        console.warn('Failed to save contact:', err);
        // Fallback: store in localStorage
        const contacts = JSON.parse(localStorage.getItem('contacts') || '[]');
        contacts.push({
            category: category,
            phone: phone,
            timestamp: new Date().toISOString()
        });
        localStorage.setItem('contacts', JSON.stringify(contacts));
    });
}

// Template loading
function loadTemplateContent(category) {
    templateContainer.innerHTML = '';
    
    const loading = document.createElement('div');
    loading.className = 'loading';
    loading.textContent = 'Загрузка шаблона...';
    templateContainer.appendChild(loading);

    // Simulate loading delay
    setTimeout(() => {
        loading.remove();
        
        switch(category) {
            case 'restaurant':
                renderRestaurantTemplate();
                break;
            case 'retail':
                renderRetailTemplate();
                break;
            case 'services':
                renderServicesTemplate();
                break;
            case 'education':
                renderEducationTemplate();
                break;
            case 'healthcare':
                renderHealthcareTemplate();
                break;
            case 'finance':
                renderFinanceTemplate();
                break;
            default:
                templateContainer.innerHTML = '<p>Шаблон не найден</p>';
        }
    }, 1000);
}

// Template renderers
function renderRestaurantTemplate() {
    templateContainer.innerHTML = `
        <div class="template-content">
            <div class="menu-grid">
                <div class="menu-item">
                    <h4>Пицца Маргарита</h4>
                    <p>Классическая итальянская пицца с моцареллой</p>
                    <div style="display: flex; justify-content: space-between; align-items: center; margin-top: 10px;">
                        <span style="color: var(--primary-color); font-weight: bold;">350 ₽</span>
                        <button class="add-to-cart-btn">Добавить</button>
                    </div>
                </div>
                <div class="menu-item">
                    <h4>Паста Карбонара</h4>
                    <p>Традиционная паста с беконом и сливочным соусом</p>
                    <div style="display: flex; justify-content: space-between; align-items: center; margin-top: 10px;">
                        <span style="color: var(--primary-color); font-weight: bold;">420 ₽</span>
                        <button class="add-to-cart-btn">Добавить</button>
                    </div>
                </div>
                <div class="menu-item">
                    <h4>Салат Цезарь</h4>
                    <p>Свежий салат с курицей и пармезаном</p>
                    <div style="display: flex; justify-content: space-between; align-items: center; margin-top: 10px;">
                        <span style="color: var(--primary-color); font-weight: bold;">280 ₽</span>
                        <button class="add-to-cart-btn">Добавить</button>
                    </div>
                </div>
            </div>
            
            <div style="background: #f8f9fa; padding: 20px; border-radius: 8px; margin-top: 20px;">
                <h3>Корзина</h3>
                <div id="cart-items">
                    <p>Корзина пуста</p>
                </div>
                <div style="display: flex; justify-content: space-between; align-items: center; margin-top: 20px;">
                    <span style="font-weight: bold;">Итого: 0 ₽</span>
                    <button style="background: var(--primary-color); color: white; border: none; padding: 10px 20px; border-radius: 8px; cursor: pointer;">Оформить заказ</button>
                </div>
            </div>
        </div>
    `;
    
    // Add interactivity to buttons
    templateContainer.querySelectorAll('.add-to-cart-btn').forEach(btn => {
        btn.addEventListener('click', function() {
            const item = this.closest('.menu-item');
            const name = item.querySelector('h4').textContent;
            const price = item.querySelector('span').textContent;
            
            addToCart(name, price);
        });
    });
}

function renderRetailTemplate() {
    templateContainer.innerHTML = `
        <div class="template-content">
            <div class="product-grid">
                <div class="product-card">
                    <div class="product-image">📱</div>
                    <div class="product-info">
                        <h4 class="product-title">Смартфон XYZ</h4>
                        <p>Современный смартфон с отличной камерой</p>
                        <div style="display: flex; justify-content: space-between; align-items: center; margin-top: 10px;">
                            <span class="product-price">29 990 ₽</span>
                            <button class="buy-btn">Купить</button>
                        </div>
                    </div>
                </div>
                <div class="product-card">
                    <div class="product-image">🎧</div>
                    <div class="product-info">
                        <h4 class="product-title">Наушники Pro</h4>
                        <p>Беспроводные наушники с шумоподавлением</p>
                        <div style="display: flex; justify-content: space-between; align-items: center; margin-top: 10px;">
                            <span class="product-price">7 990 ₽</span>
                            <button class="buy-btn">Купить</button>
                        </div>
                    </div>
                </div>
                <div class="product-card">
                    <div class="product-image">⌚</div>
                    <div class="product-info">
                        <h4 class="product-title">Умные часы</h4>
                        <p>Фитнес-трекер с измерением давления</p>
                        <div style="display: flex; justify-content: space-between; align-items: center; margin-top: 10px;">
                            <span class="product-price">12 500 ₽</span>
                            <button class="buy-btn">Купить</button>
                        </div>
                    </div>
                </div>
            </div>
            
            <div style="background: #f8f9fa; padding: 20px; border-radius: 8px; margin-top: 20px;">
                <h3>Каталог товаров</h3>
                <div style="display: flex; gap: 10px; margin-top: 15px; flex-wrap: wrap;">
                    <button class="filter-btn active">Все</button>
                    <button class="filter-btn">Электроника</button>
                    <button class="filter-btn">Бытовая техника</button>
                    <button class="filter-btn">Аксессуары</button>
                </div>
            </div>
        </div>
    `;
}

function renderServicesTemplate() {
    templateContainer.innerHTML = `
        <div class="template-content">
            <div style="background: white; padding: 20px; border-radius: 8px; box-shadow: var(--shadow);">
                <h3>Запись на услугу</h3>
                <form style="display: grid; gap: 15px;">
                    <div>
                        <label>Выберите услугу:</label>
                        <select style="width: 100%; padding: 10px; border: 1px solid #ddd; border-radius: 4px; margin-top: 5px;">
                            <option>Уборка квартиры</option>
                            <option>Ремонт бытовой техники</option>
                            <option>Юридическая консультация</option>
                            <option>Репетиторство</option>
                        </select>
                    </div>
                    <div>
                        <label>Выберите дату:</label>
                        <input type="date" style="width: 100%; padding: 10px; border: 1px solid #ddd; border-radius: 4px; margin-top: 5px;">
                    </div>
                    <div>
                        <label>Выберите время:</label>
                        <select style="width: 100%; padding: 10px; border: 1px solid #ddd; border-radius: 4px; margin-top: 5px;">
                            <option>09:00 - 11:00</option>
                            <option>11:00 - 13:00</option>
                            <option>13:00 - 15:00</option>
                            <option>15:00 - 17:00</option>
                            <option>17:00 - 19:00</option>
                        </select>
                    </div>
                    <div>
                        <label>Контактный телефон:</label>
                        <input type="tel" placeholder="+7 (XXX) XXX-XX-XX" style="width: 100%; padding: 10px; border: 1px solid #ddd; border-radius: 4px; margin-top: 5px;">
                    </div>
                    <button type="submit" style="background: var(--primary-color); color: white; border: none; padding: 15px; border-radius: 8px; cursor: pointer; font-size: 1.1rem;">Записаться</button>
                </form>
            </div>
        </div>
    `;
}

function renderEducationTemplate() {
    templateContainer.innerHTML = `
        <div class="template-content">
            <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 20px;">
                <div style="background: white; padding: 20px; border-radius: 8px; box-shadow: var(--shadow);">
                    <h3>Доступные курсы</h3>
                    <div style="display: flex; flex-direction: column; gap: 10px; margin-top: 15px;">
                        <div class="course-item" style="padding: 15px; border: 1px solid #eee; border-radius: 8px;">
                            <h4>Веб-разработка</h4>
                            <p style="color: #666; font-size: 0.9rem;">12 уроков • 48 часов</p>
                            <div style="display: flex; justify-content: space-between; align-items: center; margin-top: 10px;">
                                <span style="color: var(--primary-color); font-weight: bold;">Бесплатно</span>
                                <button class="enroll-btn">Записаться</button>
                            </div>
                        </div>
                        <div class="course-item" style="padding: 15px; border: 1px solid #eee; border-radius: 8px;">
                            <h4>Дизайн интерфейсов</h4>
                            <p style="color: #666; font-size: 0.9rem;">8 уроков • 32 часа</p>
                            <div style="display: flex; justify-content: space-between; align-items: center; margin-top: 10px;">
                                <span style="color: var(--primary-color); font-weight: bold;">9 900 ₽</span>
                                <button class="enroll-btn">Записаться</button>
                            </div>
                        </div>
                    </div>
                </div>
                
                <div style="background: white; padding: 20px; border-radius: 8px; box-shadow: var(--shadow);">
                    <h3>Прогресс обучения</h3>
                    <div style="margin-top: 15px;">
                        <div style="display: flex; justify-content: space-between; margin-bottom: 5px;">
                            <span>Веб-разработка</span>
                            <span>60%</span>
                        </div>
                        <div style="width: 100%; height: 10px; background: #eee; border-radius: 5px; overflow: hidden;">
                            <div style="width: 60%; height: 100%; background: var(--primary-color);"></div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    `;
}

function renderHealthcareTemplate() {
    templateContainer.innerHTML = `
        <div class="template-content">
            <div style="background: white; padding: 20px; border-radius: 8px; box-shadow: var(--shadow);">
                <h3>Запись к врачу</h3>
                <form style="display: grid; gap: 15px;">
                    <div>
                        <label>Выберите специалиста:</label>
                        <select style="width: 100%; padding: 10px; border: 1px solid #ddd; border-radius: 4px; margin-top: 5px;">
                            <option>Терапевт</option>
                            <option>Стоматолог</option>
                            <option>Кардиолог</option>
                            <option>Невролог</option>
                        </select>
                    </div>
                    <div>
                        <label>Выберите дату:</label>
                        <input type="date" style="width: 100%; padding: 10px; border: 1px solid #ddd; border-radius: 4px; margin-top: 5px;">
                    </div>
                    <div>
                        <label>Симптомы:</label>
                        <textarea placeholder="Опишите ваши симптомы..." style="width: 100%; padding: 10px; border: 1px solid #ddd; border-radius: 4px; margin-top: 5px; min-height: 80px;"></textarea>
                    </div>
                    <button type="submit" style="background: var(--primary-color); color: white; border: none; padding: 15px; border-radius: 8px; cursor: pointer; font-size: 1.1rem;">Записаться</button>
                </form>
            </div>
        </div>
    `;
}

function renderFinanceTemplate() {
    templateContainer.innerHTML = `
        <div class="template-content">
            <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 20px;">
                <div style="background: white; padding: 20px; border-radius: 8px; box-shadow: var(--shadow);">
                    <h3>Ваши счета</h3>
                    <div style="margin-top: 15px;">
                        <div style="display: flex; justify-content: space-between; align-items: center; padding: 10px; border-bottom: 1px solid #eee;">
                            <div>
                                <div style="font-weight: bold;">Основной счет</div>
                                <div style="color: #666; font-size: 0.9rem;">**** 1234</div>
                            </div>
                            <div style="color: var(--primary-color); font-weight: bold;">45 230 ₽</div>
                        </div>
                        <div style="display: flex; justify-content: space-between; align-items: center; padding: 10px; border-bottom: 1px solid #eee;">
                            <div>
                                <div style="font-weight: bold;">Карта Visa</div>
                                <div style="color: #666; font-size: 0.9rem;">**** 5678</div>
                            </div>
                            <div style="color: var(--primary-color); font-weight: bold;">12 500 ₽</div>
                        </div>
                    </div>
                </div>
                
                <div style="background: white; padding: 20px; border-radius: 8px; box-shadow: var(--shadow);">
                    <h3>Перевод средств</h3>
                    <form style="display: grid; gap: 10px; margin-top: 15px;">
                        <input type="text" placeholder="Номер карты получателя" style="padding: 10px; border: 1px solid #ddd; border-radius: 4px;">
                        <input type="number" placeholder="Сумма перевода" style="padding: 10px; border: 1px solid #ddd; border-radius: 4px;">
                        <button type="submit" style="background: var(--primary-color); color: white; border: none; padding: 10px; border-radius: 4px; cursor: pointer;">Перевести</button>
                    </form>
                </div>
            </div>
        </div>
    `;
}

// Cart functionality for restaurant template
let cart = [];

function addToCart(name, price) {
    const priceValue = parseInt(price.replace(' ₽', '').replace(' ', ''));
    
    const existingItem = cart.find(item => item.name === name);
    if (existingItem) {
        existingItem.quantity++;
    } else {
        cart.push({ name, price: priceValue, quantity: 1 });
    }
    
    updateCart();
}

function updateCart() {
    const cartItems = document.getElementById('cart-items');
    const totalElement = document.querySelector('#cart-items').nextElementSibling.querySelector('span');
    
    if (cart.length === 0) {
        cartItems.innerHTML = '<p>Корзина пуста</p>';
        totalElement.textContent = 'Итого: 0 ₽';
        return;
    }
    
    cartItems.innerHTML = cart.map(item => `
        <div style="display: flex; justify-content: space-between; align-items: center; padding: 10px; border-bottom: 1px solid #eee;">
            <div>
                <span style="font-weight: bold;">${item.name}</span>
                <span style="color: #666; margin-left: 10px;">x${item.quantity}</span>
            </div>
            <div style="color: var(--primary-color); font-weight: bold;">${item.price * item.quantity} ₽</div>
        </div>
    `).join('');
    
    const total = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    totalElement.textContent = `Итого: ${total} ₽`;
}

// Initialize app
console.log('Telegram Mini App initialized');