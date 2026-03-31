require('dotenv').config();
const { Telegraf, Markup } = require('telegraf');
const express = require('express');
const axios = require('axios');

const bot = new Telegraf(process.env.BOT_TOKEN);
const app = express();

// Middleware
app.use(express.json());

// Business categories
const businessCategories = [
    { id: 'restaurant', name: 'Ресторанный бизнес', icon: '🍽️' },
    { id: 'retail', name: 'Розничная торговля', icon: '🛍️' },
    { id: 'services', name: 'Услуги', icon: '🔧' },
    { id: 'education', name: 'Образование', icon: '🎓' },
    { id: 'healthcare', name: 'Медицина', icon: '🏥' },
    { id: 'finance', name: 'Финансы', icon: '💰' }
];

// Start command
bot.start((ctx) => {
    const welcomeMessage = `
Привет! 👋

Это демонстрационный бот для Telegram Mini Apps. Здесь вы можете:
• Ознакомиться с шаблонами мини-приложений для разных сфер бизнеса
• Выбрать интересующую вас сферу
• Получить контактную информацию для связи

Выберите сферу бизнеса, для которой хотите посмотреть шаблон:
    `;

    // Create inline keyboard with business categories
    const keyboard = Markup.inlineKeyboard(
        businessCategories.map(category => 
            Markup.button.callback(`${category.icon} ${category.name}`, `select_${category.id}`)
        ).concat([
            [Markup.button.url('🌐 Открыть веб-приложение', `${process.env.APP_URL}`)]
        ])
    );

    ctx.reply(welcomeMessage, keyboard);
});

// Help command
bot.help((ctx) => {
    ctx.reply('Этот бот поможет вам ознакомиться с шаблонами Telegram Mini Apps для разных сфер бизнеса. Выберите интересующую вас категорию.');
});

// Handle category selection
bot.action(/^select_(.+)$/, async (ctx) => {
    const categoryId = ctx.match[1];
    
    // Find selected category
    const category = businessCategories.find(cat => cat.id === categoryId);
    
    if (category) {
        const message = `
Вы выбрали: *${category.name}*

Для получения доступа к демо-версии шаблона мини-приложения, пожалуйста, оставьте свой номер телефона. Мы свяжемся с вами для обсуждения деталей внедрения.

Нажмите на кнопку ниже, чтобы поделиться своим номером телефона:
        `;
        
        const keyboard = Markup.inlineKeyboard([
            [Markup.button.contactRequest('📱 Поделиться номером телефона')],
            [Markup.button.callback('◀️ Назад', 'back_to_categories')]
        ]);
        
        await ctx.editMessageText(message, { 
            parse_mode: 'Markdown',
            ...keyboard 
        }).catch(() => {});
    }
});

// Handle contact sharing
bot.on('contact', async (ctx) => {
    const contact = ctx.message.contact;
    
    // Save contact information (in a real app, you'd store this in a database)
    console.log(`Contact received: ${contact.phone_number} (${contact.first_name} ${contact.last_name || ''})`);
    
    // Send confirmation and link to the template
    const message = `
Спасибо! 🙏

Мы получили ваш номер: *${contact.phone_number}*

Наши специалисты свяжутся с вами в ближайшее время для обсуждения деталей внедрения Telegram Mini App для *${getCategoryNameById(contact.user_id)}*.

А пока вы можете ознакомиться с демо-версией шаблона:
    `;
    
    const keyboard = Markup.inlineKeyboard([
        [Markup.button.url('🚀 Открыть шаблон', `${process.env.APP_URL}/template?category=${contact.user_id}`)],
        [Markup.button.callback('◀️ Назад', 'back_to_categories')]
    ]);
    
    await ctx.reply(message, { 
        parse_mode: 'Markdown',
        ...keyboard 
    });
});

// Back to categories
bot.action('back_to_categories', (ctx) => {
    const message = 'Выберите сферу бизнеса, для которой хотите посмотреть шаблон:';
    
    const keyboard = Markup.inlineKeyboard(
        businessCategories.map(category => 
            Markup.button.callback(`${category.icon} ${category.name}`, `select_${category.id}`)
        )
    );
    
    ctx.editMessageText(message, { ...keyboard });
});

// Launch the bot
if (process.env.NODE_ENV === 'production') {
    bot.launch({ webhook: { domain: process.env.WEBHOOK_URL, port: process.env.PORT } });
} else {
    bot.launch();
}

// Express server for webhook handling
app.listen(process.env.PORT || 3000, () => {
    console.log(`Server is running on port ${process.env.PORT || 3000}`);
});

// Helper function to get category name by ID
function getCategoryNameById(userId) {
    // In a real implementation, we'd store the selected category for each user
    // For now, returning a placeholder
    return "выбранной сферы";
}

console.log('Telegram Bot is running...');