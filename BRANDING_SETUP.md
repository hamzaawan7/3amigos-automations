# Company Branding Setup Guide

This attendance management system supports full customization for multiple companies. Each company can have their own logo, colors, and branding.

## Quick Setup

### 1. Update Environment Variables

Edit your `.env` file to customize your company branding:

```env
# Company Information
COMPANY_NAME="Your Company Name"
COMPANY_TAGLINE="Your Tagline Here"

# Logo Files (place in public/images/)
COMPANY_LOGO="/images/your-logo.png"
COMPANY_LOGO_DARK="/images/your-logo-dark.png"

# Brand Colors (Tailwind CSS compatible names)
BRAND_PRIMARY="blue"           # Main brand color
BRAND_PRIMARY_HEX="#3b82f6"    # Hex code for custom buttons
BRAND_SECONDARY="indigo"       # Secondary color
BRAND_SECONDARY_HEX="#6366f1"  # Hex code
BRAND_ACCENT="purple"          # Accent color
BRAND_ACCENT_HEX="#9333ea"     # Hex code
```

### 2. Add Your Logo

1. Place your logo files in `public/images/` directory
2. Recommended formats: PNG, SVG (SVG is best for scalability)
3. Recommended sizes:
   - Main logo: 200-300px width, transparent background
   - Dark logo: Same size as main logo (for dark backgrounds if needed)

Example:
```
public/
  images/
    logo.png          ← Your main logo
    logo-dark.png     ← Logo for dark backgrounds (optional)
    logo.svg          ← SVG version (recommended)
```

### 3. Clear Cache

After making changes, clear the cache:

```bash
php artisan config:clear
php artisan cache:clear
```

### 4. Rebuild Frontend Assets

```bash
npm run build
```

---

## Available Color Options

### Tailwind CSS Color Names:
- `red`, `orange`, `amber`, `yellow`, `lime`, `green`, `emerald`, `teal`, 
- `cyan`, `sky`, `blue`, `indigo`, `violet`, `purple`, `fuchsia`, `pink`, `rose`

### Color Usage:
- **PRIMARY**: Main buttons, navigation highlights, important elements
- **SECONDARY**: Secondary buttons, hover states, badges
- **ACCENT**: Special highlights, call-to-action elements

---

## Example Configurations

### Example 1: Tech Startup (Blue Theme)
```env
COMPANY_NAME="TechCo"
COMPANY_TAGLINE="Employee Management System"
COMPANY_LOGO="/images/techco-logo.svg"

BRAND_PRIMARY="blue"
BRAND_PRIMARY_HEX="#3b82f6"
BRAND_SECONDARY="cyan"
BRAND_SECONDARY_HEX="#06b6d4"
BRAND_ACCENT="indigo"
BRAND_ACCENT_HEX="#6366f1"
```

### Example 2: Creative Agency (Purple Theme)
```env
COMPANY_NAME="Creative Studio"
COMPANY_TAGLINE="Attendance & Time Tracking"
COMPANY_LOGO="/images/creative-logo.svg"

BRAND_PRIMARY="purple"
BRAND_PRIMARY_HEX="#9333ea"
BRAND_SECONDARY="fuchsia"
BRAND_SECONDARY_HEX="#d946ef"
BRAND_ACCENT="pink"
BRAND_ACCENT_HEX="#ec4899"
```

### Example 3: Finance Company (Professional Green)
```env
COMPANY_NAME="FinanceHub"
COMPANY_TAGLINE="Professional Time Management"
COMPANY_LOGO="/images/finance-logo.svg"

BRAND_PRIMARY="emerald"
BRAND_PRIMARY_HEX="#10b981"
BRAND_SECONDARY="teal"
BRAND_SECONDARY_HEX="#14b8a6"
BRAND_ACCENT="green"
BRAND_ACCENT_HEX="#22c55e"
```

