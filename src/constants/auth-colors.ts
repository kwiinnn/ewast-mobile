/**
 * Shared design tokens for all auth-related screens (login, signup, profile).
 * Single source of truth — no more duplicated color objects.
 */
export const AuthColors = {
    /** Page background */
    background: '#F5F7F5',
    /** Primary dark text */
    dark: '#233329',
    /** Pure white */
    white: '#FFFFFF',
    /** Card / surface background */
    card: '#FFFFFF',
    /** Primary brand green */
    green: '#16A637',
    /** Light green for badges, banners, avatars */
    greenLight: '#E8F5EC',
    /** Placeholder / secondary text */
    placeholder: '#8F9BB3',
    /** Error banner background */
    errorBg: '#FFEBEE',
    /** Error text / border */
    errorText: '#E53935',
    /** Input field background */
    field: '#F0F4F1',
} as const;
