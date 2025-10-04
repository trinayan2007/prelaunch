# New Landing Page - Profitt

This is a standalone landing page for the Profitt social trading platform. It's completely separate from the original site and can be viewed independently.

## Features

✨ **Modern Design**
- Clean, professional layout with cyan/dark theme
- Smooth animations and transitions
- No particles.js - uses CSS animations instead
- Fully responsive for mobile, tablet, and desktop

🎨 **Sections Included**
- Hero section with call-to-action
- Platform highlights (4 key features)
- Why following traders works
- 3-step process guide
- Security features
- Global reach section
- Become a trader section
- Modern footer with social links

📱 **Interactive Elements**
- Waitlist modal with form
- Smooth scroll animations
- Hover effects on cards
- Form validation
- Success notifications

## Files Structure

```
new-landing/
├── index.html      # Main HTML file
├── styles.css      # All styling (no external dependencies)
├── script.js       # JavaScript functionality
└── README.md       # This file
```

## How to Use

### Option 1: Open Directly in Browser
Simply open `index.html` in any modern web browser (Chrome, Firefox, Edge, Safari).

### Option 2: Use a Local Server
For best results, use a local server:

**Using Python:**
```bash
cd new-landing
python -m http.server 8000
```
Then visit: http://localhost:8000

**Using Node.js (with npx):**
```bash
cd new-landing
npx http-server -p 8000
```
Then visit: http://localhost:8000

**Using VS Code:**
Install the "Live Server" extension and right-click on `index.html` → "Open with Live Server"

## Customization

### Colors
Edit the CSS variables in `styles.css` (lines 2-14):
```css
:root {
    --primary-color: #00ffff;      /* Main cyan color */
    --text-color: #ffffff;          /* Text color */
    --background-dark: #000810;     /* Dark background */
    --background-darker: #000507;   /* Darker background */
}
```

### Content
All content can be edited directly in `index.html`:
- Hero title and description
- Feature cards
- Step-by-step guide
- Footer information

### Form Submission
Currently, the form uses a simulated submission (see `script.js` line 78). To connect to a real backend:

Replace this section in `script.js`:
```javascript
// Simulate API call
await new Promise(resolve => setTimeout(resolve, 1500));
```

With your actual API call:
```javascript
const response = await fetch('/your-api-endpoint', {
    method: 'POST',
    headers: {
        'Content-Type': 'application/json',
    },
    body: JSON.stringify({ name, email })
});
const result = await response.json();
```

## Browser Compatibility

✅ Chrome (latest)
✅ Firefox (latest)
✅ Safari (latest)
✅ Edge (latest)
✅ Mobile browsers (iOS Safari, Chrome Mobile)

## Notes

- **No external dependencies** except Font Awesome (CDN) and Google Fonts
- **No particles.js** - uses pure CSS animations for background effects
- **Lightweight** - fast loading times
- **SEO-friendly** - semantic HTML structure
- **Accessible** - proper ARIA labels and keyboard navigation

## Missing Assets

You'll need to add these image files to the `new-landing` folder:
- `logo.png` - Your Profitt logo
- `favicon.ico` - Browser tab icon

You can copy these from your main project:
```bash
cp ../static/images/logo.png .
cp ../static/images/favicon.ico .
```

## License

© 2025 Profitt. All rights reserved.
