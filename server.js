require('dotenv').config();
const express = require('express');
const bodyParser = require('body-parser');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Serve static files from public directory
app.use(express.static(path.join(__dirname, 'public')));

// In-memory storage for contacts (in production, use a database)
let contacts = [];

// API endpoint to save contacts
app.post('/api/contacts', (req, res) => {
    try {
        const { category, phone, timestamp } = req.body;
        
        if (!category || !phone) {
            return res.status(400).json({ error: 'Missing required fields' });
        }
        
        const contact = {
            id: Date.now().toString(),
            category: category,
            phone: phone,
            timestamp: timestamp || new Date().toISOString(),
            userAgent: req.get('User-Agent') || 'Unknown'
        };
        
        contacts.push(contact);
        
        console.log('New contact saved:', contact);
        
        res.json({ 
            success: true, 
            message: 'Contact saved successfully',
            contact: {
                id: contact.id,
                category: contact.category,
                phone: contact.phone
            }
        });
        
    } catch (error) {
        console.error('Error saving contact:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

// API endpoint to get all contacts (for admin panel)
app.get('/api/contacts', (req, res) => {
    try {
        res.json({
            success: true,
            data: contacts,
            count: contacts.length
        });
    } catch (error) {
        console.error('Error fetching contacts:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

// API endpoint to get contacts by category
app.get('/api/contacts/category/:category', (req, res) => {
    try {
        const category = req.params.category;
        const categoryContacts = contacts.filter(c => c.category === category);
        
        res.json({
            success: true,
            data: categoryContacts,
            count: categoryContacts.length,
            category: category
        });
    } catch (error) {
        console.error('Error fetching contacts by category:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

// API endpoint to delete a contact
app.delete('/api/contacts/:id', (req, res) => {
    try {
        const id = req.params.id;
        const index = contacts.findIndex(c => c.id === id);
        
        if (index === -1) {
            return res.status(404).json({ error: 'Contact not found' });
        }
        
        const deletedContact = contacts.splice(index, 1)[0];
        
        console.log('Contact deleted:', deletedContact);
        
        res.json({
            success: true,
            message: 'Contact deleted successfully',
            deletedContact: deletedContact
        });
        
    } catch (error) {
        console.error('Error deleting contact:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

// Health check endpoint
app.get('/health', (req, res) => {
    res.json({
        status: 'ok',
        timestamp: new Date().toISOString(),
        uptime: process.uptime(),
        contactsCount: contacts.length
    });
});

// Serve the main page
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// Serve template page
app.get('/template', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// Serve admin panel
app.get('/admin', (req, res) => {
    res.sendFile(path.join(__dirname, 'admin.html'));
});

// Error handling middleware
app.use((error, req, res, next) => {
    console.error('Server error:', error);
    res.status(500).json({ error: 'Internal server error' });
});

// 404 handler
app.use((req, res) => {
    res.status(404).json({ error: 'Not found' });
});

// Start server
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
    console.log(`Health check: http://localhost:${PORT}/health`);
    console.log(`API endpoints available at:`);
    console.log(`  - POST /api/contacts - Save contact`);
    console.log(`  - GET /api/contacts - Get all contacts`);
    console.log(`  - GET /api/contacts/category/:category - Get contacts by category`);
    console.log(`  - DELETE /api/contacts/:id - Delete contact`);
});

module.exports = app;