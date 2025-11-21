<!DOCTYPE html>
<html lang="{{ str_replace('_', '-', app()->getLocale()) }}">
    <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1">
        <meta name="theme-color" content="{{ config('company.colors.primary_hex', '#4154f1') }}" />

        <title inertia>{{ config('company.name', '3Amigos') }}</title>

        <!-- Favicons -->
        <link rel="icon" href="{{ asset('images/logo.jpg') }}" type="image/jpeg">

        <!-- Google Fonts (3Amigos Branding) -->
        <link href="https://fonts.googleapis.com/css2?family=Poppins:wght@300;400;500;600;700&family=Open+Sans:wght@300;400;600;700&display=swap" rel="stylesheet">

        <!-- Scripts -->
        @routes
        @viteReactRefresh
        @vite(['resources/css/app.css', 'resources/js/app.jsx'])
        @inertiaHead
    </head>
    <body class="font-sans antialiased" style="font-family: 'Open Sans', sans-serif;">
        @inertia
    </body>
</html>

