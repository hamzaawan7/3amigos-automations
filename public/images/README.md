# Company Logo

## How to Add Your Logo

1. Place your company logo as `logo.jpg` in this directory
2. Recommended specifications:
   - Format: JPG or PNG
   - Dimensions: 200-300px width (height will auto-scale)
   - Background: Transparent PNG preferred, or white/matching background
   - File size: Keep under 200KB for fast loading

## Current Configuration

The system is configured to use: `/images/logo.jpg`

## For 3Amigos

Based on your website (assets/img/21.jpg), copy your logo file here as:
- `logo.jpg` - Main logo

## After Adding Logo

1. Clear cache: `php artisan config:clear`
2. Hard refresh browser (Cmd+Shift+R or Ctrl+Shift+R)
3. Logo will appear in:
   - Navigation header
   - Login page
   - Browser favicon

## Alternative Formats

If you prefer PNG or SVG:
1. Place file as `logo.png` or `logo.svg`
2. Update `.env` file:
   ```
   COMPANY_LOGO="/images/logo.png"
   ```
3. Clear cache and reload