### Example 4: Healthcare (Clean Blue)
```env
COMPANY_NAME="HealthCare Plus"
COMPANY_TAGLINE="Staff Attendance Portal"
COMPANY_LOGO="/images/health-logo.svg"

BRAND_PRIMARY="sky"
BRAND_PRIMARY_HEX="#0ea5e9"
BRAND_SECONDARY="blue"
BRAND_SECONDARY_HEX="#3b82f6"
BRAND_ACCENT="cyan"
BRAND_ACCENT_HEX="#06b6d4"
```

---

## Default Configuration (3 Amigos)

The system comes pre-configured for 3 Amigos:

```env
COMPANY_NAME="3 Amigos"
COMPANY_TAGLINE="Attendance Management System"
COMPANY_LOGO="/images/logo.svg"

BRAND_PRIMARY="indigo"
BRAND_PRIMARY_HEX="#6366f1"
BRAND_SECONDARY="purple"
BRAND_SECONDARY_HEX="#9333ea"
BRAND_ACCENT="blue"
BRAND_ACCENT_HEX="#3b82f6"
```

---

## What Gets Branded?

### Visual Elements:
✅ Company logo in navigation
✅ Login page branding
✅ Navigation link hover colors
✅ All buttons (primary, secondary, accent)
✅ Active page indicators
✅ Form focus colors
✅ Success/info messages
✅ Brand-colored borders
✅ Status badges
✅ Interactive elements

### Pages Affected:
✅ Login page
✅ Dashboard
✅ Attendance pages
✅ Work From Home pages
✅ Work Exceptions pages
✅ Employee management
✅ Profile pages
✅ All navigation menus

---

## Advanced Customization

### Custom Logo Styling

If you want to style your logo differently, you can update:
`resources/js/Layouts/AppLayout.jsx`

```jsx
<img 
    src={company.logo} 
    alt={company.name}
    className="h-10 w-auto"  // Adjust height here
/>
```

### Custom Button Styles

Buttons automatically use your brand colors through:
`resources/js/Components/BrandedButton.jsx`

Usage:
```jsx
<BrandedButton variant="primary">Click Me</BrandedButton>
<BrandedButton variant="secondary">Secondary</BrandedButton>
<BrandedButton variant="accent">Accent</BrandedButton>
```

### Custom Navigation Links

Navigation links auto-style with brand colors via:
`resources/js/Components/BrandedNavLink.jsx`

---

## Troubleshooting

### Logo Not Showing?
1. Check file path in `.env` matches actual file location
2. Ensure logo file is in `public/images/` directory
3. Clear cache: `php artisan config:clear`
4. Check file permissions

### Colors Not Changing?
1. Verify hex codes are valid (format: #RRGGBB)
2. Clear config cache: `php artisan config:clear`
3. Rebuild frontend: `npm run build`
4. Hard refresh browser (Ctrl+Shift+R or Cmd+Shift+R)

### Styles Look Broken?
1. Ensure Tailwind color names are spelled correctly
2. Run `npm run build` to recompile assets
3. Clear browser cache
4. Check browser console for errors

---

## For Developers

### Theme Configuration File
Location: `config/company.php`

### Theme Utilities
Location: `resources/js/utils/theme.js`

### Branded Components
- `BrandedButton.jsx` - Styled buttons
- `BrandedNavLink.jsx` - Navigation links

### Shared Props
All Inertia pages receive `company` prop with:
- `name` - Company name
- `tagline` - Company tagline
- `logo` - Logo path
- `colors` - Color configuration

---

## Multi-Tenant Setup (Optional)

For running multiple companies on the same installation, you could:

1. Create a `companies` database table
2. Store branding in database per company
3. Load branding based on subdomain or company_id
4. Pass company-specific config to frontend

This would require additional development but the foundation is already in place.

---

## Support

For questions or custom branding needs, refer to the development team.

**Current Version**: 1.0
**Last Updated**: November 2025

