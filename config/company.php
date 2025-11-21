<?php

return [
    /*
    |--------------------------------------------------------------------------
    | Company Information
    |--------------------------------------------------------------------------
    */
    'name' => env('COMPANY_NAME', '3Amigos'),
    'tagline' => env('COMPANY_TAGLINE', 'Crafting the digital future'),
    'description' => 'An information technology, consulting, and business solutions company that helps enterprises use innovation and emerging technologies to digitally transform their businesses.',

    /*
    |--------------------------------------------------------------------------
    | Company Logo
    |--------------------------------------------------------------------------
    | Path to logo file in public directory
    */
    'logo' => env('COMPANY_LOGO', '/images/logo.jpg'),
    'logo_dark' => env('COMPANY_LOGO_DARK', '/images/logo.jpg'), // For dark backgrounds

    /*
    |--------------------------------------------------------------------------
    | Brand Colors (Tailwind CSS compatible)
    |--------------------------------------------------------------------------
    | Primary: Main brand color (buttons, links, highlights)
    | Secondary: Secondary brand color
    | Accent: Accent color for special elements
    */
    'colors' => [
        'primary' => env('BRAND_PRIMARY', 'blue'), // 3Amigos official blue
        'primary_hex' => env('BRAND_PRIMARY_HEX', '#4154f1'),

        'secondary' => env('BRAND_SECONDARY', 'indigo'),
        'secondary_hex' => env('BRAND_SECONDARY_HEX', '#5969ff'),

        'accent' => env('BRAND_ACCENT', 'sky'),
        'accent_hex' => env('BRAND_ACCENT_HEX', '#0ea5e9'),
    ],

    /*
    |--------------------------------------------------------------------------
    | Theme Settings
    |--------------------------------------------------------------------------
    */
    'theme' => [
        'sidebar_color' => env('THEME_SIDEBAR', 'gray-800'),
        'header_color' => env('THEME_HEADER', 'white'),
    ],
];

