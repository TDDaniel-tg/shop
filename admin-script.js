document.addEventListener('DOMContentLoaded', function() {
    // API Base URL
    const API_URL = 'http://localhost:5000/api';
    let authToken = localStorage.getItem('authToken');
    let currentUser = null;

    // Check authentication
    if (authToken) {
        // Попробуем загрузить сохраненного пользователя
        const savedUser = localStorage.getItem('currentUser');
        if (savedUser) {
            try {
                currentUser = JSON.parse(savedUser);
                updateUserInfo();
                hideLoginModal();
                loadDashboard();
                console.log('User restored from localStorage');
            } catch (error) {
                console.log('Error restoring user, checking auth');
                checkAuth();
            }
        } else {
            checkAuth();
        }
    } else {
        // Убеждаемся, что модальное окно входа показано
        showLoginModal();
    }

    // API Helper
    async function apiCall(endpoint, options = {}) {
        const headers = {
            'Content-Type': 'application/json',
            ...options.headers
        };

        if (authToken) {
            headers['Authorization'] = `Bearer ${authToken}`;
        }

        try {
            const response = await fetch(`${API_URL}${endpoint}`, {
                ...options,
                headers
            });

            if (response.status === 401) {
                // Unauthorized - redirect to login
                localStorage.removeItem('authToken');
                localStorage.removeItem('currentUser');
                showLoginModal();
                throw new Error('Unauthorized');
            }

            return response;
        } catch (error) {
            console.error('API Error:', error);
            // Не показываем ошибку если это демо-токен
            if (!authToken || !authToken.startsWith('demo-token')) {
                throw error;
            }
            // Для демо-режима возвращаем фиктивный ответ
            return {
                ok: false,
                status: 500,
                json: async () => ({ error: 'Demo mode - API not available' })
            };
        }
    }

    // Authentication
    async function checkAuth() {
        // Если это демо-токен, просто разрешаем доступ
        if (authToken && authToken.startsWith('demo-token')) {
            const savedUser = localStorage.getItem('currentUser');
            if (savedUser) {
                currentUser = JSON.parse(savedUser);
                updateUserInfo();
                hideLoginModal();
                loadDashboard();
                return;
            }
        }

        try {
            const response = await apiCall('/auth/me');
            if (response.ok) {
                const data = await response.json();
                currentUser = data.user;
                localStorage.setItem('currentUser', JSON.stringify(currentUser));
                updateUserInfo();
                hideLoginModal();
                loadDashboard();
            } else {
                showLoginModal();
            }
        } catch (error) {
            showLoginModal();
        }
    }

    function updateUserInfo() {
        document.querySelector('.sidebar__user-name').textContent = currentUser.name;
        document.querySelector('.sidebar__user-email').textContent = currentUser.email;
    }

    function showLoginModal() {
        const modal = document.getElementById('loginModal');
        if (modal) {
            modal.style.display = 'flex'; // Показываем модальное окно
            modal.classList.add('modal--active');
            console.log('Login modal shown');
        }
    }

    function hideLoginModal() {
        const modal = document.getElementById('loginModal');
        if (modal) {
            modal.classList.remove('modal--active');
            // Дополнительно скрываем модальное окно через CSS
            modal.style.display = 'none';
            console.log('Login modal hidden');
        }
    }

    // Modal close handlers
    document.getElementById('loginModal').addEventListener('click', (e) => {
        if (e.target.id === 'loginModal') {
            // Не закрываем модальное окно входа кликом по фону
            // так как пользователь должен войти в систему
        }
    });

    // Login Form
    const loginForm = document.getElementById('loginForm');
    loginForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        
        const formData = new FormData(loginForm);
        const loginData = {
            email: formData.get('email'),
            password: formData.get('password')
        };

        // Демо-режим аутентификации
        const demoCredentials = [
            { email: 'admin@rubolka.ru', password: 'admin123' },
            { email: 'admin@gmail.com', password: 'admin' },
            { email: 'demo', password: 'demo' }
        ];

        const isValidDemo = demoCredentials.some(cred => 
            cred.email === loginData.email && cred.password === loginData.password
        );

        if (isValidDemo) {
            // Очищаем ошибки
            document.getElementById('loginError').textContent = '';
            
            // Успешный вход в демо-режиме
            authToken = 'demo-token-' + Date.now();
            currentUser = {
                name: 'Администратор',
                email: loginData.email,
                role: 'admin'
            };
            localStorage.setItem('authToken', authToken);
            localStorage.setItem('currentUser', JSON.stringify(currentUser));
            
            // Показываем уведомление сначала
            showNotification('Вход выполнен в демо-режиме', 'success');
            
            // Затем скрываем модальное окно и загружаем дашборд
            setTimeout(() => {
                updateUserInfo();
                hideLoginModal();
                loadDashboard();
            }, 100);
            
            return;
        }

        // Попытка реального API
        try {
            const response = await apiCall('/auth/login', {
                method: 'POST',
                body: JSON.stringify(loginData)
            });

            if (response.ok) {
                // Очищаем ошибки
                document.getElementById('loginError').textContent = '';
                
                const data = await response.json();
                authToken = data.token;
                currentUser = data.user;
                localStorage.setItem('authToken', authToken);
                localStorage.setItem('currentUser', JSON.stringify(currentUser));
                
                // Показываем уведомление
                showNotification('Вход выполнен успешно', 'success');
                
                // Затем скрываем модальное окно и загружаем дашборд
                setTimeout(() => {
                    updateUserInfo();
                    hideLoginModal();
                    loadDashboard();
                }, 100);
            } else {
                const error = await response.json();
                document.getElementById('loginError').textContent = error.error || 'Неверные учетные данные';
            }
        } catch (error) {
            document.getElementById('loginError').textContent = 'Неверные учетные данные. Попробуйте: admin@rubolka.ru / admin123';
        }
    });

    // Logout
    document.querySelector('.sidebar__logout').addEventListener('click', async () => {
        if (confirm('Вы уверены, что хотите выйти?')) {
            try {
                if (!authToken || !authToken.startsWith('demo-token')) {
                    await apiCall('/auth/logout', { method: 'POST' });
                }
            } catch (error) {
                // Continue with logout even if API call fails
            }
            
            localStorage.removeItem('authToken');
            localStorage.removeItem('currentUser');
            authToken = null;
            currentUser = null;
            showLoginModal();
            showNotification('Вы вышли из системы', 'info');
        }
    });

    // Navigation
    const navLinks = document.querySelectorAll('.sidebar__link');
    const sections = document.querySelectorAll('.content-section');

    navLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            const targetId = link.getAttribute('href').substring(1);
            
            // Update active states
            navLinks.forEach(l => l.classList.remove('sidebar__link--active'));
            link.classList.add('sidebar__link--active');
            
            sections.forEach(s => s.classList.remove('content-section--active'));
            const targetSection = document.getElementById(targetId);
            if (targetSection) {
                targetSection.classList.add('content-section--active');
                
                // Load section data
                switch(targetId) {
                    case 'dashboard':
                        loadDashboard();
                        break;
                    case 'products':
                        loadProducts();
                        break;
                    case 'orders':
                        loadOrders();
                        break;
                    case 'analytics':
                        loadAnalytics();
                        break;
                }
            }
        });
    });

    // Dashboard
    async function loadDashboard() {
        try {
            const response = await apiCall('/admin/dashboard');
            if (response.ok) {
                const data = await response.json();
                
                // Update statistics
                const statValues = document.querySelectorAll('.stat-card__value');
                if (statValues.length >= 4) {
                    statValues[0].textContent = data.statistics?.totalOrders || 0;
                    statValues[1].textContent = data.statistics?.todayOrders || 0;
                    statValues[2].textContent = data.statistics?.totalProducts || 0;
                    statValues[3].textContent = data.statistics?.newOrders || 0;
                }
                
                // Update recent orders table
                const tbody = document.getElementById('recentOrdersTable');
                if (tbody) {
                    tbody.innerHTML = '';
                    
                    if (!data.recentOrders || data.recentOrders.length === 0) {
                        tbody.innerHTML = '<tr><td colspan="7" class="table-empty">Нет данных</td></tr>';
                    } else {
                        data.recentOrders.forEach(order => {
                            const row = createOrderRow(order);
                            tbody.appendChild(row);
                        });
                    }
                }
            }
        } catch (error) {
            console.error('Error loading dashboard:', error);
            // Show fallback data
            showFallbackDashboard();
        }
    }

    function showFallbackDashboard() {
        // Set default values when API is not available
        const statValues = document.querySelectorAll('.stat-card__value');
        if (statValues.length >= 4) {
            statValues[0].textContent = '0';
            statValues[1].textContent = '0';
            statValues[2].textContent = '0';
            statValues[3].textContent = '0';
        }
        
        const tbody = document.getElementById('recentOrdersTable');
        if (tbody) {
            tbody.innerHTML = '<tr><td colspan="7" class="table-empty">Нет подключения к серверу</td></tr>';
        }
    }

    function createOrderRow(order) {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${order.orderNumber}</td>
            <td>${getOrderTypeLabel(order.type)}</td>
            <td>${order.customer.name}</td>
            <td>${order.customer.phone}</td>
            <td><span class="status status--${order.status}">${getStatusLabel(order.status)}</span></td>
            <td>${new Date(order.createdAt).toLocaleDateString('ru-RU')}</td>
            <td>
                <button class="btn-icon" onclick="viewOrder('${order._id}')">👁</button>
            </td>
        `;
        return row;
    }

    function getOrderTypeLabel(type) {
        const labels = {
            'price_request': 'Запрос цены',
            'samples': 'Образцы',
            'custom_order': 'Индивидуальный заказ',
            'catalog_request': 'Запрос каталога',
            'quick_order': 'Быстрый заказ'
        };
        return labels[type] || type;
    }

    function getStatusLabel(status) {
        const labels = {
            'new': 'Новый',
            'processing': 'В обработке',
            'completed': 'Завершен',
            'cancelled': 'Отменен'
        };
        return labels[status] || status;
    }

    // Products
    async function loadProducts() {
        try {
            const response = await apiCall('/products');
            if (response.ok) {
                const data = await response.json();
                const tbody = document.getElementById('productsTable');
                tbody.innerHTML = '';
                
                if (data.products.length === 0) {
                    tbody.innerHTML = '<tr><td colspan="7" class="table-empty">Нет товаров</td></tr>';
                } else {
                    data.products.forEach(product => {
                        const row = createProductRow(product);
                        tbody.appendChild(row);
                    });
                }
            }
        } catch (error) {
            console.error('Error loading products:', error);
        }
    }

    function createProductRow(product) {
        const row = document.createElement('tr');
        const primaryImage = product.images.find(img => img.isPrimary) || product.images[0];
        
        row.innerHTML = `
            <td><img src="${primaryImage?.url || 'assets/placeholder.png'}" alt="${product.name}" style="width: 50px; height: 50px; object-fit: cover;"></td>
            <td>${product.name}</td>
            <td>${getCategoryLabel(product.category)}</td>
            <td>${getFabricLabel(product.fabric)}</td>
            <td>${product.minOrder} шт.</td>
            <td><span class="status status--${product.status}">${getProductStatusLabel(product.status)}</span></td>
            <td>
                <button class="btn-icon" onclick="editProduct('${product._id}')">✏️</button>
                <button class="btn-icon" onclick="deleteProduct('${product._id}')">🗑️</button>
            </td>
        `;
        return row;
    }

    function getCategoryLabel(category) {
        const labels = {
            'women': 'Женские',
            'men': 'Мужские',
            'unisex': 'Унисекс'
        };
        return labels[category] || category;
    }

    function getFabricLabel(fabric) {
        const labels = {
            'cotton': '100% хлопок',
            'polyester': '100% полиэстер',
            'cotton-polyester': 'Хлопок + полиэстер',
            'viscose': 'Вискоза',
            'lycra': 'С добавлением лайкры',
            'other': 'Другое'
        };
        return labels[fabric] || fabric;
    }

    function getProductStatusLabel(status) {
        const labels = {
            'active': 'Активный',
            'inactive': 'Неактивный',
            'draft': 'Черновик'
        };
        return labels[status] || status;
    }

    // Product Modal
    const productModal = document.getElementById('productModal');
    const addProductBtn = document.getElementById('addProductBtn');
    const productForm = document.getElementById('productForm');
    
    addProductBtn.addEventListener('click', () => {
        productModal.classList.add('modal--active');
        productForm.reset();
    });

    document.querySelectorAll('.modal__close, .modal__cancel').forEach(btn => {
        btn.addEventListener('click', () => {
            productModal.classList.remove('modal--active');
        });
    });

    // Product Form Submission
    productForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        
        const formData = new FormData(productForm);
        const productData = {
            name: formData.get('name'),
            description: formData.get('description'),
            category: formData.get('category'),
            fabric: formData.get('fabric'),
            fabricComposition: formData.get('fabricComposition'),
            minOrder: parseInt(formData.get('minOrder')),
            sizes: Array.from(formData.getAll('sizes')).map(size => ({
                size,
                available: true
            })),
            colors: [], // Add color picker in future
            images: [], // Handle file upload separately
            status: 'active'
        };

        try {
            const response = await apiCall('/products', {
                method: 'POST',
                body: JSON.stringify(productData)
            });

            if (response.ok) {
                productModal.classList.remove('modal--active');
                loadProducts();
                alert('Товар успешно добавлен!');
            } else {
                const error = await response.json();
                alert('Ошибка: ' + (error.error || 'Не удалось добавить товар'));
            }
        } catch (error) {
            alert('Ошибка соединения с сервером');
        }
    });

    // Orders
    async function loadOrders() {
        try {
            const response = await apiCall('/orders');
            if (response.ok) {
                const data = await response.json();
                const tbody = document.getElementById('ordersTable');
                tbody.innerHTML = '';
                
                if (data.orders.length === 0) {
                    tbody.innerHTML = '<tr><td colspan="8" class="table-empty">Нет заявок</td></tr>';
                } else {
                    data.orders.forEach(order => {
                        const row = createFullOrderRow(order);
                        tbody.appendChild(row);
                    });
                }
            }
        } catch (error) {
            console.error('Error loading orders:', error);
        }
    }

    function createFullOrderRow(order) {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${order.orderNumber}</td>
            <td>${getOrderTypeLabel(order.type)}</td>
            <td>${order.customer.name}</td>
            <td>${order.customer.phone}<br>${order.customer.email}</td>
            <td>${order.message || '-'}</td>
            <td><span class="status status--${order.status}">${getStatusLabel(order.status)}</span></td>
            <td>${new Date(order.createdAt).toLocaleDateString('ru-RU')}</td>
            <td>
                <button class="btn-icon" onclick="updateOrderStatus('${order._id}')">✓</button>
            </td>
        `;
        return row;
    }

    // Add CSS for status badges
    const style = document.createElement('style');
    style.textContent = `
        .status {
            padding: 4px 8px;
            border-radius: 4px;
            font-size: 12px;
            font-weight: 500;
        }
        
        .status--new {
            background-color: #dbeafe;
            color: #1e40af;
        }
        
        .status--processing {
            background-color: #fef3c7;
            color: #92400e;
        }
        
        .status--completed {
            background-color: #d1fae5;
            color: #065f46;
        }
        
        .status--cancelled {
            background-color: #fee2e2;
            color: #991b1b;
        }
        
        .status--active {
            background-color: #d1fae5;
            color: #065f46;
        }
        
        .status--inactive {
            background-color: #f3f4f6;
            color: #6b7280;
        }
        
        .status--draft {
            background-color: #e0e7ff;
            color: #3730a3;
        }
        
        .btn-icon {
            background: none;
            border: none;
            font-size: 16px;
            cursor: pointer;
            padding: 4px;
            margin: 0 2px;
        }
        
        .btn-icon:hover {
            opacity: 0.7;
        }
        
        .header-filters {
            display: flex;
            gap: 16px;
        }
    `;
    document.head.appendChild(style);

    // Make functions global for onclick handlers
    window.viewOrder = async (orderId) => {
        // Implement order view modal
        console.log('View order:', orderId);
    };

    window.editProduct = async (productId) => {
        // Implement product edit
        console.log('Edit product:', productId);
    };

    window.deleteProduct = async (productId) => {
        if (confirm('Вы уверены, что хотите удалить этот товар?')) {
            try {
                const response = await apiCall(`/products/${productId}`, {
                    method: 'DELETE'
                });
                
                if (response.ok) {
                    loadProducts();
                    alert('Товар удален');
                }
            } catch (error) {
                alert('Ошибка при удалении товара');
            }
        }
    };

    window.updateOrderStatus = async (orderId) => {
        const newStatus = prompt('Введите новый статус (new/processing/completed/cancelled):');
        if (newStatus) {
            try {
                const response = await apiCall(`/orders/${orderId}/status`, {
                    method: 'PATCH',
                    body: JSON.stringify({ status: newStatus })
                });
                
                if (response.ok) {
                    loadOrders();
                    alert('Статус обновлен');
                }
            } catch (error) {
                alert('Ошибка при обновлении статуса');
            }
        }
    };

    // Analytics Functions
    async function loadAnalytics() {
        try {
            // Show fallback analytics since API might not be ready
            showFallbackAnalytics();
        } catch (error) {
            console.error('Error loading analytics:', error);
            showFallbackAnalytics();
        }
    }

    function showFallbackAnalytics() {
        // Update analytics summary
        const conversionRate = document.getElementById('conversionRate');
        const avgOrderValue = document.getElementById('avgOrderValue');
        const avgResponseTime = document.getElementById('avgResponseTime');
        
        if (conversionRate) conversionRate.textContent = '0%';
        if (avgOrderValue) avgOrderValue.textContent = '0 ₽';
        if (avgResponseTime) avgResponseTime.textContent = '0 мин';
        
        // Update source statistics
        const sourceStats = document.querySelectorAll('.source-stat__value');
        sourceStats.forEach(stat => stat.textContent = '0');
    }

    // Settings Functions
    const generalSettingsForm = document.getElementById('generalSettings');
    const emailSettingsForm = document.getElementById('emailSettings');
    
    if (generalSettingsForm) {
        generalSettingsForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            showNotification('Настройки сохранены (демо режим)', 'success');
        });
    }
    
    if (emailSettingsForm) {
        emailSettingsForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            showNotification('Email настройки сохранены (демо режим)', 'success');
        });
    }

    // System actions
    const createBackupBtn = document.getElementById('createBackup');
    const clearLogsBtn = document.getElementById('clearLogs');
    const resetSettingsBtn = document.getElementById('resetSettings');
    
    if (createBackupBtn) {
        createBackupBtn.addEventListener('click', () => {
            if (confirm('Создать резервную копию базы данных?')) {
                showNotification('Резервная копия создана (демо режим)', 'success');
            }
        });
    }
    
    if (clearLogsBtn) {
        clearLogsBtn.addEventListener('click', () => {
            if (confirm('Очистить все логи?')) {
                showNotification('Логи очищены (демо режим)', 'success');
            }
        });
    }
    
    if (resetSettingsBtn) {
        resetSettingsBtn.addEventListener('click', () => {
            if (confirm('Сбросить все настройки к значениям по умолчанию?')) {
                showNotification('Настройки сброшены (демо режим)', 'success');
            }
        });
    }

    // Notification system
    function showNotification(message, type = 'info') {
        // Create notification element if it doesn't exist
        let notification = document.querySelector('.notification');
        if (!notification) {
            notification = document.createElement('div');
            notification.className = 'notification';
            notification.style.cssText = `
                position: fixed;
                top: 20px;
                right: 20px;
                padding: 16px 24px;
                border-radius: 8px;
                color: white;
                font-weight: 500;
                z-index: 10000;
                min-width: 300px;
                transform: translateX(100%);
                transition: transform 0.3s ease;
            `;
            document.body.appendChild(notification);
        }
        
        // Set colors based on type
        switch(type) {
            case 'success':
                notification.style.backgroundColor = '#10b981';
                break;
            case 'error':
                notification.style.backgroundColor = '#ef4444';
                break;
            case 'warning':
                notification.style.backgroundColor = '#f59e0b';
                break;
            default:
                notification.style.backgroundColor = '#3b82f6';
        }
        
        notification.textContent = message;
        
        // Show notification
        setTimeout(() => {
            notification.style.transform = 'translateX(0)';
        }, 100);
        
        // Hide after 3 seconds
        setTimeout(() => {
            notification.style.transform = 'translateX(100%)';
        }, 3000);
    }

    // Enhanced dashboard with real-time updates
    let dashboardInterval;
    
    function startDashboardUpdates() {
        dashboardInterval = setInterval(() => {
            const activeSection = document.querySelector('.content-section--active');
            if (activeSection && activeSection.id === 'dashboard') {
                loadDashboard();
            }
        }, 30000); // Update every 30 seconds
    }
    
    function stopDashboardUpdates() {
        if (dashboardInterval) {
            clearInterval(dashboardInterval);
        }
    }

    // Start updates when dashboard is active
    document.querySelector('[href="#dashboard"]')?.addEventListener('click', startDashboardUpdates);
    
    // Stop updates when switching away
    navLinks.forEach(link => {
        if (link.getAttribute('href') !== '#dashboard') {
            link.addEventListener('click', stopDashboardUpdates);
        }
    });

    // Enhanced mobile menu
    const mobileMenuBtn = document.createElement('button');
    mobileMenuBtn.className = 'mobile-menu-btn';
    mobileMenuBtn.innerHTML = '☰';
    mobileMenuBtn.style.cssText = `
        display: none;
        position: fixed;
        top: 20px;
        left: 20px;
        z-index: 1001;
        background: var(--color-dark);
        color: white;
        border: none;
        padding: 10px;
        border-radius: 4px;
        font-size: 18px;
        cursor: pointer;
    `;
    
    // Mobile responsive
    function handleMobileView() {
        const sidebar = document.querySelector('.sidebar');
        const mainContent = document.querySelector('.main-content');
        
        if (window.innerWidth <= 768) {
            mobileMenuBtn.style.display = 'block';
            sidebar.style.transform = 'translateX(-100%)';
            mainContent.style.marginLeft = '0';
            
            mobileMenuBtn.onclick = () => {
                const isVisible = sidebar.style.transform === 'translateX(0px)';
                sidebar.style.transform = isVisible ? 'translateX(-100%)' : 'translateX(0px)';
            };
        } else {
            mobileMenuBtn.style.display = 'none';
            sidebar.style.transform = 'translateX(0px)';
            mainContent.style.marginLeft = 'var(--sidebar-width)';
        }
    }
    
    document.body.appendChild(mobileMenuBtn);
    window.addEventListener('resize', handleMobileView);
    handleMobileView();
}); 