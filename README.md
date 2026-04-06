# QMA Frontend - Quantity Measurement App

A modern, responsive web application for performing mathematical operations on physical quantities across different measurement units. Built with vanilla JavaScript, HTML5, and CSS3.

## 🌟 Features

### Core Operations
- **Add** - Sum two quantities with automatic unit conversion
- **Subtract** - Find the difference between two measurements  
- **Divide** - Get dimensionless ratios between quantities
- **Compare** - Check if two measurements are equivalent
- **Convert** - Convert between different units within the same measurement type

### Measurement Types
- **Length** - Feet, Inches, Yards, Centimeters
- **Temperature** - Celsius, Fahrenheit (Compare & Convert only)
- **Volume** - Litre, Millilitre, Gallon
- **Weight** - Kilogram, Gram, Pound

### User Experience
- **Guest Mode** - Full functionality without authentication
- **User Authentication** - Login/Signup with JWT tokens
- **Operation History** - Personal calculation history (requires login)
- **Smart UI** - Dynamic operation visibility based on measurement type
- **Responsive Design** - Works on desktop, tablet, and mobile

## 📱 Application Structure

### Pages
- **Home** - Landing page with app overview and navigation
- **Dashboard** - Main application interface with all operations
- **Login** - User authentication page
- **Signup** - New user registration page

### Dashboard Operations
Each operation includes:
- **Measurement Type Selector** - Choose between Length, Temperature, Volume, Weight
- **Dynamic Unit Dropdowns** - Units update based on selected measurement type
- **Input Fields** - Enter values for calculation
- **Calculate Button** - Execute the operation
- **Clear Button** - Reset input fields
- **Result Display** - Shows calculated results with proper formatting

### Smart Features
- **Temperature Restrictions** - Only Compare & Convert operations available (mathematically appropriate)
- **Unit Conversion** - Automatic conversion between different units
- **Error Handling** - User-friendly error messages and validation
- **Guest Mode** - All operations work without login
- **History Tracking** - Personal operation history for logged-in users

## 🎨 UI/UX Features

### Navigation
- **"Try Now"** - Direct access to dashboard without login
- **"Guest"** - Login page for user authentication
- **"Go Back"** - Navigation breadcrumb on all pages (except home)
- **Responsive Navbar** - Adapts to different screen sizes

### Visual Design
- **Modern Cards** - Clean, card-based layout with shadows and gradients
- **Color-Coded Operations** - Each operation has distinct color theming
- **Enhanced Dropdowns** - Custom-styled measurement type selectors
- **Smooth Animations** - Hover effects, transitions, and micro-interactions
- **Professional Typography** - Clear hierarchy with proper spacing

### Measurement Type Selector
- **Gradient Background** - Modern card design with subtle gradients
- **Color-Coded Options** - Each measurement type has unique color theme
- **Custom Arrow** - Clean SVG dropdown arrow
- **Hover Effects** - Scale and shadow animations
- **Focus States** - Accessibility-compliant focus indicators

## 🔧 Technical Implementation

### Frontend Stack
- **HTML5** - Semantic markup with accessibility features
- **CSS3** - Modern styling with gradients, animations, and flexbox
- **Vanilla JavaScript** - No frameworks, pure JS implementation
- **Local Storage** - User session and preference persistence

### Key Files
```
├── index.html              # Main application HTML
├── css/
│   └── styles.css          # Complete styling with animations
├── js/
│   ├── config.js           # Configuration and constants
│   ├── utils.js            # Utility functions
│   ├── api.js              # API communication layer
│   ├── auth.js             # Authentication logic
│   ├── app.js              # Main application logic and routing
│   └── operations.js       # Operation implementations

### API Integration
- **Base URL**: `http://localhost:5263`
- **Authentication**: JWT Bearer tokens
- **Endpoints**:
  - `POST /api/v1/quantities/add` - Add quantities
  - `POST /api/v1/quantities/subtract` - Subtract quantities
  - `POST /api/v1/quantities/divide` - Divide quantities
  - `POST /api/v1/quantities/compare` - Compare quantities
  - `POST /api/v1/quantities/convert` - Convert units
  - `GET /api/v1/quantities/history/all` - Get operation history
  - `POST /api/auth/login` - User authentication
  - `POST /api/auth/signup` - User registration

## 🔐 Authentication

### Guest Mode
- All operations work without authentication
- History access shows login prompt
- "Guest" and "Sign Up" buttons visible in navbar

### Logged-in Mode
- Personal operation history
- User info displayed in navbar and sidebar
- "Logout" button replaces login options
- JWT token stored securely in localStorage

